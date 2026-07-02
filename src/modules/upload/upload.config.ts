import { randomBytes } from 'crypto';
import moment from 'moment';
import { basename, extname } from 'path';
import { diskStorage } from 'multer';

const isProduction = process.env.NODE_ENV === 'production';

export const IMAGE_DEST = isProduction ? '/var/www/mhhome-uploads' : '/home/duy/Public';
export const INPUT_VIDEO_DEST = isProduction
  ? '/var/www/mhhome-uploads/input-videos'
  : '/home/duy/Public/input-videos';

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
    destination: IMAGE_DEST,
    filename: buildFilename,
  }),
};

export const videoUploadOptions = {
  storage: diskStorage({
    destination: INPUT_VIDEO_DEST,
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
