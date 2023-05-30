import { Document, model, Model, Schema, connection } from 'mongoose';
const db = connection.useDb('db01');
interface IUser extends Document {
    userId: String;
    title: String,
    birthday: Date,
    lastName: String,
    firstName: String,
    email: String,
    phone: String,
    avatar:String,
    passwordHash:String,
    creationDate:Date,
    lastUpdateDate:Date,
    addresses: Object[]
}
const usersSchema: Schema = new Schema(
    {
        userId: { type: String, required: true },
        passwordHash:{type:String,required:true},
        title: { type: String, required: true },
        birthday: { type: Date, required: false },
        lastName: { type: String, required: true },
        firstName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: false },
        avatar: {type:String, required:false}, 
        creationDate:{type:Date,required:true, default : new Date().toISOString()},
        lastChangeDate: {type:Date,required:true, default : new Date().toISOString()},
        addresses: { type: Array, required: false },
        role: {type:String, required:true, default:'Customer'}
    },
    { versionKey: false }
);

const user: Model<any> = db.model('users', usersSchema);
export { user, IUser };