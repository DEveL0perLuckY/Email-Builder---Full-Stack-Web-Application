import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EmailTemplate } from './entities/email.entity';
import { Model } from 'mongoose';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'; // AWS S3 client and command
import { v4 as uuidv4 } from 'uuid'; // Generate unique file keys

import puppeteer from 'puppeteer';

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

  async generateEmailPdf(data: any): Promise<any> {
    console.log(data)
    console.log(data.imageUrl)
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
            color: #333;
          }
          .container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            color: #2b6cb0;
            margin-bottom: 20px;
          }
          .content {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
            word-wrap: break-word;
          }
          .content a {
            color: #3182ce;
            text-decoration: none;
          }
          .content a:hover {
            text-decoration: underline;
          }
          .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #666;
            text-align: center;
          }
          .footer a {
            color: #3182ce;
            text-decoration: none;
          }
          img {
            display: block;
            max-width: 100%;
            margin: 20px auto;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          }
          .signature {
            margin-top: 40px;
            font-size: 12px;
            color: #999;
            text-align: center;
          }
          .subfooter { margin-top: 30px; font-size: 14px; text-align: center; color: gray; }
          img {
          display: block;
          width: auto;
          height: auto; /* Maintain aspect ratio */
          margin: 20px auto;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">${data.title}</div>
          ${data.imageUrl ? `<img src="${data.imageUrl}" id="dynamic-image" alt="Attached Image" />` : ''}
          <div class="content">${data.content}</div>
          <div class="subfooter">
                  ${data.footer || 'Your email footer text...'}
          </div>

          <div class="footer">
            <p>Created by <strong>Lucky Mourya</strong></p>
            <p>
              <a href="https://www.linkedin.com/in/lucky-mourya-968b6126b/" target="_blank">
                LinkedIn
              </a> | 
              <a href="https://github.com/deveL0perLuckY/" target="_blank">
                GitHub
              </a>
            </p>
          </div>
          <div class="signature">
            © ${new Date().getFullYear()} Lucky Mourya. All Rights Reserved.
          </div>
        </div>
      </body>
      </html>
    `;


    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    // Set HTML content
    await page.setContent(htmlTemplate, { waitUntil: 'domcontentloaded' });
  
    // Wait for the image to load
    if (data.imageUrl) {
      try {
        await page.waitForSelector('#dynamic-image', { visible: true, timeout: 10000 });
        await page.evaluate(() => {
          return new Promise((resolve, reject) => {
            const img = document.getElementById('dynamic-image') as HTMLImageElement;
            if (!img) return resolve(true);
            if (img.complete) return resolve(true);
            img.onload = () => resolve(true);
            img.onerror = () => reject(new Error('Image failed to load'));
          });
        });
      } catch (error) {
        console.error('Error waiting for image to load:', error);
      }
    }
  
    // Generate the PDF
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
  
    return pdfBuffer;
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

  async uploadEmailTemplateToS3(pdfBuffer: Buffer): Promise<string> {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const fileKey = `emails/${uuidv4()}.pdf`;

    const uploadParams = {
      Bucket: bucketName,
      Key: fileKey,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
    };

    const command = new PutObjectCommand(uploadParams);
    await this.s3Client.send(command);

    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  }
}
