import { v4 as uuidv4 } from 'uuid';
import { product } from '../../entity/product';
const jwt = require("jsonwebtoken");
import { firstLetterInUpperCase } from '../../helpers/function';



export class productsController {

    public async getAllproducts(pagination): Promise<any> {
        let limite = 15 * pagination;
        let productList = await product.find({}).limit(limite);

        if (!productList) {
            return {
                status: false,
                message: 'products not found'
            }
        }

        return {
            status: true,
            data: productList
        }


    }

    public async createproduct(body): Promise<any> {
        console.log("BODY =====>",body)
        body.name = firstLetterInUpperCase(body.name.trim().toLowerCase());
        let productData = await product.findOne({ name: body.name })
        if (productData) {
            return {
                success: false,
                message: 'product already exist'
            }
        }
        body.productId = uuidv4();

        let newproduct = await product.create(body);

        if (!newproduct) {
            return {
                success: false,
                message: 'product creation failed'
            }
        }

        return {
            success: true,
            data: newproduct,
            message: 'product creation succed'
        }
    }

    public async updateproduct(productId, body): Promise<any> {
        let productData = await product.findOne({ productId: productId });
        if (!productData) {
            return {
                sucess: false,
                message: ' Could not find product'
            }
        }

        let updatedproduct = await product.findOneAndUpdate({ productId: productId }, body, { new: true });

        if (!updatedproduct) {
            return {
                success: false,
                message: 'product update failed'
            }
        }


        return {
            sucess: true,
            data: updatedproduct,
            message: "Update of product done"
        }
    }

    public async deleteproduct(productId): Promise<any> {
        let productData = await product.findOne({ productId: productId });

        if (!productData) {
            return {
                sucess: false,
                message: ' Could not find User'
            }
        }

        let productDeleted = await product.deleteOne({ productId: productId });

        if (!productDeleted) {
            return {
                sucess: false,
                message: 'User already deleted'
            }
        }
        return {
            success: true,
            message: 'User have been deleted'
        }

    }

    public async getproduct(productId): Promise<any> {

        let productData = await product.findOne({ productId: productId }).lean();

        if (!productData) {
            return {
                success: false,
                message: 'User not found'
            }
        }

        return {
            success: true,
            data: productData
        }

    }

}