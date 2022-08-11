import { v4 as uuid } from 'uuid';
import { Request } from 'express';

const allowedExtensions = ['jpg', 'jpeg', 'png'];

export const filter = (
  req: Request,
  file: Express.Multer.File,
  cb: Function,
) => {
  if (!file) {
    return cb(new Error('File empty'), false);
  }

  const extension = file.mimetype.split('/')[1];

  if (allowedExtensions.includes(extension)) {
    return cb(null, true);
  }

  cb(null, false);
};

export const renamer = (
  req: Request,
  file: Express.Multer.File,
  cb: Function,
) => {
  if (!file) {
    return cb(new Error('File error'), false);
  }

  const extension = file.mimetype.split('/')[1];
  const newFilename = `${uuid()}.${extension}`;

  cb(null, newFilename);
};
