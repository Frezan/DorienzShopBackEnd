import { v4 as uuidv4 } from 'uuid';
import { tag } from '../../entity/tags';
const jwt = require("jsonwebtoken");
import { firstLetterInUpperCase } from '../../helpers/function';



export class tagsController {

    public async getAllTags(pagination): Promise<any> {
        let limite = 15 * pagination;
        let tagList = await tag.find({}).limit(limite);

        if (!tagList) {
            return {
                status: false,
                message: 'Tags not found'
            }
        }

        return {
            status: true,
            data: tagList
        }


    }

    public async createTag(body): Promise<any> {
        let tagName = firstLetterInUpperCase(body.name.trim().toLowerCase());
        let tagData = await tag.findOne({ name: tagName });
        let active = body.active != null && body.active === false ? false : true;
        if (tagData) {
            return {
                success: false,
                message: 'Tag already exist'
            }
        }
        let payload = {
            tagId: uuidv4(),
            name: tagName,
            type: firstLetterInUpperCase(body.type.trim().toLowerCase()),
            active: active
        }
        if (!payload) {
            return {
                success: false,
                message: 'Tag update failed'
            }
        }

        let newTag = await tag.create(payload);

        if (!newTag) {
            return {
                success: false,
                message: 'Tag creation failed'
            }
        }

        return {
            success: true,
            data: newTag,
            message: 'Tag creation succed'
        }
    }

    public async updateTag(tagId, body): Promise<any> {
        let tagData = await tag.findOne({ tagId: tagId }).lean();
        if (!tagData) {
            return {
                sucess: false,
                message: ' Could not find Tag'
            }
        }

        let active = body.active != null && body.active === false ? false : true;
        let payload = {
            name: body.name ? firstLetterInUpperCase(body.name.trim().toLowerCase()) : tagData.name,
            type: body.type ? firstLetterInUpperCase(body.type.trim().toLowerCase()) : tagData.type,
            lastUpdateDate: new Date().toISOString(),
            active: active
        }
        if (!payload) {
            return {
                success: false,
                message: 'Tag update failed'
            }
        }
        let checkTag = await tag.findOne({ tagId: { $ne: tagId }, name: payload.name });

        if (checkTag) {
            return {
                success: false,
                message: 'Tag already exist'
            }
        }

        let updatedTag = await tag.findOneAndUpdate({ tagId: tagId }, payload, { new: true });

        if (!updatedTag) {
            return {
                success: false,
                message: 'Tag update failed'
            }
        }


        return {
            sucess: true,
            data: updatedTag,
            message: "Update of Tag done"
        }
    }

    public async deleteTag(tagId): Promise<any> {
        let tagData = await tag.findOne({ tagId: tagId });

        if (!tagData) {
            return {
                sucess: false,
                message: ' Could not find Tag'
            }
        }

        let tagDeleted = await tag.deleteOne({ tagId: tagId });

        if (!tagDeleted) {
            return {
                sucess: false,
                message: 'Tag already deleted'
            }
        }
        return {
            success: true,
            message: 'Tag have been deleted'
        }

    }

    public async getTag(tagId): Promise<any> {

        let tagData = await tag.findOne({ tagId: tagId }).lean();

        if (!tagData) {
            return {
                success: false,
                message: 'User not found'
            }
        }

        return {
            success: true,
            data: tagData
        }

    }

    public async getFilteredTags(filters): Promise<any> {

        if (!filters || filters.length < 1) {
            return {
                status: false,
                message: "Please give valid filters"
            }
        }

        let query = [
            {
                $match: {
                    active: true,
                    $or: []
                }
            },
            {
                $group: {
                    _id: "$type",
                    tags: {
                        $addToSet: {
                            name: '$name'
                        }
                    }
                }
            },
            {
                $facet: {
                    'records': [
                        {
                            $skip: 0
                        }
                    ],
                    'count': [
                        {
                            $count: 'count'
                        }
                    ]
                }
            },
            {
                $project: {
                    'data': {
                        'records': '$records',
                        'countTotal': {
                            $first: '$count'
                        }
                    }
                }
            },
            {
                $replaceRoot: {
                    'newRoot': '$data'
                }
            }
        ];

        filters.map((element) => {
            query[0].$match.$or.push(
                { "type": element },
            );
        });

        const tagsList = await tag.aggregate(query);

        if (!tagsList) {
            return {
                success: false,
                message: 'Erroron the tags'
            }
        }

        return {
            success: true,
            data: tagsList
        }
    }

}