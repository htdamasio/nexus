import prisma from "@/lib/prisma";
import multer, { Multer } from 'multer';
import { Request, Response } from 'express';
import { S3Client, PutObjectCommand, PutObjectCommandInput, DeleteObjectCommandInput, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from 'crypto'
import { AddChapterForm, serverBookSchema } from "@/validations/addBookForm";
import { getToken } from "next-auth/jwt"
import { serverUpdateBookSchema } from "@/validations/updateBook";

const storage = multer.memoryStorage()
const upload: Multer = multer({ storage: storage });

// const upload = multer({ storage: storage })
const randomFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.S3_ACCESS_KEY ?? ''
const secretAccessKey = process.env.SECRET_S3_ACCESS_KEY ?? ''
const secret = process.env.NEXTAUTH_SECRET

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion
})

type chapterContent = {
  name: string,
  order: number
}

function runMiddleware(req: Request, res: Response, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

async function addBook(req: Request, res: Response) {
  try {
    const token = await getToken({ req, secret })
    const email = token?.email

    /**
     * Validation
     */ 

    if(!email || !email.length) {
      return res.status(500).json({ message: 'Error on add book', success: false });
    }

    req.body.genres = req.body.genres.split(',').map((id: string) => Number(id))
    req.body.tags = req.body.tags.split(',').map((id: string) => Number(id))

    let chapters = []
    if (typeof req.body.chapters === 'string') {
      const chapter = JSON.parse(req.body.chapters)
      chapters.push(chapter);
    } else {
        chapters = req.body.chapters.map((c: string) => {
        const chapter = JSON.parse(c);
        return chapter;
      }) 
    }
    req.body.chapters = chapters

    const isValidData = serverBookSchema.safeParse(req.body);
    if (!isValidData.success) {
      return res.status(406).json({message: 'Invalid Data', errors: isValidData.error})
    }

    let hasChapter = false;
    req.files?.forEach(f => {
      if(!f.mimetype.includes('image/')) {
        hasChapter = true 
      }
    })
    if(!hasChapter) {
      return res.status(406).json({message: 'Invalid Files', errors: 'Missing files'})
    }

    // Everithing is fine, can proceed for S3 upload and database creation

    const files = req.files;
    let coverName = ''

    let chapterNames: chapterContent[] = []
    
    await Promise.all(files?.map(async file => {
      const fileName = randomFileName()
      const params: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype
      }
      const command = new PutObjectCommand(params)
      
      await s3.send(command)
      if(file.mimetype.includes('image/')) {
          coverName = fileName
      }
      else {
        const chapter: chapterContent = {
          name: fileName,
          order: Number(file.originalname)
        }
        chapterNames.push(chapter)
      }
    }))

    chapters = []
    chapters = req.body.chapters.map((c: AddChapterForm, i: number) => {
      const chapterFound = chapterNames.find(chap => chap.order === c.order) 
      if (chapterFound) {
        c.content = chapterNames[i].name
        delete c.id;
        return c;
      }
    }) 
      
    const tags = req.body.tags.map((id: number) =>  { 
      return {
        id: id
      }
    })
    
    const genres = req.body.genres.map((id: number) =>  { 
      return {
        id: id
      }
    })

    const book = await prisma.book.create({
      data: {
        cover: coverName,
        synopsis: req.body.synopsis,
        title: req.body.title,
        author: {
          connect: {
            email: email
          }
        }, 
        genres: {
          connect: genres,
        },
        tags: {
          connect: tags
        },
        chapters: {
          create: chapters 
        },
      }
    })

    return res.status(200).json({ book, success: true });
  } catch (err) {
    res.status(500).json({ error: 'Unexpected Error', success: false })
  }
}

