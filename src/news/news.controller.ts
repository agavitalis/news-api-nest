import { Controller, Get } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('News API')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('getTopWordsInStories')
  getTopWordsInStories() {
    return this.newsService.getTopWordsInStories();
  }

  @Get('getTopWordsInPosts')
  getTopWordsInPosts() {
    return this.newsService.getTopWordsInPosts();
  }

  @Get('getTopWordsInUserStories')
  getTopWordsInUserStories() {
    return this.newsService.getTopWordsInUserStories();
  }
}
