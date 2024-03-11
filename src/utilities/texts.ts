import { Request } from 'express';

export const findSpecialChar = (name: string) => {
  const regex = /^[a-zA-Z0-9\s-]*$/;
  const isValid = regex.test(name);
  return !isValid;
};

export const replaceSpecialChar = (name: string) => {
  let char = '';
  if (name?.includes('☆')) {
    char = '☆';
  } else if (name?.includes('★')) {
    char = '★';
  }

  return name.replace(char, ' ');
};

export const getOriginalUrl = (req: Request) => {
  const { path, url, originalUrl, protocol } = req;
  let urlPath = '';

  if (path === url) {
    urlPath = originalUrl;
  } else {
    const urlTrimmed = url.replace(path, '');
    urlPath = originalUrl.replace(urlTrimmed, '');
  }

  return `${protocol}://${req.get('host')}${urlPath}`;
};

export const formPaginationUrl = ({
  url,
  offset,
  limit,
  filters = '',
}: {
  url: string;
  offset: number;
  limit: number;
  filters?: string;
}) => {
  return `${url}?${filters}&offset=${offset}&limit=${limit}`;
};
