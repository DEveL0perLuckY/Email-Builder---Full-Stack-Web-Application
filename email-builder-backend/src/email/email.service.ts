import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EmailTemplate } from './entities/email.entity';
import { Model } from 'mongoose';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'; // AWS S3 client and command
import { v4 as uuidv4 } from 'uuid'; // Generate unique file keys

@Injectable()
export class EmailService {
  private s3Client: S3Client;

  constructor(
    @InjectModel(EmailTemplate.name) private emailModel: Model<EmailTemplate>,
  ) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async createEmailTemplate(data: any): Promise<EmailTemplate> {
    const newTemplate = new this.emailModel(data);
    return newTemplate.save();
  }

  async uploadImageToS3(file: Express.Multer.File): Promise<string> {
    const bucketName = process.env.AWS_BUCKET_NAME;

    if (!bucketName) {
      throw new Error('S3 bucket name is not defined in environment variables');
    }

    const fileKey = `images/${uuidv4()}-${file.originalname}`;

    const uploadParams = {
      Bucket: bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await this.s3Client.send(command);

    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  }
}
