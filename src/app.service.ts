import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Link } from './link/entity/link.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>) {}

  @ApiOperation({ summary: 'Get the links list' })
  @ApiResponse({ status: 200, description: 'Links list' })
  async getLinksList(): Promise<Link[]> {
    return this.linkRepository.find({
      order: { id: 'DESC' },
      where: { deleted_at: IsNull() }
    });
  }
}
