export interface ImageSearchResponse {
  items: Array<{
    link: string;
    image: {
      contextLink: string;
      height: number;
      width: number;
    };
  }>;
}

export interface ImageSearchResult {
  imageUrl: string;
  sourceUrl: string;
  dimensions: {
    height: number;
    width: number;
  };
}
