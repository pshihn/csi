import { Renderer } from './render';
import { expose } from 'workly';

const initialHandler = (event: MessageEvent) => {
  const canvas = event.data.canvas;
  if (canvas) {
    self.removeEventListener('message', initialHandler);
    const renderer = new Renderer(canvas);
    expose(renderer);
  }
};
self.addEventListener('message', initialHandler);