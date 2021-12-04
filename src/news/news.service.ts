import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  getTopWordsInStories() {
    return `This action returns all search`;
  }

  getTopWordsInPosts() {
    return `This action returns all search`;
  }

  getTopWordsInUserStories() {
    return `This action returns all search`;
  }
}
