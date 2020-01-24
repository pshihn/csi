export type VERT_ALIGNMENT = 'top' | 'bottom' | 'middle';
export type HORIZ_ALIGNMENT = 'left' | 'right' | 'center';

export interface PageImage {
  buffer: ArrayBuffer;
  width: number;
  height: number;
}

export interface PageData {
  title: string;
  subtitle: string;
  author: string;
  halign: HORIZ_ALIGNMENT;
  valign: VERT_ALIGNMENT;
  fontSize: number;
  textColor: string;
  bgColor: string;
  image?: PageImage;
  halignImage: HORIZ_ALIGNMENT;
  valignImage: VERT_ALIGNMENT;
  tint: boolean;
}