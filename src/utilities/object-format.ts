import { formPaginationUrl } from './texts';
import { getTotalRemaining } from '../utilities/numbers';

export const getValidProperties = (arrKeys, inputObj) => {
  const arr = arrKeys.reduce((accumulator, key) => {
    if (inputObj[key]) {
      accumulator[key] = inputObj[key];
    }
    return accumulator;
  }, {});

  return arr;
};

export const formPagination = ({
  url,
  offset,
  limit,
  filters = '',
  total,
}: {
  url: string;
  offset: number;
  limit: number;
  filters?: string;
  total: number;
}) => {
  const remaining = getTotalRemaining(total, limit, offset);
  const nextOffset = offset + limit;
  const currentRows = total - (offset + remaining);
  const pagination = {
    current_rows: currentRows,
    prev_page: '',
    next_page: '',
    remaining_data: remaining,
    text: `${nextOffset > total ? total : nextOffset}/${total}`,
  };

  if (filters.includes(' ')) {
    filters = filters?.replaceAll(' ', '_');
  }

  if (offset > 0) {
    const prevOffset = offset - limit;
    pagination.prev_page = formPaginationUrl({
      url,
      offset: prevOffset > 0 ? prevOffset : 0,
      limit,
      filters,
    });
  }

  if (nextOffset <= total && remaining > 0) {
    pagination.next_page = formPaginationUrl({
      url,
      offset: nextOffset,
      limit,
      filters,
    });
  }

  return pagination;
};

export const formRegexObj = (text: string) => {
  if (text.includes('_')) {
    text = text.replaceAll('_', ' ');
  }
  return {
    $regex: `${text}`,
    $options: 'i',
  };
};

export const defaultOperation = (num: string) => {
  //Use $eq operation as default.
  const numCount = parseInt(num);
  return { $eq: numCount };
};

export const getFirstOperation = (obj: object) => {
  const firstKey = Object.keys(obj)[0];
  const num = parseInt(obj[firstKey]);

  return { key: firstKey, num };
};

export const formOperationObj = (objKey: string, num: number) => {
  const operation = {};
  operation[`$${objKey}`] = num;
  return operation;
};
