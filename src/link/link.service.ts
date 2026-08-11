import { Injectable, NotFoundException } from '@nestjs/common';
import { LinkDto } from './dto/link.dto';
import { Link } from './entity/link.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LinkService {
    
    constructor(
        @InjectRepository(Link)
        private readonly linkRepository: Repository<Link>) {}

    async createLink(linkDto: LinkDto) {
        try {
        const shortUrl = Math.random().toString(36).substring(2, 15);
        const link = this.linkRepository.create({
            ...linkDto,
                short_url: shortUrl
            });
            return this.linkRepository.save(link);
        } catch (error) {
            throw new Error('Failed to create link');
        }
    }

    async getLink(shortUrl: string) {
        try {
            const link = await this.linkRepository.findOneByOrFail({ short_url: shortUrl });
            link.view++;
            return await this.linkRepository.save(link);
        } catch (error) {
            throw new NotFoundException('Link not found');
        }
    }

    async getStats(shortUrl: string) {
        try {
            const link = await this.linkRepository.findOneByOrFail({ short_url: shortUrl });
            return link;
        } catch (error) {
            throw new NotFoundException('Link not found');
        }
    }


    async removeLink(shortUrl: string) {
        try {
            const link = await this.linkRepository.findOneByOrFail({ short_url: shortUrl });
            link.deleted_at = new Date();
            link.updated_at = new Date();
            return await this.linkRepository.save(link);
        } catch (error) {
            throw new NotFoundException('Link not found');
        }
    }

    async changeStatus(shortUrl: string) {
        try {
            const link = await this.linkRepository.findOneByOrFail({ short_url: shortUrl });
            link.status = link.status === 1 ? 0 : 1;
            link.updated_at = new Date();
            return await this.linkRepository.save(link);
        } catch (error) {
            throw new NotFoundException('Link not found');
        }
    }
}
