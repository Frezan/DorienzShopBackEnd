import { NextFunction, Request, Response } from 'express';
import { Joi, validate } from 'express-validation';
import * as ResponseHandler from '../helpers/responseHandler';


export const validateRequiredUserJson = {
    body: Joi.object(
        {
            lastName: Joi.string().required(),
            title:Joi.string().required(),
            birthday:Joi.date(),
            phone:Joi.string(),
            avatar:Joi.string(),
            firstName: Joi.string().required(),
            email: Joi.string().required(),
            addresses: Joi.array(),
            password: Joi.string().required()
        }
    )
}


export const validateRequiredUserCheck = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const userPayloadCheck =
    validateRequiredUserJson.body.validate(request.body);
    if (userPayloadCheck.error) {
        response.locals.errors = userPayloadCheck.error;
        response.locals.message = 'Validation error';
        console.log("responses ====>",response.locals)
        ResponseHandler.JSONERROR(request, response);
    }
    else {
        next();
    }
}