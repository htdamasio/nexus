import { S3Client } from "@aws-sdk/client-s3"

const bucketRegion = process.env.AVATAR_BUCKET_REGION
const accessKey = process.env.S3_ACCESS_KEY ?? ''
const secretAccessKey = process.env.SECRET_S3_ACCESS_KEY ?? ''

let s3Avatars: S3Client;

if (process.env.NODE_ENV === 'production') {
  s3Avatars = new S3Client({
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretAccessKey,
    },
    region: bucketRegion
  });
} else {
  if (!global.s3Avatars) {
    global.s3Avatars = new S3Client({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
      },
      region: bucketRegion
    });
  }
  s3Avatars = global.s3Avatars;
}

export default s3Avatars;