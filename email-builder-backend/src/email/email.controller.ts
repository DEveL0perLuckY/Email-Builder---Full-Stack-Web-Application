import { Controller, Get, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EmailService } from './email.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';


@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('/getEmailLayout')
  async getLayout(): Promise<string> {
    return this.emailService.getEmailLayout();
  }

  @Post('/uploadEmailConfig')
  async saveEmail(@Body() data: any) {
    return this.emailService.createEmailTemplate(data);
  }

  @Post('/uploadImage')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename: string = uuidv4();
          const extension: string = path.extname(file.originalname);
          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    
    if (!file) {
      throw new Error('File upload failed');
    }
    return { imageUrl: `http://localhost:3000/uploads/${file.filename}` };
  }
}
