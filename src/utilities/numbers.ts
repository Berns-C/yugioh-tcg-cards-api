export const getTotalRemaining = (
  total: number,
  limit: number,
  offset: number
) => {
  const remaining = total - limit;
  const currentCount = offset + limit;

  if (offset > 0) {
    return currentCount > total ? 0 : total - currentCount;
  }

  return remaining > 0 ? remaining : 0;
};

export const handleOffsetSkipCount = (total: number, offset: string) => {
  const skip = parseInt(offset);

  return skip <= total && !isNaN(skip) ? skip : 0;
};
