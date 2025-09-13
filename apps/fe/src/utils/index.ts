import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function replaceMaxWidth(html) {
  // thay thế tất cả "max-width: 900px;" thành "max-width: 100%;"
  // thay thế tất cả "width: 900px;" thành "width: 100%;"
  // thay thế tất cả "width: 900px !important" thành "width: 100% !important"
  return html
    .replace(/max-width:\s*900px;/g, 'max-width: 100%;')
    .replace(/width:\s*900px;/g, 'width: 100%;')
    .replace(/width:\s*900px\s*!important/g, 'width: 100% !important');
}
