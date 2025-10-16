import redis from '@/config/redis.config';
import { APIError } from '@/lib/apiError.lib';
import logger from '@/lib/logger.lib';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require('pdf-parse');

const extractTextFromPDF = async (fileKey: string): Promise<string> => {
  const fileData = await redis.get(fileKey);

  if (!fileData) {
    logger.error('No file data found in Redis for key:', fileKey);
    throw new APIError(404, 'File not found or expired');
  }

  let fileBuffer: Buffer;

  // Handle Redis binary or JSON-encoded buffers
  if (Buffer.isBuffer(fileData)) {
    fileBuffer = fileData;
  } else if (typeof fileData === 'string') {
    try {
      const parsed = JSON.parse(fileData);
      if (parsed?.type === 'Buffer' && Array.isArray(parsed.data)) {
        fileBuffer = Buffer.from(parsed.data);
      } else {
        throw new Error('Invalid Buffer JSON format');
      }
    } catch (err) {
      logger.error('Failed to parse Redis file data:', err);
      throw new APIError(500, 'Invalid file data format in Redis');
    }
  } else {
    logger.error('Unexpected file data type in Redis:', typeof fileData);
    throw new APIError(500, 'Unexpected file data type in Redis');
  }

  try {
    const data = await pdf(fileBuffer);
    return data.text;
  } catch (err) {
    logger.error('Failed to extract text from PDF:', err);
    throw new APIError(500, 'Failed to extract text from PDF');
  }
};

export default extractTextFromPDF;
