"use strict";

const UTILS = require("../utils");
const { canViewPost } = require("./postPermissions");

/**@typedef {import("../../types/common").UUID} UUID */
/**@typedef {import("../../types/models").Models} ModelsType */
/**@typedef {import("../../types/models").BusinessMembershipModel} BusinessMembershipModel */


/**
 * Fetch minimal post fields and enforce visibility for any “read” operation
 * (post details, comments, replies, etc).
 *
 * @param {ModelsType} models
 * @param {Object} params
 * @param {UUID} params.postId
 * @param {UUID | null} params.userId
 * @returns {Promise<{ post: any, membership: any|null }>}
 */

module.exports = async function assertCanViewPost(models,{postId, userId}){
    const {Post, BusinessMembership} = models;

    const post = await Post.findByPk(postId, {
        attributes: ["id", "business_id", "visibility", "post_type"],
        raw: true
    });

    if(!post) UTILS.httpError(404, "Post not found");

    /**@type {BusinessMembershipModel | null} */
    let membership = null;
    if(userId) {
        membership = await BusinessMembership.findOne({
            where: {
                business_id: post.business_id,
                user_id: userId,
                status: "active"
            },
            attributes: ["id", "business_id", "user_id", "role", "status"]
        });
    };

    const ok = canViewPost({post, userId, membership});

    if(!ok) throw UTILS.httpError(403, "You do not have access to this post");

    return {post, membership}


}