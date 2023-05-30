import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import * as ResponseHandler from '../../helpers/responseHandler';
import { productsController } from './productsController';
import { validateRequiredUserCheck } from '../../validations/user.payload';
const auth = require("../middleware/authentification/auth");
const authAdmin = require("../middleware/authentification/authAdmin")
const cloudinary = require('../middleware/upload/cloudinary');
const upload = require('../middleware/upload/multer');
const fs = require('fs')


export function productsRoutes(
    app: express.Express,
    router: any
) {
    const getAllproducts = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$getAllproducts initiated');
            const controller: productsController = new productsController();
            const pagination = request.query.pagination;
            const result: any = await controller.getAllproducts(
                pagination
            );
            console.log(
                `$getAllproducts response data ${JSON.stringify(result)}`
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
            console.error('$getAllproducts failed');
            console.error(`$getAllproducts error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }

    const createproduct = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            const uploader = async (path) => {
                let pathCloud = await cloudinary.uploads(path, "Images"); console.log(pathCloud);
                return pathCloud.url
            }

            if (request.method === 'POST') {

                const urls = [];
                const files = request.files;
                console.log("files ===>", files)
                //@ts-ignore
                for (const file of files) {
                    const { path } = file;
                    const newPath = await uploader(path);
                    console.log("new path =====>", newPath)
                    urls.push(newPath)
                    fs.unlinkSync(path)
                }

                console.log("URLS ===>", urls)


                console.log('$createproduct initiated');
                const controller: productsController = new productsController();
                const body = JSON.parse(request.body.body);

                body.img1 = urls[0] ? urls[0] : ''
                body.img2 = urls[1] ? urls[1] : ''
                body.img3 = urls[2] ? urls[2] : ''


                const result: any = await controller.createproduct(
                    body,
                );
                console.log(
                    `$createproduct response data ${JSON.stringify(result)}`
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
            else {
                response.status(400).json({
                    err: `${request.method} is not allowed `
                })
            }


        } catch (err) {
            console.error('$createproduct failed');
            console.error(`$createproduct error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }

    const updateproduct = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$updateproduct initiated');
            const controller: productsController = new productsController();
            const productId = request.params.productId;
            const body = request.body;
            const result: any = await controller.updateproduct(
                productId,
                body
            );
            console.log(
                `$updateproduct response data ${JSON.stringify(result)}`
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
            console.error('$updateproduct failed');
            console.error(`$updateproduct error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }

    const deleteproduct = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$deleteproduct initiated');
            const controller: productsController = new productsController();
            const body = request.params.productId;
            const result: any = await controller.deleteproduct(
                body,
            );
            console.log(
                `$deleteproduct response data ${JSON.stringify(result)}`
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
            console.error('$deleteproduct failed');
            console.error(`$deleteproduct error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }

    const getproduct = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$getproduct initiated');
            const controller: productsController = new productsController();
            const body = request.params.productId;
            const result: any = await controller.getproduct(
                body
            );
            console.log(
                `$getproduct response data ${JSON.stringify(result)}`
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
            console.error('$getproduct failed');
            console.error(`$getproduct error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }

    const filteredproduct = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$getAllproducts initiated');
            const controller: productsController = new productsController();
            const pagination = request.params.pagination;
            const result: any = await controller.getAllproducts(
                pagination
            );
            console.log(
                `$getAllproducts response data ${JSON.stringify(result)}`
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
            console.error('$getAllproducts failed');
            console.error(`$getAllproducts error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }


    router.post('/products/create', authAdmin, upload.array('image', 3), createproduct)
    router.post('/products/updateproduct/:productId', authAdmin, updateproduct)
    router.post('/products/filteredproduct', filteredproduct)
    router.get('/products/deleteproduct/:productId', authAdmin, deleteproduct)
    router.get('/products/details/:productId', authAdmin, getproduct)
    router.get('/products/:pagination', authAdmin, getAllproducts)

}