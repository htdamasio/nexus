import prisma from "@/lib/prisma";
import multer, { Multer } from 'multer';
import { Request, Response } from 'express';
import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import crypto from 'crypto'
import { AddChapterForm, serverBookSchema } from "@/forms/addBookForm";
import { getToken } from "next-auth/jwt"

const storage = multer.memoryStorage()
const upload: Multer = multer({ storage: storage });

// const upload = multer({ storage: storage })
const randomFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY ?? ''
const secretAccessKey = process.env.SECRET_ACCESS_KEY ?? ''
const secret = process.env.NEXTAUTH_SECRET

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion
})

export default async function handler(req: Request, res: Response) {

  if (req.method === 'POST') {
    try {
      const endRes = await upload.array('files')(req, res, async (err: any) => {
        if (err) {
          return res.status(500).json({ message: 'Error on add book', success: false });
        }
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
        let chapterNames: string[] = []
        
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
            chapterNames.push(fileName)
          }
        }))
        
        chapters = []
        chapters = req.body.chapters.map((c: AddChapterForm, i: number) => {
          c.content = chapterNames[i]
          delete c.id;
          return c;
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
      });
      
      return endRes;
    } catch (err) {
      res.status(500).json({ error: 'Unexpected Error', success: false })
    }
  }

  res.status(405).json({message: `Method ${req.method} not allowed`, success: false})
}

export const config = {
  api: {
    bodyParser: false,
  },
}