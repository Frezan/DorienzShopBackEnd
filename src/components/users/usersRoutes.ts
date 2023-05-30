import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import * as ResponseHandler from '../../helpers/responseHandler';
import { usersController } from './usersController';
import { validateRequiredUserCheck } from '../../validations/user.payload';
import { token } from '../../entity/token';
const auth = require("../middleware/authentification/auth");
const authAdmin = require("../middleware/authentification/authAdmin")
const jwt = require("jsonwebtoken");

export function userRoutes(
    app: express.Express,
    router: any
) {

    const createNewUser = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$createNewUser initiated');
            const controller: usersController = new usersController();
            const body = request.body;
            const result: any = await controller.createNewUser(
                body,
            );
            console.log(
                `$createNewUser response data ${JSON.stringify(result)}`
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
            console.error('$createNewUser failed');
            console.error(`$createNewUser error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    };

    const login = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$login initiated');
            const controller: usersController = new usersController();
            const body = request.body;

            const result: any = await controller.login(
                body,
            );

            console.log(
                `$login response data ${JSON.stringify(result)}`
            );
            if (!['failure', false].includes(result.status)) {
                response.locals.data = result.data;
                response.locals.message = result.message;
                response.cookie('refreshToken', result.refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
                ResponseHandler.JSONSUCCESS(request, response);
            } else {
                response.locals.errorCode = StatusCodes.OK;
                response.locals.errors = result.message;
                response.locals.error = result.message;
                ResponseHandler.JSONERROR(request, response);
            }
        } catch (err) {
            console.error('$login failed');
            console.error(`$login error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    };

    const logout = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {

        const tokenToDelete = request.cookies.refreshToken ? request.cookies.refreshToken : ''

        if (tokenToDelete) {
            await token.deleteOne({ token: tokenToDelete });
        }
        response.cookie('refreshToken', '', { httpOnly: true, maxAge: 0 })

        response.send({
            sucess: true,
            message: "You have been logout"
        })
    }
    const updateUser = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$updateUser initiated');
            const controller: usersController = new usersController();
            const body = request.body;
            const user = response.locals.user;
            console.log("USer ===>", user)
            const result: any = await controller.updateUser(
                body,
                user
            );
            console.log(
                `$updateUser response data ${JSON.stringify(result)}`
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
            console.error('$updateUser failed');
            console.error(`$updateUser error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    };

    const getUser = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$getUser initiated');
            const controller: usersController = new usersController();
            const body = request.params.userId;
            const user = response.locals.user;
            console.log("USer ===>", user)
            const result: any = await controller.getUser(
                body,
                user
            );
            console.log(
                `$getUser response data ${JSON.stringify(result)}`
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
            console.error('$getUser failed');
            console.error(`$getUser error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }

    const sendResetPasswordEmail = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$sendResetPasswordEmail initiated');
            const controller: usersController = new usersController();
            const body = request.query.userId;
            const result: any = await controller.sendResetPasswordEmail(
                body,
            );
            console.log(
                `$sendResetPasswordEmail response data ${JSON.stringify(result)}`
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
            console.error('$sendResetPasswordEmail failed');
            console.error(`$sendResetPasswordEmail error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }

    const resetPassword = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$resetPassword initiated');
            const controller: usersController = new usersController();
            const body = request.body;
            const user = response.locals.user;
            console.log("USer ===>", user)
            const result: any = await controller.resetPassword(
                body,
                user
            );
            console.log(
                `$resetPassword response data ${JSON.stringify(result)}`
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
            console.error('$resetPassword failed');
            console.error(`$resetPassword error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    };

    const getAllUser = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$getAllUser initiated');
            const controller: usersController = new usersController();
            const pagination = request.query.pagination;
            const result: any = await controller.getAllUser(
                pagination
            );
            console.log(
                `$getAllUser response data ${JSON.stringify(result)}`
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
            console.error('$getAllUser failed');
            console.error(`$getAllUser error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }

    const deleteUser = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        try {
            console.log('$deleteUser initiated');
            const controller: usersController = new usersController();
            const body = request.query.userId;
            const result: any = await controller.deleteUser(
                body,
            );
            console.log(
                `$deleteUser response data ${JSON.stringify(result)}`
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
            console.error('$deleteUser failed');
            console.error(`$deleteUser error : ${JSON.stringify(err)}`);
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }
    const deleteToken = async (
        request: express.Request,
        response: express.Response,
        next: any
    ) => {
        const userId = request.params.userId
        const findRefreshToken = token.findOne({ userId: userId, expired_at: { $gte: new Date() } });

        if (findRefreshToken) {
            await token.deleteOne({ userId: userId, expired_at: { $gte: new Date() } })
        }
        response.locals.message = "Token session succesfully deleted";
        ResponseHandler.JSONSUCCESS(request, response);


    }


   
    router.post('/user/login', login);
    router.get('/user/logout', logout);
    
    router.post('/user/sendResetPasswordEmail', sendResetPasswordEmail);
    router.post('/user/create', validateRequiredUserCheck, createNewUser);

    router.post('/user/update', auth, updateUser);
    router.get('/user/profil/:userId', auth, getUser);
    router.get('/user/delete/:userId', authAdmin, deleteUser)
    router.get('/users/:pagination', authAdmin, getAllUser)
   
    router.get('/user/deleteToken/:userId', authAdmin, deleteToken)


    router.post('/user/resetPassword', auth, resetPassword)
}
