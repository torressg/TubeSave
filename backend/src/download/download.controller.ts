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
      return res.status(400).send('URL is required');
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
