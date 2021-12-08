/* eslint-disable prettier/prettier */
import axios from 'axios';
export const methods = <const>['get', 'post', 'patch', 'delete', 'put'];

export type methodType = typeof methods[number];

export async function Axios(
  url: string,
  method: methodType,
  data?: object,
  extras?: object,
) {
  try {
    const response = await axios({
      url: `${url}`,
      method,
      data,
      ...extras,
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function loopConcurrently<T>(
  ts: T[],
  fn: (t: T) => Promise<void>,
): Promise<void> {
  const promises = [];
  ts.forEach((x) => promises.push(fn(x)));
  await Promise.all(promises);
}

export async function mapConcurrently<T, U>(
  ts: T[],
  fn: (t: T) => Promise<U>,
): Promise<U[]> {
  return Promise.all(ts.map(fn));
}

export function getWeekNumber(d:any) {
  // Copy date so don't modify original
  const dy = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  dy.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(( ( (<any>dy - <any>yearStart) / 86400000) + 1)/7);
  // Return week number
  return [d.getUTCFullYear(), weekNo];
}

export function trasformToObject( sentence: string){
  const words = sentence.split(' ');
  const wordObject = {};
  for (let i = 0; i <= words.length; i++) {
    if (words[i] != undefined && words[i] != ' ') {
      wordObject['_' + words[i].toLowerCase()] = (wordObject['_' + words[i].toLowerCase()] || 0) + 1;
    }
  }
  return wordObject;
}

export function sortObject(wordObject:any): any{
  const sortable = [];
  for (const word in wordObject) {
    sortable.push([word, wordObject[word]]);
  }

  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });

  let responseObject = {}
  let counter = 0
  for (let index = 0; index < sortable.length; index++) {
    const key = sortable[index][0].slice(1);
    const object = {};
    object[key] = sortable[index][1];
    if(key != 'undefined' && counter != 10){
      responseObject = {...responseObject, ...object}
      counter++
    }
  }
  return responseObject;
}

