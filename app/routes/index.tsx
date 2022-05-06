import { Button, Container, Space, useMantineTheme } from '@mantine/core';
import {
  Dropzone as DropzoneWrapper,
  IMAGE_MIME_TYPE,
} from '@mantine/dropzone';
import { redirect, unstable_parseMultipartFormData } from '@remix-run/node';

import type { ActionFunction } from '@remix-run/node';
import { Dropzone } from '~/components/Dropzone';
import { Form } from '@remix-run/react';
import { uploadHandler } from '~/storage.server';
import { useState } from 'react';

export const action: ActionFunction = async ({ request }) => {
  await unstable_parseMultipartFormData(request, uploadHandler);

  return redirect(`/success`);
};

export default function Index() {
  const theme = useMantineTheme();
  const [files, setFiles] = useState<File[]>([]);

  return (
    <>
      <Container size='sm' px='sm'>
        <Form method='post' encType='multipart/form-data'>
          <DropzoneWrapper
            onDrop={setFiles}
            onReject={(files) => {}}
            maxSize={3 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            name='images'
          >
            {(status) => Dropzone(status, theme)}
          </DropzoneWrapper>

          <Space h='md' />

          <Button type='submit'>Upload</Button>
        </Form>

        <Space h='xl' />

        {files.length > 0 && (
          <div>
            <h2>Pending uploads</h2>
            {files.map((file, idx) => (
              <div key={idx}>{file.name}</div>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
