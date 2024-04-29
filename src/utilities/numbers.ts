export const getTotalRemaining = (
  total: number,
  limit: number,
  offset: number
) => {
  const remaining = total - (offset + limit);
  return remaining > 0 ? remaining : 0;
};

export const handleOffsetSkipCount = (total: number, offset: string) => {
  const skip = parseInt(offset);

  return skip <= total && !isNaN(skip) ? skip : 0;
};
