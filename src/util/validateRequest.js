import { BadRequestError } from "../config/errors/index.js";

export default {
    create: (schema, request) => {
        Object.keys(request).forEach((key) => {
            if (!Object.hasOwn(schema, key)) {
                throw BadRequestError(`Invalid request data: ${key} is not a valid field`);
            }
        });
        const newRequest = {};
        Object.keys(schema).forEach((key) => {
            if (!Object.hasOwn(request, key) || !request[key] || request[key] === '') {
                throw BadRequestError(`Invalid request data: ${key} is required`);
            }
            if (typeof request[key] !== typeof schema[key]) {
                throw BadRequestError(`Invalid request data: ${key} must be a ${typeof schema[key]}`);
            }
            if (key === 'address') {
                Object.keys(schema.address).forEach((keyAdress) => {
                    if (!Object.hasOwn(request.address, keyAdress)) {
                        throw BadRequestError('Invalid address data');
                    }
                    if( (typeof request.address[key] !== typeof schema.address[key])){
                        throw BadRequestError(`Invalid address data: ${key} must be a ${typeof schema.address[key]}`);
                    }
                })
            }
            newRequest[key] = request[key];
        });
        return newRequest
    },
    update: (schema, request) => {
        const newRequest = {};
        Object.keys(request).forEach((key) => {
            if (!Object.hasOwn(schema, key)) {
                throw BadRequestError(`Invalid request data: ${key} is not a valid field`);
            }
            if (!request[key] && request[key] === '' && (typeof request[key] !== typeof schema[key])) {
                throw BadRequestError(`Invalid request data: ${key} must be a ${typeof schema[key]}`);
            }
            if (key === 'address') {
                Object.keys(schema.address).forEach((keyAdress) => {
                    if (!Object.hasOwn(request.address, keyAdress)) {
                        throw BadRequestError(`Invalid address data missing field ${keyAdress}`);
                    }
                    if( (typeof request.address[key] !== typeof schema.address[key])){
                        throw BadRequestError(`Invalid address data: ${key} must be a ${typeof schema.address[key]}`);
                    }
                });
            }
            newRequest[key] = request[key];
        })
        return newRequest
    }
}
