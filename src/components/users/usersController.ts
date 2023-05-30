import { v4 as uuidv4 } from 'uuid';
import { user } from '../../entity/user';
import { token } from '../../entity/token';
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
import { firstLetterInUpperCase } from '../../helpers/function';
const nodemailer = require('nodemailer');



export class usersController {
    public async sendEmail(email: any, subject, message) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILERUSER,
                pass: process.env.NODEMAILERPSW
            }
        });
        const mailOptions = {
            from: process.env.NODEMAILERUSER,
            to: email,
            subject: subject,
            html: message
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                // do something useful
            }
        });

        return 'success'
    }

    public async createNewUser(body: any): Promise<any> {
        if (!body.email) {
            console.log(
                '$createNewUser controller : Failed because email not provided'
            );
            return {
                status: false,
                data: {},
                message: 'Email not provided',
            };
        }

        const checkEmail = /^[\w-+\.]+@([\w-+]+\.)+[\w-]{2,4}$/g
        const checkpassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g

        if (!body.email.match(checkEmail)) {
            return {
                status: false,
                data: {},
                message:
                    'Email not valid',
            };
        }
        if(!body.password.match(checkpassword)){
            return {
                status: false,
                data: {},
                message:
                    'Pasword must have at least eight characters, at least one uppercase letter, one lowercase letter and one number',
            };
        }
        const check = await user.findOne({
            'email': body.email,
        });

        if (check) {
            console.log(
                '$createNewUser controller : Failed because user email already exists'
            );
            return {
                status: false,
                data: {},
                message:
                    'Email already exists. Please choose other email',
            };
        }

        let password = body.password;
        let passwordHash = await bcrypt.hash(password, 10);
        console.log("password Hash ===>", passwordHash)
        const userdata = {
            userId: uuidv4(),
            passwordHash: passwordHash,
            title: body.title,
            phone: body.phone,
            firstName: firstLetterInUpperCase(body.firstName.trim()),
            email: body.email,
            addresses: body.addresses,
            birthday: body.birthday,
            lastName: firstLetterInUpperCase(body.lastName.trim()),
            creationDate: new Date().toISOString(),
            lastChangeDate: new Date().toISOString()
        };

        const result = await user.create(userdata);

        if (!result) {
            console.log(
                '$createNewUser controller : Failed because user not created'
            );
            return { status: false, data: {}, message: 'User not created' };
        }
        let data = {userId:userdata.userId}

        let message = '<p>Hello, ' + userdata.firstName + " your account has been created on DorienzShop,"
            + "you can now use it on the website.</p>"

        let subject = "Dorienz Shop - Your account has been created"

        let sendConfirmation = await this.sendEmail(userdata.email, subject, message);


        console.log('$createNewUser controller terminated');
        return {
            status: 'success',
            data: data,
            message: 'User created succesfully'
        };
    }

    public async login(body: any): Promise<any> {

        const email = body.email;
        const password = body.password
        if (!email || !password) {
            return {
                sucess: false,
                message: 'Email and password are required'
            }
        }

        const userData = await user.findOne({ email: email });

        if (!userData) {
            return {
                success: false,
                message: "User not found"
            }
        }

        if (await bcrypt.compare(password, userData.passwordHash)) {
            const payload: any = {
                userId: userData.userId,
                lastName: userData.lastName,
                firstName: userData.firstName,
                email: userData.email,
                role: userData.role
            };
            const JWTtoken: string = jwt.sign(
                payload,
                process.env.JWTTOKENSECRETKEY,
                {
                    expiresIn: 60*30,
                }
            );

            const refreshToken = jwt.sign(
                payload,
                process.env.JWTREFRESHTOKENSECRETKEY,
                {
                    expiresIn: "7d",
                }
            );
            const expiredAt = new Date();
            expiredAt.setDate(expiredAt.getDate() + 7);

            let tokenPayload = {
                userId:payload.userId,
                token:refreshToken,
                expiredAt:expiredAt
            }
            console.log("TOKEN PAYLOAD ====>",tokenPayload)
            let newToken = await token.create(tokenPayload);
            console.log("new token",newToken)
            //userData.token = JWTtoken;
            return {
                success: true,
                data: {
                    userData: payload,
                    token: JWTtoken
                },
                refreshToken: refreshToken

            }
        }
        else {
            return {
                success: false,
                message: 'Invalid credentials'
            }
        }

    }

    public async updateUser(body: any, userSession): Promise<any> {

        let userData = await user.findOne({ userId: body.userId });

        if (body.userId != userSession.userId && userSession.role != 'Admin') {
            return {
                sucess: false,
                message: 'User is not auhtorized'
            }
        }
        if (!userData) {
            return {
                sucess: false,
                message: ' Could not find User'
            }
        }

        if (body.email != userData.email) {
            return {
                sucess: false,
                message: 'Ask the support if you want to change your email.'
            }
        }

        let upadteUser = await user.findOneAndUpdate({ userId: body.userId }, body, { new: true });

        let message = '<p>Hello, ' + userData.firstName + " your account has been modified on DorienzShop,"
            + "if it is not your doing please contact the support.</p>"

        let subject = "Dorienz Shop - Your account has been modified"

        let sendConfirmation = await this.sendEmail(userData.email, subject, message);

        return {
            sucess: true,
            data: upadteUser,
            message: "Update done"
        }

    }

    public async deleteUser(body: any): Promise<any> {
        let userData = await user.findOne({ userId: body.userId });

        if (!userData) {
            return {
                sucess: false,
                message: ' Could not find User'
            }
        }

        let userDeleted = await user.deleteOne({ userId: body.userId });

        if (userDeleted) {
            let upadteUser = await user.updateOne(body);
            let message = 'Hello, ' + userData.firstName + " your account has been deleted on DorienzShop,"
                + "if it is not your doing please contact the support. If it is we hope that you will come back soon."
            let subject = "Dorienz Shop - Your account was deleted"
            let sendConfirmation = await this.sendEmail(userData.email, subject, message);

            return {
                success: true,
                message: 'User have been deleted'
            }
        }
        else {
            return {
                sucess: false,
                message: 'User already deleted'
            }
        }
    }

    public async sendResetPasswordEmail(body: any): Promise<any> {

        let userData = await user.findOne({ email: body.email });

        if (!userData) {
            return {
                sucess: false,
                message: 'Could not find User'

            }
        }

        const payload: Object = {
            userId: userData.userId,
            lastName: userData.lastName,
            firstName: userData.firstName,
            email: userData.email,
            role: userData.role
        };
        const JWTtoken: string = jwt.sign(
            payload,
            process.env.JWTTOKENSECRETKEY,
            {
                expiresIn: "2h",
            }
        );

        let link = process.env.FRONTURL + "/resetPassword/" + JWTtoken;
        let subject = "Dorienz Shop - Reset your password Link"
        let message = "<p>Here is a link to reset your password, if you did not ask for it then simply ignore this mail : <a href='"
            + link + "'></a></p>"

        let sendConfirmation = await this.sendEmail(userData.email, subject, message);

        return {
            success: true,
            message: 'Send email rest password done'
        }

    }

    public async resetPassword(body: any, userSession): Promise<any> {
        let userData = await user.findOne({ userId: userSession.userId }).lean();

        if (!userData) {
            return {
                sucess: false,
                message: 'User was not found'
            }
        }

        let newPassword = body.password;
        let passwordHash = await bcrypt.hash(newPassword, 10);

        let payload = {
            passwordHash: passwordHash
        }

        let updatedUser = await user.updateOne(payload)

        return {
            sucess: true,
            data: updatedUser
        }


    }

    public async getUser(userId: any, userSession): Promise<any> {

        if (userId != userSession.userId && userSession.role != "Admin") {
            return {
                success: false,
                message: "User not auhtorized"
            }
        }

        let userData = await user.findOne({ userId: userId }).lean();

        if (!userData) {
            return {
                success: false,
                message: 'User not found'
            }
        }

        return {
            success: true,
            data: userData
        }

    }


    public async getAllUser(pagination): Promise<any> {

        let limit = 15 * pagination;

        let users = await user.find({}).limit(limit);
        if (!users) {
            return {
                success: false,
                message: 'No users found'
            }
        }

        return {
            success: true,
            data: users,
        }
    }
}