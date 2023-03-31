import {z, ZodType} from 'zod'

export type AddChapterForm = {
  id: string,
  order: number,
  title: string,
  content: string,
  notes: string
}

const htmlPattern = /<[^<]+?>/g;
export const countCharactersWithoutTags = (inputString: string) => {
  const textWithoutTags = inputString.replace(htmlPattern, '');
  return textWithoutTags.length;
};

export const addChapterSchema: ZodType<AddChapterForm> = z.object({
  id: z.string(),
  order: z.number(),
  title: z.string().min(1),
  content: z.string(),
  notes: z.string().min(0)
}).refine((data) => countCharactersWithoutTags(data.content) > 250, {message: 'The chapter must cointain at least 250 characters', path: ['content']})

export type AddBookForm = {
  cover: File | null,
  title: string,
  synopsis: string,
  selectedGenres: number[],
  selectedTags: number[],
  chapters: AddChapterForm[]
}

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const addBookSchema: ZodType<AddBookForm> = z.object({
  cover: z.custom<null | File>(),
  title: z.string().min(1),
  synopsis: z.string(),
  selectedGenres: z.array(z.number()).min(1, {message: 'At least 1 genre is required'}),
  selectedTags: z.array(z.number()).min(1, {message: 'At least 1 tag is required'}),
  chapters: z.array(addChapterSchema).min(1, {message: 'At least 1 chapter is required'})
}).refine((data) => countCharactersWithoutTags(data.synopsis) > 25, {message: 'The synopsis must cointain at least 25 characters', path: ['synopsis']})


export const serverChapterSchema: ZodType<AddChapterForm> = z.object({
  id: z.string(),
  order: z.number(),
  title: z.string().min(1),
  content: z.string(),
  notes: z.string().min(0)
})

export const serverBookSchema = z.object({
  title: z.string().min(1),
  synopsis: z.string(),
  genres: z.array(z.number()).min(1, {message: 'At least 1 genre is required'}),
  tags: z.array(z.number()).min(1, {message: 'At least 1 genre is required'}),
  chapters: z.array(serverChapterSchema).min(1, {message: 'At least 1 chapter is required'}),
  // email: z.string().email()
}).refine((data) => countCharactersWithoutTags(data.synopsis) > 25, {message: 'The synopsis must cointain at least 25 characters', path: ['synopsis']})

// .refine((data) => countCharactersWithoutTags(data.synopsis) > 25, {message: 'The synopsis must cointain at least 25 characters', path: ['synopsis']});