async function updateBook(req: Request, res: Response) {
  try {
    const token = await getToken({ req, secret })
    const email = token?.email

    /**
     * Validation
     */ 
    if(!email || !email.length) {
      return res.status(500).json({ message: 'Error while updating book', success: false });
    }

    const bookToUpdate = await prisma.book.findUnique({
      where: {
        id: req.body.bookId
      },
      include: {
        chapters: {
          select: {
            content: true,
            id: true,
            order: true
          }
        },
        author:{
          select: {
            email: true
          }
        },
        genres: true,
        tags: true
      }
    
    })    

    if (!bookToUpdate) {
      return res.status(404).json({ message: 'Book not found', success: false });
    }

    if (bookToUpdate.author.email !== email) {
      return res.status(405).json({ message: 'no permission to update', success: false });  
    }

    if (req.body.genres) {
      req.body.genres = req.body.genres.split(',').map((id: string) => Number(id))
    }

    if(req.body.tags) {
      req.body.tags = req.body.tags.split(',').map((id: string) => Number(id))
    }

    if (req.body.modifiedChapters) {
      let chapters = []
      if (typeof req.body.modifiedChapters === 'string') {
        const chapter = JSON.parse(req.body.modifiedChapters)
        chapters.push(chapter);
      } else {
          chapters = req.body.modifiedChapters.map((c: string) => {
          const chapter = JSON.parse(c);
          return chapter;
        }) 
      }
      req.body.modifiedChapters = chapters
    }

    if (req.body.deletedChapters) {
      let chapters = []
      if (typeof req.body.deletedChapters === 'string') {
        const chapter = JSON.parse(req.body.deletedChapters)
        chapters.push(chapter);
      } else {
          chapters = req.body.deletedChapters.map((c: string) => {
          const chapter = JSON.parse(c);
          return chapter;
        }) 
      }
      req.body.deletedChapters = chapters
    }

    if (req.body.addedChapters) {
      let chapters = []
      if (typeof req.body.addedChapters === 'string') {
        const chapter = JSON.parse(req.body.addedChapters)
        chapters.push(chapter);
      } else {
          chapters = req.body.addedChapters.map((c: string) => {
          const chapter = JSON.parse(c);
          return chapter;
        }) 
      }
      req.body.addedChapters = chapters
    }
    
    const isValidData = serverUpdateBookSchema.safeParse(req.body);
    if (!isValidData.success) {
      return res.status(406).json({message: 'Invalid Data', errors: isValidData.error})
    }

    let hasImage = false;
    let hasChapter = false;
    req.files?.forEach(f => {
      if(f.mimetype.includes('image/')) {
        hasImage = true 
      } else {
        hasChapter = true 
      }
    })

    if (!hasImage && req.body.coverChange) {
      return res.status(406).json({message: 'Invalid Data', errors: 'Missing files'})
    }

    if(!hasChapter && (req.body.modifiedChapters || req.body.deletedChapters || req.body.addedChapters)) {
      return res.status(406).json({message: 'Invalid Files', errors: 'Missing files'})
    }

    // All fine, lets start the changes
    
    let coverName = bookToUpdate.cover;
    if (req.body.coverChange) {
      if (bookToUpdate.cover.length > 0) {
        const params: DeleteObjectCommandInput = {
          Bucket: bucketName,
          Key: bookToUpdate.cover
        }
        const command = new DeleteObjectCommand(params)
        await s3.send(command)
      }

      const file = req.files?.find(file => file.mimetype.includes('image/'));

      if(file) {
        coverName = randomFileName()
        const params: PutObjectCommandInput = {
          Bucket: bucketName,
          Key: coverName,
          Body: file.buffer,
          ContentType: file.mimetype
        }
        const command = new PutObjectCommand(params)
        
        await s3.send(command)
      }
    }

    const idsToDelete = [];
    if (req.body.deletedChapters) {
      for (const chapterToDelete of req.body.deletedChapters) {
        const foundChapter = bookToUpdate.chapters.find(c => c.id === chapterToDelete.id)

        if (foundChapter) {
          idsToDelete.push({
            id: foundChapter.id
          })
          const params: DeleteObjectCommandInput = {
            Bucket: bucketName,
            Key: foundChapter.content,
          }
          const command = new DeleteObjectCommand(params)
          await s3.send(command)
        }
      }
      // delete chapters from S3
    }

    const chaptersToUpdate = []
    if (req.body.modifiedChapters) {
      for(const chapter of req.body.modifiedChapters) {
        
        const foundChapter = bookToUpdate.chapters.find(c => c.id === chapter.id)
        const foundFile = req.files?.find(f => Number(f.originalname) === chapter.order)
        
        if (foundChapter && foundFile) {
          const params: PutObjectCommandInput = {
            Bucket: bucketName,
            Key: foundChapter.content,
            Body: foundFile.buffer,
            ContentType: foundFile.mimetype
          }
          const command = new PutObjectCommand(params)
          await s3.send(command)
          let chapterToUpdate = {
            where: {
              id: foundChapter.id
            },
            data: {
              // content: foundChapter.content,
              title: chapter.title,
              notes: chapter.notes
            }
          } 
          chaptersToUpdate.push(chapterToUpdate)
        }
      }
      // reupload files to S3 with the same key
    }

    let chaptersToAdd = []
    if (req.body.addedChapters && req.files) {
      let chapterNames: chapterContent[] = []
      for (const chapter of req.body.addedChapters) {
        const file = req.files?.find(f => Number(f.originalname) === chapter.order)
        if(file && !file.mimetype.includes('image/')) {
          const fileName = randomFileName()
          const params: PutObjectCommandInput = {
            Bucket: bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype
          }
          const command = new PutObjectCommand(params)
          
          await s3.send(command)
          if(!file.mimetype.includes('image/')) {
            const chapter: chapterContent = {
              name: fileName,
              order: Number(file.originalname)
            }
            chapterNames.push(chapter)
          }
        }
      }
  
      chaptersToAdd = req.body.addedChapters.map((c: AddChapterForm, i: number) => {
        const chapterFound = chapterNames.find(chap => chap.order === c.order) 
        if (chapterFound) {
          c.content = chapterNames[i].name
          delete c.id;
          return c;
        }
      }) 
    }

    // update other informations in database if they were sent
    // title
    // synopsis
    // genre
    // tags

    // chapters added
    // cover if it changed
    const tags = req.body.tags.map((id: number) =>  { 
      return {
        id: id
      }
    })
    
    const genres = req.body.genres.map((id: number) =>  { 
      return {
        id: id
      }
    })

    const updatedBook = await prisma.book.update({
      where: {
        id: req.body.bookId
      },
      data: {
        cover: coverName,
        synopsis: req.body.synopsis,
        title: req.body.title,
        genres: {
          disconnect: bookToUpdate.genres.map(g => {return {id: g.id}}),
          connect: genres
        },
        tags: {
          disconnect: bookToUpdate.tags.map(t => {return {id: t.id}}),
          connect: tags
        },
        chapters: {
          delete: idsToDelete,
          create: chaptersToAdd,
          update: chaptersToUpdate
        }
      }
    })

    return res.status(200).send({ updatedBook, success: true }); 
  } catch (err) {
    return res.status(500).send({ message: 'Unexpected Error', success: false }); 
  }
}

