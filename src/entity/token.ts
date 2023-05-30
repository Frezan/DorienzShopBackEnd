import { Document, model, Model, Schema, connection } from 'mongoose';
const db = connection.useDb('db01');
interface IToken extends Document {
    userId: String;
    token: String,
    creationDate:Date,
    expiredAt:Date,
}
const tokenSchema: Schema = new Schema(
    {
        userId: { type: String, required: true },
        token:{type:String,required:true},
        creationDate:{type:Date,required:true, default : new Date().toISOString()},
        expiredAt: {type:Date,required:true},
    },
    { versionKey: false }
);

const token: Model<any> = db.model('tokens', tokenSchema);
export { token, IToken };