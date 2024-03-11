import {
  DEFAULT_LIMIT_PER_QUERY,
  MAX_LIMIT_PER_QUERY,
} from '../data/constant_variables';

export const handleOffset = () => {};

export const handleLimit = (limit: string) => {
  const max = MAX_LIMIT_PER_QUERY;
  const defaultLimit = DEFAULT_LIMIT_PER_QUERY;
  const num = parseInt(limit);

  if (isNaN(num) || num === 0) {
    return defaultLimit;
  }

  return num <= max ? num : max;
};
