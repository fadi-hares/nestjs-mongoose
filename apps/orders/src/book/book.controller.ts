import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { log } from 'console';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create.book.dto';
import { UpdateBookDto } from './dto/update.book.dto';
import { Book } from './schemas/book.schema';

// import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async findAll(@Query() query): Promise<Book[]> {
    return await this.bookService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Book> {
    return await this.bookService.findById(id);
  }

  @UseGuards(AuthGuard())
  @Post()
  async create(@Body() dto: CreateBookDto, @Req() req): Promise<Book> {
    log(req.user);
    return await this.bookService.create(dto, req.user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
  ): Promise<Book> {
    return await this.bookService.update(id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.bookService.delete(id);
  }
}
