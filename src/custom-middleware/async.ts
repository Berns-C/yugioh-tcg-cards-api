const asyncHandler =
  (fn) =>
  (req, res, next, findResult = null) =>
    Promise.resolve(fn(req, res, next, findResult)).catch(next);

export default asyncHandler;
