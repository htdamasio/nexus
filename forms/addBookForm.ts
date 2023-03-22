import {z, ZodType} from 'zod'

export type AddBookForm = {
  cover: File | null,
  title: string,
  synopsis: string,
  selectedGenres: number[],
  selectedTags: number[],
  chapterTitle: string,
  chapterContent: string
}

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const addBookSchema: ZodType<AddBookForm> = z.object({
  // cover: z.custom<File | null>((v) => (v instanceof File) || null),
  cover: z.custom<null | File>(),
  title: z.string().min(1),
  synopsis: z.string().min(25),
  selectedGenres: z.array(z.number()).min(1, {message: 'At least 1 genre is required'}),
  selectedTags: z.array(z.number()).min(1, {message: 'At least 1 tag is required'}),
  chapterTitle: z.string().min(1, {message: 'The Chapter title must have at least 1 letter'}),
  chapterContent: z.string().min(250, {message: 'The Chapter must be at least 250 characters long.'}),
});