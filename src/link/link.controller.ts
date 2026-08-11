import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkDto } from './dto/link.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Link')
@Controller('link')
export class LinkController {
    constructor(private readonly linkService: LinkService) {}

    @Post('create')
    @ApiOperation({ summary: 'Create a new link' })
    @ApiBody({ type: LinkDto })
    @ApiResponse({ status: 201, description: 'Link created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async createLink(@Body() linkDto: LinkDto) { return await this.linkService.createLink(linkDto);}

    @Get(':shortUrl')
    @ApiOperation({ summary: 'Get a link by short URL' })
    @ApiParam({ name: 'shortUrl', description: 'The short URL of the link' })
    @ApiResponse({ status: 200, description: 'Link found' })
    @ApiResponse({ status: 404, description: 'Link not found' })    
    async getLink(@Param('shortUrl') shortUrl: string) { return await this.linkService.getLink(shortUrl); } 

    @Get('stats/:shortUrl')
    @ApiOperation({ summary: 'Get stats for a link' })
    @ApiParam({ name: 'shortUrl', description: 'The short URL of the link' })
    @ApiResponse({ status: 200, description: 'Stats found' })
    @ApiResponse({ status: 404, description: 'Stats not found' })
    async getStats(@Param('shortUrl') shortUrl: string) { return await this.linkService.getStats(shortUrl); }


    @Post('remove/:shortUrl')
    @ApiOperation({ summary: 'Remove a link' })
    @ApiParam({ name: 'shortUrl', description: 'The short URL of the link' })
    @ApiResponse({ status: 200, description: 'Link removed successfully' })
    @ApiResponse({ status: 404, description: 'Link not found' })
    async removeLink(@Param('shortUrl') shortUrl: string) { return await this.linkService.removeLink(shortUrl); }


    @Post('change-status/:shortUrl')
    @ApiOperation({ summary: 'Change the status of a link' })
    @ApiParam({ name: 'shortUrl', description: 'The short URL of the link' })
    @ApiResponse({ status: 200, description: 'Status changed successfully' })
    @ApiResponse({ status: 404, description: 'Link not found' })
    async changeStatus(@Param('shortUrl') shortUrl: string) { return await this.linkService.changeStatus(shortUrl); }
}
