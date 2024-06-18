import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { DownloadService } from './download.service';

@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Get()
  async download(
    @Query('url') url: string,
    @Query('format') format: 'mp3' | 'mp4',
    @Res() res: Response,
  ) {
    if (!url) {
      return res.status(400).send({ error: 'URL is required' });
    }
    if (
      !url.startsWith('https://www.youtube.com/watch?') ||
      !url.startsWith('https://youtu.be/')
    ) {
      return res.status(400).send({
        error: `URL must start with 'https://www.youtube.com/watch?' or 'https://youtu.be/'`,
      });
    }
    if (!format) {
      return res.status(400).send({ error: 'Format is required' });
    }
    if (format !== 'mp3' && format !== 'mp4') {
      return res.status(400).send({ error: `Format must be 'mp4' or 'mp3'` });
    }
    try {
      const { buffer, titleLink } = await this.downloadService.downloadVideo(
        url,
        format,
      );
      const filename = `${titleLink.replaceAll(' ', '')}.${format}`;

      res.set({
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': `video/${format === 'mp3' ? 'mpeg' : 'mp4'}`,
      });
      res.send(buffer);
    } catch (error) {
      res.status(500).send('Failed to download video');
    }
  }
}
