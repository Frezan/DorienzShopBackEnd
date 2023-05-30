import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

export const JSONERROR: (req: Request, res: Response) => void = (
    req: Request,
    res: Response
): void => {
    const errorCode: number = res.locals.errorCode || HttpStatus.BAD_REQUEST;
    const obj = {
        status: 'failure',
        data: res.locals.data || {},
        errors: res.locals.errors || {},
        message: res.locals.message || '',
    };
    const err: any = res.locals.errors;
    console.log(err);
    res.status(errorCode).send(obj);
};

export const JSONSUCCESS: (
    req: Request,
    res: Response,
    loggerMessage?: String
) => void = (req: Request, res: Response, loggerMessage?: String): void => {
    const obj = {
        status: res.locals.status
            ? 'success'
            : res.locals.status == undefined
            ? 'success'
            : 'failure',
        data: {},
        errors: {},
        message: '',
    };

    if (res.locals.data) {
        obj.data = res.locals.data;
    }
    if (res.locals.errors) {
        obj.errors = res.locals.errors;
    }
    if (res.locals.message) {
        obj.message = res.locals.message;
    }
    console.log(obj.message);
    if (loggerMessage) {
        console.log(`${loggerMessage} : ${JSON.stringify(obj)}`);
    }
    res.status(HttpStatus.StatusCodes.OK).send(obj);
};

export const printRequestPayload = (message, body) => {
    if (body) {
        console.log(`${message} : ${JSON.stringify(body)}`);
    } else {
        console.log(`${message} : {}`);
    }
};
