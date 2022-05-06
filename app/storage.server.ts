import type { Readable } from 'stream';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import type { UploadHandler } from '@remix-run/node';

const {
  STORAGE_ENDPOINT,
  STORAGE_REGION,
  STORAGE_ACCESS_KEY,
  STORAGE_SECRET,
  STORAGE_BUCKET,
} = process.env;

const storage = new S3Client({
  endpoint: STORAGE_ENDPOINT ?? '',
  credentials: {
    accessKeyId: STORAGE_ACCESS_KEY ?? '',
    secretAccessKey: STORAGE_SECRET ?? '',
  },
  region: STORAGE_REGION,
});

export async function uploadStreamToSpaces(stream: Readable, filename: string) {
  return new Upload({
    client: storage,
    leavePartsOnError: false,
    params: {
      Bucket: STORAGE_BUCKET ?? '',
      Key: filename,
      Body: stream,
    },
  }).done();
}

export const uploadHandler: UploadHandler = async ({ stream, filename }) => {
  const upload = await uploadStreamToSpaces(stream, filename);

  if (upload.$metadata.httpStatusCode === 204) {
    return filename;
  }

  return undefined;
};
