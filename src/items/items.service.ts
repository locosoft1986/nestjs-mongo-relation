import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from './schemas/item';
import { Listing } from './schemas/listing';
import { Comment } from './schemas/comment';
import { Tag } from './schemas/tag';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    @InjectModel(Listing.name) private listingModel: Model<Listing>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Tag.name) private tagModel: Model<Tag>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const newListing = new this.listingModel({
      ...createItemDto.listing,
      rating: 0,
    });
    const listing = await newListing.save();
    const newTags = createItemDto.tags.map(
      (createTagDto) => new this.tagModel(createTagDto),
    );

    const tags = await Promise.all(newTags.map((newTags) => newTags.save()));
    const tagIds = tags.map((t) => t._id);
    const newItem = new this.itemModel({
      ...createItemDto,
      comments: [],
      tags: tagIds,
      listing: listing._id,
    });
    const item = newItem.save();
    await this.tagModel.updateMany(
      { _id: { $in: tagIds } },
      { items: [newItem._id] },
    );
    return item;
  }

  async findAll() {
    return this.itemModel
      .find()
      .populate('comments')
      .populate('listing')
      .populate('tags')
      .exec();
  }

  async findOne(_id: string) {
    return this.itemModel
      .findById(new ObjectId(_id))
      .populate('comments')
      .populate('listing')
      .populate('tags')
      .exec();
  }

  async update(_id: string, updateItemDto: UpdateItemDto) {
    const newComments = updateItemDto.comments.map(
      (createCommentDto) => new this.commentModel(createCommentDto),
    );
    const comments = await Promise.all(newComments.map((c) => c.save()));
    const commentIds = comments.map((c) => c._id);
    this.itemModel.findByIdAndUpdate(new ObjectId(_id), {
      $push: { comments: { $each: commentIds } },
    });
    await this.commentModel.updateMany(
      { _id: { $in: commentIds } },
      { item: new ObjectId(_id) },
    );
  }

  async remove(_id: string) {
    await this.itemModel.findByIdAndDelete(new ObjectId(_id));
  }
}
