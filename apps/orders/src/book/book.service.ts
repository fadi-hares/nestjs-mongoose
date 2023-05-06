import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { CreateBookDto } from './dto/create.book.dto';
import { UpdateBookDto } from './dto/update.book.dto';
import { Book } from './schemas/book.schema';

// import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
  ) {}

  // Find All
  async findAll(query): Promise<Book[]> {
    const resPerPage = 2;
    const currentPage = Number(query.page) || 1;

    const skip = resPerPage * (currentPage - 1);

    const keyword = query.title
      ? {
          title: {
            $regex: query.title,
            $options: 'i',
          },
        }
      : {};

    const books = await this.bookModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return books;
  }

  // Find One
  async findById(id: string) {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) throw new BadRequestException('This is is not valid');

    const book = await this.bookModel.findById(id);

    if (!book) throw new NotFoundException('Book not found');

    return book;
  }

  // Create One
  async create(dto: CreateBookDto, user: User): Promise<Book> {
    const data = Object.assign(dto, { user: user._id });

    return await this.bookModel.create(data);
  }

  // Update One
  async update(id: string, dto: UpdateBookDto): Promise<Book> {
    return await this.bookModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });
  }

  // Delete One
  async delete(id: string): Promise<void> {
    return await this.bookModel.findByIdAndDelete(id);
  }
}
