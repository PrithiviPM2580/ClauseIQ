import type { Request, Response } from 'express';
import compression from 'compression';

const shouldCompress = (req: Request, res: Response): boolean => {
  const existingEncoding = res.getHeader('Content-Encoding');
  if (existingEncoding) return false;

  if (req.headers['x-no-compression']) return false;

  const contentTypeRaw = res.getHeader('Content-Type');
  const contentType =
    typeof contentTypeRaw === 'string'
      ? contentTypeRaw.toLocaleLowerCase()
      : Array.isArray(contentTypeRaw)
        ? contentTypeRaw.join(';').toLowerCase()
        : '';

  if (contentType) {
    if (
      contentType.startsWith('image/') ||
      contentType.startsWith('video/') ||
      contentType.startsWith('audio/') ||
      contentType === 'application/pdf' ||
      contentType.startsWith('application/zip')
    ) {
      return false;
    }
  }

  return compression.filter(req, res);
};

const compressionMiddleware = compression({
  threshold: 1024,
  filter: shouldCompress,
});

export default compressionMiddleware;
