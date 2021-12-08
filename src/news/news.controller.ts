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
    const lastStoryId = await this.newsService.getLastStoryId();
    const last25StoryId = lastStoryId - 25;
    const storyIds = [];
    for (let index = last25StoryId; index < lastStoryId; index++) {
      storyIds.push(index);
    }
    const stories = await mapConcurrently(storyIds, async (storyId) => {
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

  @Get('getTopWordsInUserStories:userId')
  async getTopWordsInUserStories(
    @Res() res: Response,
    @Param('userId') userId: string,
  ) {
    const user = await this.newsService.getAUser(userId);

    if (!user) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'User not found',
      });
    }

    if (user.karma < 10) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'User Karma less than 10',
      });
    }

    const userStoryIds = user.submitted.slice(0, 599);
    const stories = await mapConcurrently(userStoryIds, async (userStoryId) => {
      return await this.newsService.getAStory(userStoryId as string);
    });

    let title: string;
    for (let index = 0; index < stories.length; index++) {
      if (stories[index].title != null) {
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
    @Param('storyId') storyId: string,
  ) {
    const story = await this.newsService.getAStory(storyId);
    const storyTime = new Date(story.time).toISOString();
    const storyWeek = getWeekNumber(new Date(storyTime));
    const currentWeek = getWeekNumber(new Date());
    // if (currentWeek[0] != storyWeek[0] || currentWeek[1] - storyWeek[1] != 1) {
    //   return res.status(HttpStatus.BAD_REQUEST).json({
    //     message: 'Only  stories of the past weeks is needed',
    //   });
    // }

    if (story.title != null) {
      const wordObject = trasformToObject(story.title);
      const sortedObject = sortObject(wordObject);
      return res.status(HttpStatus.OK).json(sortedObject);
    }
  }
}
