import { MENU_ITEMS } from './menu';

export const SYSTEM_MODULES: any[] = [];

let currentCategory = '';
let categoryIndex = 0;
MENU_ITEMS.forEach(item => {
  if (item.category && item.category !== 'TOP' && item.category !== currentCategory) {
    SYSTEM_MODULES.push({
      id: `heading_${categoryIndex}_${item.category.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10)}`,
      isHeading: true,
      label: item.category
    });
    currentCategory = item.category;
    categoryIndex++;
  }
  
  SYSTEM_MODULES.push({
    id: item.id,
    label: item.name,
    icon: item.icon,
    isHeading: false,
    subItems: item.subItems?.map(sub => ({
      id: sub.id,
      label: sub.name
    }))
  });
});
