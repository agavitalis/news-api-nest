import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Axios } from './utils/response';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class NewsService {
  constructor(private httpService: HttpService) {}

  async getLastStoryId(): Promise<number> {
    const maxItem = lastValueFrom(this.httpService
      .get('https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty')
        .pipe(map((response) => response.data)),
    );
    return <number>(<unknown>maxItem);
  }

  async getAUser(userId: string): Promise<any> {
    return await Axios(
      `https://hacker-news.firebaseio.com/v0/user/${userId}.json?print=pretty`,
      'get',
    );
  }

  async getAStory(storyId: string): Promise<any> {
    return await Axios(
      `https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`,
      'get',
    );
  }
}
