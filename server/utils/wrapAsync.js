// takes an Express handler (fn) and ensures that
// any error it throws (sync or async) will be passed to Express's error handler.
export default (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
  // Promise.resolve() makes sure both async (Promise-returning)
  // and sync (non-Promise) functions are handled safely.
};
