import { Document, model, Model, Schema, connection } from 'mongoose';
const db = connection.useDb('db01');

interface IProduct extends Document {
    productId: String;
    name: String,
    description: Date,
    detailTechnique: String,
    promotion: Boolean,
    promotionPercentage: Number,
    creationDate: Date,
    lastUpdateDate: Date,
    tags: Object[],
    stock: number,
    img1: String,
    img2: String,
    img3: String
}
const productSchema: Schema = new Schema(
    {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, required: false },
        detailTechnique: { type: String, required: false },
        promotion: { type: String, required: true },
        promotionPercentage: { type: Number, required: false },
        creationDate: { type: Date, required: true, default: new Date().toISOString() },
        lastChangeDate: { type: Date, required: true, default: new Date().toISOString() },
        stock: { type: Number, requied: true, default: 0 },
        tags: { type: Array, required: true },
        img1: { type: String, required: true },
        img2: { type: String, required: false },
        img3: { type: String, required: false }
    },
    { versionKey: false }
);

const product: Model<any> = db.model('products', productSchema);
export { product, IProduct };