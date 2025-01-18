import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EmailTemplate } from './entities/email.entity';
import { Model } from 'mongoose';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(EmailTemplate.name) private emailModel: Model<EmailTemplate>,
  ) {}

  async createEmailTemplate(data: any): Promise<EmailTemplate> {
    const newTemplate = new this.emailModel(data);
    return newTemplate.save();
  }

  async getEmailLayout(): Promise<string> {
    return `<html><body><h1>{{title}}</h1><p>{{content}}</p><img src="{{imageUrl}}" /><footer>{{footer}}</footer></body></html>`;
  }
}
