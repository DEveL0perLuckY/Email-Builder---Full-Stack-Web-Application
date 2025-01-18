import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EmailTemplate extends Document {
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) content: string;
  @Prop() footer: string;
  @Prop() imageUrl: string;
}

export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);
