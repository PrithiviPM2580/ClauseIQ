import redis from '@/config/redis.config';
import { APIError } from '@/lib/apiError.lib';
import logger from '@/lib/logger.lib';
import pdfParse from 'pdf-parse-new';

interface RedisBuffer {
  type: 'Buffer';
  data: number[];
}

const extractTextFromPDF = async (fileKey: string): Promise<string> => {
  console.log('Extracting text from PDF with key:', fileKey);

  const fileData = await redis.get(fileKey);

  if (!fileData) {
    logger.error('No file data found in Redis for key:', fileKey);
    throw new APIError(404, 'File not found or expired');
  }

  console.log('File data type from Redis:', typeof fileData);
  console.log('File data sample:', JSON.stringify(fileData).substring(0, 100));

  let parsed: RedisBuffer;

  // Ensure the data is correctly parsed from Redis
  if (typeof fileData === 'string') {
    try {
      parsed = JSON.parse(fileData) as RedisBuffer;
    } catch (err) {
      logger.error('Failed to parse file data from Redis:', err);
      throw new APIError(500, 'Invalid file data format in Redis');
    }
  } else if (
    typeof fileData === 'object' &&
    fileData !== null &&
    'type' in fileData &&
    'data' in fileData
  ) {
    parsed = fileData as RedisBuffer;
  } else {
    logger.error('Unexpected file data type in Redis:', typeof fileData);
    throw new APIError(500, 'Unexpected file data type in Redis');
  }

  if (parsed.type !== 'Buffer' || !Array.isArray(parsed.data)) {
    throw new APIError(500, 'Invalid buffer format in Redis');
  }

  const fileBuffer = Buffer.from(parsed.data);
  console.log('Created buffer, size:', fileBuffer.length);

  try {
    console.log('Attempting PDF parsing with pdf-parse-new...');
    // Use the modern pdf-parse-new package
    const data = await pdfParse(fileBuffer);
    console.log('PDF parsing successful, text length:', data.text?.length || 0);
    return data.text;
  } catch (err) {
    console.error('PDF parsing error details:', err);
    logger.error('Failed to extract text from PDF:', err);
    throw new APIError(500, 'Failed to extract text from PDF');
  }
};

export default extractTextFromPDF;
