export const BadRequestError = (message) => {
    const error = new Error(message);
    error.status = 400;
    return error;
}
export const NotFoundError = (message) => {
    const error = new Error(message);
    error.status = 404;
    return error;
}

export const InternalServerError = (err) => {
    const message = (typeof err === 'string' ? err : err.message) || 'Iternal Server Error';
    const error = new Error(message);
    error.status = err.status || 500;
    return error;
}

export const UnauthorizedError = (message) => {
    const error = new Error(message);
    error.status = 401;
    return error;
};

export const ConflictError = (message) => {
    const error = new Error(message);
    error.status = 409;
    return error;
};