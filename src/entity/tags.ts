import { Document, model, Model, Schema, connection } from 'mongoose';
const db = connection.useDb('db01');

interface ITags extends Document {
    tagId: String;
    name: String,
    type: String,
    creationDate: Date,
    lastUpdateDate: Date,
    active: Boolean
}
const tagsSchema: Schema = new Schema(
    {
        tagId: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        active: { type: Boolean, required: true, default: true },
        creationDate: { type: Date, required: true, default: new Date().toISOString() },
        lastChangeDate: { type: Date, required: true, default: new Date().toISOString() },
    },
    { versionKey: false }
);

const tag: Model<any> = db.model('tags', tagsSchema);
export { tag, ITags };