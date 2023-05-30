import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import * as ResponseHandler from '../../helpers/responseHandler';
import { tagsController } from './tagsController';
import { validateRequiredUserCheck } from '../../validations/user.payload';
const auth = require("../middleware/authentification/auth");
const authAdmin = require("../middleware/authentification/authAdmin")


export function tagsRoutes(
    app: express.Express,
    router: any
) {
    const getAllTags = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$getAllTags initiated');
            const controller: tagsController = new tagsController();
            const pagination = request.query.pagination;
            const result: any = await controller.getAllTags(
                pagination
            );
            console.log(
                `$getAllTags response data ${JSON.stringify(result)}`
            );
            if (!['failure', false].includes(result.status)) {
                response.locals.data = result.data;
                response.locals.message = result.message;
                ResponseHandler.JSONSUCCESS(request, response);
            } else {
                response.locals.errorCode = StatusCodes.OK;
                response.locals.errors = result.message;
                response.locals.error = result.message;
                ResponseHandler.JSONERROR(request, response);
            }
        }
        catch (err) {
            console.error('$getAllTags failed');
            console.error(`$getAllTags error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }

    const createTag = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$createTag initiated');
            const controller: tagsController = new tagsController();
            const body = request.body;
            const result: any = await controller.createTag(
                body,
            );
            console.log(
                `$createTag response data ${JSON.stringify(result)}`
            );
            if (!['failure', false].includes(result.status)) {
                response.locals.data = result.data;
                response.locals.message = result.message;
                ResponseHandler.JSONSUCCESS(request, response);
            } else {
                response.locals.errorCode = StatusCodes.OK;
                response.locals.errors = result.message;
                response.locals.error = result.message;
                ResponseHandler.JSONERROR(request, response);
            }
        } catch (err) {
            console.error('$createTag failed');
            console.error(`$createTag error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }

    const updateTag = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$updateTag initiated');
            const controller: tagsController = new tagsController();
            const tagId = request.params.tagId;
            const body = request.body;
            const result: any = await controller.updateTag(
                tagId,
                body
            );
            console.log(
                `$updateTag response data ${JSON.stringify(result)}`
            );
            if (!['failure', false].includes(result.status)) {
                response.locals.data = result.data;
                response.locals.message = result.message;
                ResponseHandler.JSONSUCCESS(request, response);
            } else {
                response.locals.errorCode = StatusCodes.OK;
                response.locals.errors = result.message;
                response.locals.error = result.message;
                ResponseHandler.JSONERROR(request, response);
            }
        } catch (err) {
            console.error('$updateTag failed');
            console.error(`$updateTag error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }
    const getFilteredTags = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$getFilteredTags initiated');
            const controller: tagsController = new tagsController();
            const body = request.body.filters;
            const result: any = await controller.getFilteredTags(
                body
            );
            console.log(
                `$getFilteredTags response data ${JSON.stringify(result)}`
            );
            if (!['failure', false].includes(result.status)) {
                response.locals.data = result.data;
                response.locals.message = result.message;
                ResponseHandler.JSONSUCCESS(request, response);
            } else {
                response.locals.errorCode = StatusCodes.OK;
                response.locals.errors = result.message;
                response.locals.error = result.message;
                ResponseHandler.JSONERROR(request, response);
            }
        } catch (err) {
            console.error('$getFilteredTags failed');
            console.error(`$getFilteredTags error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }

    const deleteTag = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$deleteTag initiated');
            const controller: tagsController = new tagsController();
            const body = request.params.tagId;
            const result: any = await controller.deleteTag(
                body,
            );
            console.log(
                `$deleteTag response data ${JSON.stringify(result)}`
            );
            if (!['failure', false].includes(result.status)) {
                response.locals.data = result.data;
                response.locals.message = result.message;
                ResponseHandler.JSONSUCCESS(request, response);
            } else {
                response.locals.errorCode = StatusCodes.OK;
                response.locals.errors = result.message;
                response.locals.error = result.message;
                ResponseHandler.JSONERROR(request, response);
            }
        }
        catch (err) {
            console.error('$deleteTag failed');
            console.error(`$deleteTag error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }

    const getTag = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$getTag initiated');
            const controller: tagsController = new tagsController();
            const body = request.query.tagId;
            const result: any = await controller.getTag(
                body
            );
            console.log(
                `$getTag response data ${JSON.stringify(result)}`
            );
            if (!['failure', false].includes(result.status)) {
                response.locals.data = result.data;
                response.locals.message = result.message;
                ResponseHandler.JSONSUCCESS(request, response);
            } else {
                response.locals.errorCode = StatusCodes.OK;
                response.locals.errors = result.message;
                response.locals.error = result.message;
                ResponseHandler.JSONERROR(request, response);
            }
        }
        catch (err) {
            console.error('$getTag failed');
            console.error(`$getTag error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }


    router.post('/tags/create', authAdmin, createTag)
    router.post('/tags/updateTag/:tagId', authAdmin, updateTag)
    router.post('/tags/filteredTags', getFilteredTags)
    router.get('/tags/deleteTag/:tagId', authAdmin, deleteTag)
    router.get('/tags/details/:tagId', authAdmin, getTag)
    router.get('/tags/:pagination', authAdmin, getAllTags)

}