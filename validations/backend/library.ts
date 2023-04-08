import { ReadingStatus, Review } from "@prisma/client"

export type LibraryBook = {
  id: string,
  cover: string,
  status: ReadingStatus,
  synopsis: string,
  title: string,
  author: string,
  totalReviews: number,
  totalChapters: number,
  score: number,
}

export type GetLibraryResponse = {
  toRead: LibraryBook[],
  reading: LibraryBook[],
  read: LibraryBook[],
  dropped: LibraryBook[],
  reviews: Review[]
}