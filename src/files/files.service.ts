import { existsSync } from 'fs';
import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  getStaticImg(img: string) {
    const path = join(__dirname, '../../static/uploads', img);

    if (!existsSync(path)) {
      throw new BadRequestException('File not found');
    }

    return path;
  }
}
