import { S3Client } from "@aws-sdk/client-s3"

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY ?? ''
const secretAccessKey = process.env.SECRET_ACCESS_KEY ?? ''
const secret = process.env.NEXTAUTH_SECRET

let s3: S3Client;

if (process.env.NODE_ENV === 'production') {
  s3 = new S3Client({
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretAccessKey,
    },
    region: bucketRegion
  });
} else {
  if (!global.s3) {
    global.s3 = new S3Client({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
      },
      region: bucketRegion
    });
  }
  s3 = global.s3;
}



export default s3;