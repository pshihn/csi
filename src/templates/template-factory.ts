import { Template, TemplateInfo, TemplateType } from './template';
import { OGTemplate } from './og-template';
import { SwyxTemplate } from './swyx-template';
import { AuthorTemplate } from './author-template';

const templateMap = new Map<TemplateType, Template>();

export function templateByType(type: TemplateType): Template | null {
  if (templateMap.has(type)) {
    return templateMap.get(type)!;
  }
  let template: Template | null = null;
  switch (type) {
    case 'author':
      template = new AuthorTemplate();
      break;
    case 'sketchy':
      break;
    case 'swyx':
      template = new SwyxTemplate();
      break;
    case 'og':
      template = new OGTemplate();
      break;
  }
  if (template) {
    templateMap.set(type, template);
  }
  return template;
}

export const templateList: TemplateInfo[] = [
  {
    type: 'og',
    name: 'The OG',
    preview: '/images/preview.png'
  },
  {
    type: 'swyx',
    name: 'SWYX',
    preview: '/images/preview.png'
  },
  {
    type: 'author',
    name: 'Writer',
    preview: '/images/preview.png'
  },
  {
    type: 'sketchy',
    name: 'Sketchy',
    preview: '/images/preview.png'
  }
];