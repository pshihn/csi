export type VERT_ALIGNMENT = 'top' | 'bottom' | 'middle';
export type HORIZ_ALIGNMENT = 'left' | 'right' | 'center';

export interface PageImage {
  image: HTMLImageElement;
  halign: HORIZ_ALIGNMENT;
  valign: VERT_ALIGNMENT;
}

export interface PageData {
  title: string;
  subtitle: string;
  halign: HORIZ_ALIGNMENT;
  valign: VERT_ALIGNMENT;
  fontSize: number;
  textColor: string;
  bgColor: string;
  image?: PageImage;
}