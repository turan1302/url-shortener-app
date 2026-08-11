import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Link } from './link/entity/link.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getLinksList(): Promise<Link[]> {
    return await this.appService.getLinksList();
  }
}
