import {
  DEFAULT_LIMIT_PER_QUERY,
  MAX_LIMIT_PER_QUERY,
} from '../data/constant_variables';

export const setLimit = (limit: string) => {
  const max = MAX_LIMIT_PER_QUERY;
  const defaultLimit = DEFAULT_LIMIT_PER_QUERY;
  const num = parseInt(limit);

  if (isNaN(num) || num === 0) {
    return defaultLimit;
  }

  return num <= max ? num : max;
};

export const setDefaultOperator = (num: string) => {
  //Use $eq operation as default.
  const numCount = parseInt(num);
  return { $eq: numCount };
};

export const createRegexQuery = (text: string) => {
  if (text.includes('_')) {
    text = text.replaceAll('_', ' ');
  }
  return {
    $regex: `${text}`,
    $options: 'i',
  };
};

export const findFirstOperatorKey = (obj: object) => {
  const firstKey = Object.keys(obj)[0];
  const num = parseInt(obj[firstKey]);

  return { key: firstKey, num };
};

export const createOperatorQuery = (objKey: string, num: number) => {
  const operation = {};
  operation[`$${objKey}`] = num;
  return operation;
};
