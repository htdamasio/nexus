
import crypto from 'crypto'
import s3 from "@/lib/s3";
import { DeleteObjectCommand, DeleteObjectCommandInput, GetObjectCommand, GetObjectCommandInput, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Avatars from '@/lib/s3Avatars';


const randomFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
const bucketName = process.env.BUCKET_NAME
const avatarsBucketName = process.env.AVATAR_BUCKET_NAME

export async function GenerateNewPutSignedUrl(filename?: string) {
  if (!filename) {
    filename = randomFileName();
  }

  const params: PutObjectCommandInput = {
    Bucket: bucketName,
    Key: filename,
  }

  const command = new PutObjectCommand(params);
  const url = await getSignedUrl(s3, command, { expiresIn: 60 });

  return { url, filename };
}

export async function GenerateAvatarNewPutSignedUrl(filename?: string) {
  if (!filename) {
    filename = randomFileName();
  }

  const params: PutObjectCommandInput = {
    Bucket: avatarsBucketName,
    Key: filename,
  }

  const command = new PutObjectCommand(params);
  const url = await getSignedUrl(s3Avatars, command, { expiresIn: 60 });

  return { url, filename };
}

export async function GenerateNewGetSignedUrl(filename: string) {
  const params: GetObjectCommandInput = {
    Bucket: bucketName,
    Key: filename,
  }

  const command = new GetObjectCommand(params);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return { url };
}


export async function PerformDeletionOnS3Bucket(filename: string) {
  
  const params: DeleteObjectCommandInput = {
    Bucket: bucketName,
    Key: filename
  }
  const command = new DeleteObjectCommand(params)
  await s3.send(command)

}