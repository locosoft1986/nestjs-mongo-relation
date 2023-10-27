import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './schemas/item';
import { Comment, CommentSchema } from './schemas/comment';
import { Listing, ListingSchema } from './schemas/listing';
import { Tag, TagSchema } from './schemas/tag';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Listing.name, schema: ListingSchema },
      { name: Tag.name, schema: TagSchema },
    ]),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
