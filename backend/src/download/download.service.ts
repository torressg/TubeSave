import { Injectable } from '@nestjs/common';
import * as ytdl from 'ytdl-core';

interface DownloadResult {
  buffer: Buffer;
  titleLink: string;
}

@Injectable()
export class DownloadService {
  async downloadVideo(
    url: string,
    format: 'mp3' | 'mp4',
  ): Promise<DownloadResult> {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    const stream = ytdl(url, {
      filter: format === 'mp3' ? 'audioonly' : 'audioandvideo',
    });

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const returnObj: DownloadResult = {
      buffer: Buffer.concat(chunks),
      titleLink: title,
    };

    return returnObj;
  }
}
