import slugify from 'slugify';
import { findSpecialChar, replaceSpecialChar } from '../utilities/texts';

const slugifyName = (name) => {
  if (name && name?.length) {
    const text = findSpecialChar(name) ? replaceSpecialChar(name) : name;
    return slugify(text, {
      lower: true,
    });
  }

  return '';
};

export default slugifyName;
