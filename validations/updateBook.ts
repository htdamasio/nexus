import { ZodType, z } from "zod";
import { AddChapterForm, countCharactersWithoutTags, serverChapterSchema } from "./addBookForm";

export type ServerUpdateBook = {
  // cover: File | null,
  title: string,
  bookId: string,
  synopsis: string,
  genres: number[],
  tags: number[],
  modifiedChapters?: AddChapterForm[]
  addedChapters?: AddChapterForm[]
  deletedChapters?: AddChapterForm[]
}

export const serverUpdateBookSchema: ZodType<ServerUpdateBook> = z.object({
  bookId: z.string(),
  title: z.string().min(1),
  synopsis: z.string(),
  genres: z.array(z.number()).min(1, {message: 'At least 1 genre is required'}),
  tags: z.array(z.number()).min(1, {message: 'At least 1 genre is required'}),
  modifiedChapters: z.array(z.custom<AddChapterForm>()).min(1, {message: 'At least 1 genre is required'}).optional(), 
  addedChapters: z.array(z.custom<AddChapterForm>()).min(1, {message: 'At least 1 genre is required'}).optional(), 
  deletedChapters: z.array(z.custom<AddChapterForm>()).min(1, {message: 'At least 1 genre is required'}).optional(), 
  // chapters: z.array(serverChapterSchema).min(1, {message: 'At least 1 chapter is required'}),
  // email: z.string().email()
}).refine((data) => countCharactersWithoutTags(data.synopsis) > 25, {message: 'The synopsis must cointain at least 25 characters', path: ['synopsis']})