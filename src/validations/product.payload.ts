import { NextFunction, Request, Response } from 'express';
import { Joi, validate } from 'express-validation';
import * as ResponseHandler from '../helpers/responseHandler';


export const validateRequiredProductJson = {
    body: Joi.object(
        {
            name: Joi.string().required(),
            description: Joi.string(),
            detailTechnique: Joi.string().required(),
            promotion: Joi.boolean(),
            promotionPercentage: Joi.number(),
            stock: Joi.number().required(),
            tags: Joi.array().items(
                {
                    tagId: Joi.string().required(),
                    name: Joi.string().required(),
                    type: Joi.string().required()
                }
            ).required(),
        }
    )
}


export const validateRequiredProductCheck = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const productPayloadCheck =
        validateRequiredProductJson.body.validate(request.body);
    if (productPayloadCheck.error) {
        response.locals.errors = productPayloadCheck.error;
        response.locals.message = 'Validation error';
        console.log("responses ====>", response.locals)
        ResponseHandler.JSONERROR(request, response);
    }
    else {
        next();
    }
}