export default async function handler(req: Request, res: Response) {
  try {
    await runMiddleware(req, res, upload.array("files"))
    switch (req.method) {
      case 'POST': await addBook   (req, res); break;
      case 'PUT' : await updateBook(req, res); break;
      default: return res.status(405).send({message: `Method ${req.method} not allowed`, success: false}); 
    }
  } catch (e) {
    return res.status(500).send({ message: 'Unexpected Error', success: false });
  }
  // return res;


  // if (req.method === 'POST') {
  //   try {
  //     const endRes = await upload.array('files')(req, res, async (err: any) => {
  //       if (err) {
  //         return res.status(500).json({ message: 'Error on add book', success: false });
  //       }
  //       const token = await getToken({ req, secret })
  //       const email = token?.email

  //       /**
  //        * Validation
  //        */ 

  //       if(!email || !email.length) {
  //         return res.status(500).json({ message: 'Error on add book', success: false });
  //       }

  //       req.body.genres = req.body.genres.split(',').map((id: string) => Number(id))
  //       req.body.tags = req.body.tags.split(',').map((id: string) => Number(id))

  //       let chapters = []
  //       if (typeof req.body.chapters === 'string') {
  //         const chapter = JSON.parse(req.body.chapters)
  //         chapters.push(chapter);
  //       } else {
  //           chapters = req.body.chapters.map((c: string) => {
  //           const chapter = JSON.parse(c);
  //           return chapter;
  //         }) 
  //       }
  //       req.body.chapters = chapters

  //       const isValidData = serverBookSchema.safeParse(req.body);
  //       if (!isValidData.success) {
  //        return res.status(406).json({message: 'Invalid Data', errors: isValidData.error})
  //       }

  //       let hasChapter = false;
  //       req.files?.forEach(f => {
  //         if(!f.mimetype.includes('image/')) {
  //           hasChapter = true 
  //         }
  //       })
  //       if(!hasChapter) {
  //        return res.status(406).json({message: 'Invalid Files', errors: 'Missing files'})
  //       }

  //       // Everithing is fine, can proceed for S3 upload and database creation
  
  //       const files = req.files;
  //       let coverName = ''
  //       type chapterContent = {
  //         name: string,
  //         order: number
  //       }

  //       let chapterNames: chapterContent[] = []
        
  //       await Promise.all(files?.map(async file => {
  //         const fileName = randomFileName()
  //         const params: PutObjectCommandInput = {
  //           Bucket: bucketName,
  //           Key: fileName,
  //           Body: file.buffer,
  //           ContentType: file.mimetype
  //         }
  //         const command = new PutObjectCommand(params)
          
  //         await s3.send(command)
  //         if(file.mimetype.includes('image/')) {
  //             coverName = fileName
  //         }
  //         else {
  //           const chapter: chapterContent = {
  //             name: fileName,
  //             order: Number(file.originalname)
  //           }
  //           chapterNames.push(chapter)
  //         }
  //       }))

  //       chapters = []
  //       chapters = req.body.chapters.map((c: AddChapterForm, i: number) => {
  //         const chapterFound = chapterNames.find(chap => chap.order === c.order) 
  //         if (chapterFound) {
  //           c.content = chapterNames[i].name
  //           delete c.id;
  //           return c;
  //         }
  //       }) 
          
  //       const tags = req.body.tags.map((id: number) =>  { 
  //         return {
  //           id: id
  //         }
  //       })
        
  //       const genres = req.body.genres.map((id: number) =>  { 
  //         return {
  //           id: id
  //         }
  //       })
  
  //       const book = await prisma.book.create({
  //         data: {
  //           cover: coverName,
  //           synopsis: req.body.synopsis,
  //           title: req.body.title,
  //           author: {
  //             connect: {
  //               email: email
  //             }
  //           }, 
  //           genres: {
  //             connect: genres,
  //           },
  //           tags: {
  //             connect: tags
  //           },
  //           chapters: {
  //             create: chapters 
  //           },
  //         }
  //       })

  //       return res.status(200).json({ book, success: true });
  //     });
      
  //     return endRes;
  //   } catch (err) {
  //     res.status(500).json({ error: 'Unexpected Error', success: false })
  //   }
  // }

  // res.status(405).json({message: `Method ${req.method} not allowed`, success: false})
}

export const config = {
  api: {
    bodyParser: false,
  },
}