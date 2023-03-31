import { ZodType, z } from 'zod'

type MultipleIdsItem = {
  id: number
}

const MultipleIdsItemSchema: ZodType<MultipleIdsItem> = z.object({
  id: z.number()
})

type Chapter = {
  title: string,
  content: string,
  order: number,
  notes: string
}

const ChapterSchema: ZodType<Chapter> = z.object({
  title: z.string(),
  content: z.string(),
  order: z.number(),
  notes: z.string()
})

export type CreateBook = {
  title: string,
  synopsis: string,
  cover: string,
  genres: MultipleIdsItem[]
  tags: MultipleIdsItem[],
  chapters: Chapter[]
}

export const CreateBookSchema: ZodType<CreateBook> = z.object({
  title: z.string(),
  synopsis: z.string(),
  cover: z.string(),
  genres: z.array(MultipleIdsItemSchema),
  tags: z.array(MultipleIdsItemSchema),
  chapters: z.array(ChapterSchema)
})

type ConnectNDisconnect = {
  connect: MultipleIdsItem[],
  disconnect: MultipleIdsItem[]
}

type MultipleStringIdsItem = {
  id: string
}

const MultipleStringIdsItemSchema: ZodType<MultipleStringIdsItem> = z.object({
  id: z.string()
})

type UpdateData = {
  title: string,
  notes: string,
  // content: string
}

const UpdateDataSchema: ZodType<UpdateData> = z.object({
  title: z.string(),
  notes: z.string(),
  content: z.string()
})

type UpdateChapter = {
  where: MultipleStringIdsItem,
  data: UpdateData
}

const UpdateChapterSchema: ZodType<UpdateChapter> = z.object({
  where: z.custom<MultipleStringIdsItem>(),
  data: z.custom<UpdateData>()
})

type UpdateBookChapters = {
  delete: MultipleStringIdsItem[],
  create: Chapter[],
  update: UpdateChapter[]

}

export type UpdateBook = {
  cover: string,
  title: string,
  synopsis: string,
  genres: ConnectNDisconnect,
  tags: ConnectNDisconnect,
  chapters: UpdateBookChapters
}

export const UpdateBookSchema: ZodType<UpdateBook> = z.object({
  cover: z.string(),
  title: z.string(),
  synopsis: z.string(),
  genres: z.custom<ConnectNDisconnect>(),
  tags: z.custom<ConnectNDisconnect>(),
  chapters: z.custom<UpdateBookChapters>()
})



//  GET Response
type GetBookChapter = {
  id: string,
  title: string,
  notes: string,
  order: number,
  content: string,
  originalContentName: string
}

export type GetBookResponse = {
  title: string,
  synopsis: string,
  cover: string,
  originalCoverName: string,
  id: string,
  genres: number[]
  tags: number[],
  chapters: GetBookChapter[]
} 
