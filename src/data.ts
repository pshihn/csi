export type ContentAlignment = 'top-left' | 'top-right' | 'top-center' | 'bottom-right' | 'bottom left' | 'bottom-center' | 'center';

export interface PageData {
  title: string;
  subtitle: string;
  authorName: string;
  alignment: ContentAlignment;
  fontSize: number;
  textColor: string;
  bgColor: string;
  image?: HTMLImageElement;
  authorImage?: HTMLImageElement;
}