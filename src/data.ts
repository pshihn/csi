export type VERT_ALIGNMENT = 'top' | 'bottom' | 'middle';
export type HORIZ_ALIGNMENT = 'left' | 'right' | 'center';

export interface PageData {
  title: string;
  subtitle: string;
  halign: HORIZ_ALIGNMENT;
  valign: VERT_ALIGNMENT;
  fontSize: number;
  textColor: string;
  bgColor: string;
  image?: HTMLImageElement;
  halignImage: HORIZ_ALIGNMENT;
  valignImage: VERT_ALIGNMENT;
}