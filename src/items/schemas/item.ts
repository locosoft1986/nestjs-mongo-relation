import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Listing } from './listing';
import { Tag } from './tag';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class Item {
  @Prop()
  name: string;

  @Prop({ default: true })
  public: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' })
  listing: Listing;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }] })
  tags: Tag[];
}

export const ItemSchema = SchemaFactory.createForClass(Item);
