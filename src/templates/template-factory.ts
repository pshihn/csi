import { Template } from '../template';
import { OGTemplate } from './og-template';

const templateMap = new Map<string, Template>();

export function templateById(id: string): Template | null {
  if (templateMap.has(id)) {
    return templateMap.get(id)!;
  }
  const template = new OGTemplate();
  templateMap.set(id, template);
  return template;
}