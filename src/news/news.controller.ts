import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { NewsService } from './news.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  mapConcurrently,
  getWeekNumber,
  trasformToObject,
  sortObject,
} from './utils/tools';

@ApiTags('News API')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('getTopWordsInLast25Stories')
  async getTopWordsInLast25Stories(@Res() res: Response) {
    const lastestStoryIds = await this.newsService.getLatestStories();
    const lastStoryIds = lastestStoryIds.slice(0, 25);

    const stories = await mapConcurrently(lastStoryIds, async (storyId) => {
      return await this.newsService.getAStory(storyId);
    });

    let title: string;
    for (let index = 0; index < stories.length; index++) {
      if (stories[index].hasOwnProperty('title')) {
        title = title + ' ' + stories[index].title;
      }
    }
    if (title != null) {
      const wordObject = trasformToObject(title);
      const sortedObject = sortObject(wordObject);
      return res.status(HttpStatus.OK).json(sortedObject);
    }
  }

  @Get('getTopWordsInLast600StoriesOfUsers')
  async getTopWordsInLast600StoriesOfUsers(@Res() res: Response) {
    const lastestStoryIds = await this.newsService.getLatestStories();
    const lastStoryIds = lastestStoryIds.slice(0, 600);

    const stories = await mapConcurrently(lastStoryIds, async (storyId) => {
      return await this.newsService.getAStory(storyId);
    });

    const userIds: Array<string> = stories.map((x) => x?.by);
    const users = await mapConcurrently(userIds, async (userId) => {
      return await this.newsService.getAUser(userId);
    });

    const qualifiedUsers = users.filter((user) => user.karma >= 10);
    const qualifiedUserIds: Array<string> = qualifiedUsers.map((x) => x.id);

    const filteredStories = stories.filter((story) =>
      qualifiedUserIds.includes(story?.by),
    );

    let title: string;
    for (let index = 0; index < filteredStories.length; index++) {
      if (stories[index]?.title != null) {
        title = title + ' ' + stories[index].title;
      }
    }
    if (title != null) {
      const wordObject = trasformToObject(title);
      const sortedObject = sortObject(wordObject);
      return res.status(HttpStatus.OK).json(sortedObject);
    }
  }

  @Get('getTopWordsInStoryOfLastWeek:storyId')
  async getTopWordsInStoryOfLastWeek(
    @Res() res: Response,
    @Param('storyId') storyId: number,
  ) {
    const story = await this.newsService.getAStory(storyId);
    const storyTime = new Date(story.time).toISOString();
    const storyWeek = getWeekNumber(new Date(storyTime));
    const currentWeek = getWeekNumber(new Date());

    if (currentWeek[0] != storyWeek[0] || currentWeek[1] - storyWeek[1] != 1) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Only  stories of the past weeks is needed',
      });
    }

    if (story.title != null) {
      const wordObject = trasformToObject(story.title);
      const sortedObject = sortObject(wordObject);
      return res.status(HttpStatus.OK).json(sortedObject);
    }
  }
}
