import { APIError } from '@/lib/apiError.lib';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new APIError(400, 'Only PDF files are allowed'));
    }
  },
});

export const uploadSingle = upload.single('contract');
