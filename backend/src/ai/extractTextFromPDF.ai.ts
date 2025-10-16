import redis from '@/config/redis.config';
import { APIError } from '@/lib/apiError.lib';
import logger from '@/lib/logger.lib';
import { getDocument } from 'pdfjs-dist';

const extractTextFromPDF = async (fileKey: string) => {
  const fileData = await redis.get(fileKey);

  if (!fileData) {
    logger.error('No file data found in Redis for key:', fileKey);
    throw new APIError(404, 'File not found or expired');
  }

  let fileBuffer: Uint8Array;
  if (Buffer.isBuffer(fileData)) {
    fileBuffer = new Uint8Array(fileData);
  } else if (typeof fileData === 'object' && fileData !== null) {
    const bufferData = fileData as { type: string; data: number[] };
    if (bufferData.type === 'Buffer' && Array.isArray(bufferData.data)) {
      fileBuffer = new Uint8Array(bufferData.data);
    } else {
      logger.error('Invalid file data format in Redis for key:', fileKey);
      throw new APIError(500, 'Invalid file data format');
    }
  } else {
    logger.error('Unexpected file data type in Redis for key:', fileKey);
    throw new APIError(500, 'Unexpected file data type');
  }

  const pdf = await getDocument({ data: fileBuffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text +=
      content.items
        .map(item => {
          if ('str' in item) {
            return item.str;
          }
          return '';
        })
        .join(' ') + '\n';
  }
  return text;
};

export default extractTextFromPDF;
