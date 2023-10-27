import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Item } from './item';

export type TagDocument = HydratedDocument<Tag>;

@Schema()
export class Tag {
  @Prop()
  content: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }] })
  Items: Item[];
}

export const TagSchema = SchemaFactory.createForClass(Tag);
