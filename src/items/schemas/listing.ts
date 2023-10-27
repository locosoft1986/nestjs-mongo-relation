import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ListingDocument = HydratedDocument<Listing>;

@Schema()
export class Listing {
  @Prop()
  description: string;

  @Prop()
  rating: number;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);
