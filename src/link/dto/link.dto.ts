import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate, IsUrl, IsOptional, IsInt } from 'class-validator';

export class LinkDto {
    @ApiProperty({ example: 'https://example.com', description: 'Original URL to shorten' })
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    url!: string;

    short_url?: string;

    @IsInt()
    @IsOptional()
    view?: number;

    @IsDate()
    @IsOptional()
    deleted_at?: Date;

    @IsDate()
    @IsOptional()
    created_at?: Date;

    @IsDate()
    @IsOptional()
    updated_at?: Date;
}
