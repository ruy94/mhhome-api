import { randomBytes } from 'crypto';
import { mkdirSync } from 'fs';
import moment from 'moment';
import { basename, extname } from 'path';
import { diskStorage } from 'multer';

export const UPLOAD_TEMP_DIR = process.env.UPLOAD_TEMP_DIR ?? '/tmp/mhhome-api/uploads';

mkdirSync(UPLOAD_TEMP_DIR, { recursive: true });

export function buildFilename(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: (err: null, name: string) => void,
) {
  const fileExtName = extname(file.originalname);
  const randomName = randomBytes(16).toString('hex');
  const dateStamp = moment().format('YYYY_MM_DD');

  const reservedLength = dateStamp.length + 1 + randomName.length + 1 + fileExtName.length;
  const maxBaseNameLength = 247 - reservedLength;
  let fileBaseName = basename(file.originalname, fileExtName);
  if (fileBaseName.length > maxBaseNameLength) {
    fileBaseName = fileBaseName.substring(0, maxBaseNameLength);
  }

  cb(null, `${dateStamp}_${randomName}_${fileBaseName}${fileExtName}`);
}

export const imageUploadOptions = {
  storage: diskStorage({
    destination: UPLOAD_TEMP_DIR,
    filename: buildFilename,
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowedMimeTypes = new Set([
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
    ]);
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, WebP, AVIF and GIF images are allowed'), false);
    }
    cb(null, true);
  },
};

export const videoUploadOptions = {
  storage: diskStorage({
    destination: UPLOAD_TEMP_DIR,
    filename: buildFilename,
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (file.mimetype !== 'video/mp4') {
      return cb(new Error('Only .mp4 videos are allowed'), false);
    }
    cb(null, true);
  },
};
