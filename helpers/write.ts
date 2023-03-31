import { AddBookForm, AddChapterForm } from "@/validations/addBookForm";
import { CreateBook, GetBookResponse, UpdateBook } from "@/validations/backend/books";
import axios, { AxiosProgressEvent } from "axios";

export type Identifier = {
  isCover?: boolean,
  chapter?: AddChapterForm
}

/**
 * 
 * @param url Presigned URL for S3 bucket
 * @param data Information that will be sent to S3
 * @param uploadProgress Callback function to indicate the progress for the upload
 */
async function UploadToS3(url: string, data: File | Blob, uploadProgress?: (event: AxiosProgressEvent, identifier: Identifier) => void, identifier?: Identifier) {
  await axios(url, {
    method: "PUT",
    headers: {
      'Contente-Type': "multipart/form-data"
    },
    data: data,
    onUploadProgress: (event) => {
      uploadProgress && uploadProgress(event, identifier ?? {})
    }
  })
}


/**
 * 
 * @param data Data in the format used by components
 * @param uploadProgress Callback function to indicate the progress for each upload
 * @returns Object in the format that the backend expects to add a book
 */
export async function buildAddBookFormData(data: AddBookForm, uploadProgress?: (event: AxiosProgressEvent, identifier: Identifier) => void) {

  let coverName = ''
  if(data.cover) {
    const { url, filename } = await fetch('/api/books/presignedUrl').then(res => res.json())
    
    await UploadToS3(url, data.cover, uploadProgress, {isCover: true})
    coverName = filename
  }

  if(data.chapters) {
    for(const c of data.chapters) {
      var chapter = new Blob([c.content], {type: 'text/plain'});
      const { url, filename } = await fetch('/api/books/presignedUrl').then(res => res.json())
      await UploadToS3(url, chapter, uploadProgress, {chapter: c})
      c.content = filename;
    }
  }

  const chapters = data.chapters.map(item => {
    return {
      order: item.order,
      title: item.title,
      content: item.content,
      notes: item.notes
    }
  })

  const body: CreateBook = {
    genres: data.selectedGenres.map(g => { return {id: g} }),
    tags: data.selectedTags.map(t => { return {id: t} }),
    synopsis: data.synopsis,
    title: data.title,
    cover: coverName,
    chapters: chapters
  }

  return body; 
}

/**
 * 
 * @param data Data in the format used by components
 * @param originalData Original Data before any changes
 * @param bookId Book identifier
 * @param uploadProgress Callback function to indicate the progress for each upload
 * @returns Object in the format that the backend expects to updatw a book
 */
export async function buildUpdateBookFormData(data: AddBookForm, originalData: GetBookResponse, bookId: string, uploadProgress?: (event: AxiosProgressEvent, identifier: Identifier) => void) {
  // const formData:any = new FormData();
  
  let coverName = originalData.originalCoverName
  if (typeof data.cover !== 'string') {
    // it change, send the new one
    if(data.cover) {
      /**
       * The endpoint will delete the old image from s3 and return a new presigned url and filename to upload the new image
       */
      const { url, filename } = await fetch(`/api/books/${bookId}/${coverName}`).then(res => res.json())      
      
      await UploadToS3(url, data.cover, uploadProgress, { isCover: true })
      coverName = filename
    }
  }

  let deletedChapters = originalData.chapters;
  const addeddChapters: AddChapterForm[]  = []
  const modifiedChapters: AddChapterForm[] = []
  if(data.chapters) {
    for (const c of data.chapters) {
      const chapterFound = deletedChapters.find(oc => oc.id === c.id)
      if (chapterFound) {
        if (c.title !== chapterFound.title || c.content !== chapterFound.content || c.notes !== chapterFound.notes) {
          
          if(c.content !== chapterFound.content) {
            // delete old chapter in s3 and upload new one
            const { url, filename } = await fetch(`/api/books/${bookId}/${chapterFound.originalContentName}`).then(res => res.json())
            var chapter = new Blob([c.content], {type: 'text/plain'});
            await UploadToS3(url, chapter, uploadProgress, { chapter: c })
            c.content = filename
          }
          modifiedChapters.push(c)
        } 
        deletedChapters = deletedChapters.filter(dc => dc.id !== chapterFound.id)
      } else {
        const { url, filename } = await fetch('/api/books/presignedUrl').then(res => res.json())
        var chapter = new Blob([c.content], {type: 'text/plain'});
        await UploadToS3(url, chapter, uploadProgress, { chapter: c })
        c.content = filename;
        addeddChapters.push(c);
      }
    }
  }
  const chapters = addeddChapters.map(item => {
    return {
      order: item.order,
      title: item.title,
      content: item.content,
      notes: item.notes
    }
  })

  const updateChapters = modifiedChapters.map(item => {
    return {
      where: {
        id: item.id
      },
      data: {
        title: item.title,
        notes: item.notes,
        // content: item.content
      }
    }
  })

  const chapterToDelete = deletedChapters.map(c => { return { id: c.id } });

  // Genres
  const connetGenres = data.selectedGenres.filter(g => !originalData.genres.includes(g)).map(item => { return {id: item} }) 
  const disconnetGenres = originalData.genres.filter(g => !data.selectedGenres.includes(g)).map((item: number) => { return {id: item} }) 

  // Tags
  const connetTags = data.selectedTags.filter(t => !originalData.tags.includes(t)).map(item => { return {id: item} }) 
  const disconnetTags = originalData.tags.filter(t => !data.selectedTags.includes(t)).map((item: number) => { return {id: item} }) 

  const body: UpdateBook = {
    cover: coverName,
    title: data.title,
    synopsis: data.synopsis,
    genres: {
      connect: connetGenres,
      disconnect: disconnetGenres
    },
    tags: {
      connect: connetTags,
      disconnect: disconnetTags
    },
    chapters: {
      delete: chapterToDelete,
      create: chapters,
      update: updateChapters
    }
  }

  return body;
}