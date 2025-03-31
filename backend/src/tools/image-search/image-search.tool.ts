import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ImageSearchResponse, ImageSearchResult } from './image-search.dto';

@Injectable()
export class ImageSearchTool {
  private readonly apiKey: string;
  private readonly searchEngineId: string;
  private readonly baseUrl = 'https://www.googleapis.com/customsearch/v1';

  constructor(private readonly configService: ConfigService) {
    this.apiKey = configService.get<string>('GOOGLE_SEARCH_API_KEY');
    this.searchEngineId = configService.get<string>('GOOGLE_SEARCH_ENGINE_ID');
  }

  async execute(query: string): Promise<ImageSearchResult> {
    try {
      const response = await axios.get<ImageSearchResponse>(this.baseUrl, {
        params: {
          key: this.apiKey,
          cx: this.searchEngineId,
          q: query,
          searchType: 'image',
          num: 5,
        },
      });

      if (!response.data.items?.length) {
        throw new Error('No images found');
      }

      // Find first image with valid extension
      const validExtensions = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
      const validImage = response.data.items.find((item) =>
        validExtensions.some((ext) => item.link.toLowerCase().endsWith(ext)),
      );

      if (!validImage) {
        return {
          imageUrl: '',
          sourceUrl: '',
          dimensions: {
            height: 0,
            width: 0,
          },
        };
      }

      return {
        imageUrl: validImage.link,
        sourceUrl: validImage.image.contextLink,
        dimensions: {
          height: validImage.image.height,
          width: validImage.image.width,
        },
      };
    } catch (error) {
      console.error('Image search error:', error);
      return {
        imageUrl:
          'https://blog.cgify.com/wp-content/uploads/2025/03/Teams-Dashboard-Design-3-min.jpg',
        sourceUrl:
          'https://blog.cgify.com/wp-content/uploads/2025/03/Teams-Dashboard-Design-3-min.jpg',
        dimensions: {
          height: 1080,
          width: 1920,
        },
      };
    }
  }
}
