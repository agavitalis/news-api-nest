import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Axios } from './utils/tools';
import { Story } from './interfaces/Story';
import { User } from './interfaces/User';

@Injectable()
export class NewsService {
  constructor(private httpService: HttpService) {}

  async getAUser(userId: string): Promise<User> {
    return await Axios(
      `https://hacker-news.firebaseio.com/v0/user/${userId}.json?print=pretty`,
      'get',
    );
  }

  async getAStory(storyId: number): Promise<Story> {
    return await Axios(
      `https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`,
      'get',
    );
  }

  async getLatestStories(): Promise<Array<number>> {
    return await Axios(
      ` https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty`,
      'get',
    );
  }
}
