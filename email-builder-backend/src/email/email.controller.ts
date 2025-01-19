import { Controller, Get, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EmailService } from './email.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/uploadEmailConfig')
  async saveEmail(@Body() data: any) {
    const newTemplate = await this.emailService.createEmailTemplate(data);

    const pdfBuffer = await this.emailService.generateEmailPdf(newTemplate);
    const pdfUrl = await this.emailService.uploadEmailTemplateToS3(pdfBuffer);
    return { pdfUrl };
  }

  @Post('/uploadImage')
  @UseInterceptors(FileInterceptor('image', { storage: multer.memoryStorage() }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File upload failed');
    }
    const imageUrl = await this.emailService.uploadImageToS3(file);
    return { imageUrl };
  }
}
