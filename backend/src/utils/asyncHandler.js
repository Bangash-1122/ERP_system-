/**
 * Express Async Handler to eliminate repetitive try-catch blocks
 * Automatically forwards rejected promises to the next error middleware
 */
export const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

export default asyncHandler;
