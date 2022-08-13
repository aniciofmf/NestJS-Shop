import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { filter, renamer } from './helpers/file.helper';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: filter,
      storage: diskStorage({
        destination: './static/uploads',
        filename: renamer,
      }),
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is empty');
    }

    const sUrlFile = `${this.configService.get('ENDPOINT')}/files/${
      file.filename
    }`;

    return {
      sUrlFile,
    };
  }

  @Get(':file')
  getFile(@Param('file') file: string, @Res() res: Response) {
    const filePath = this.filesService.getStaticImg(file);

    res.sendFile(filePath);
  }
}
