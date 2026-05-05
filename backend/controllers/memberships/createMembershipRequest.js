"use strict";

const { getBusinessMemberShip } = require("../../utils/permissions/businessPermissions");
const { canCreateMembership } = require("../../utils/permissions/membershipPermissions");
const UTILS = require("../../utils/utils");

/**
 * @typedef {import("../../types/common").UUID} UUID
 * @typedef {import("../../types/models").Models} Models
 * @typedef {import("../../types/models").BusinessMembershipModel} BusinessMembershipModel
 * @typedef {import("../../types/models").BusinessMembershipRequestModel} BusinessMembershipRequestModel
 * @typedef {import("../../types/common").AuthedRequest} AuthedRequest
 * @typedef {import("express").Response} ExpressResponse
 */

module.exports = UTILS.catchAsync(
    /**
     * Create a membership request for a business.
     *
     * @param {AuthedRequest} req
     * @param {ExpressResponse} res
     */
    async(req, res) => {
        /**@type {Models} */
        const models = req.app.get("models");

        const {
            Business,
            BusinessMembershipRequest
        } = models;

        const userId = req.user?.id;
        const {businessId} = req.params;
        const {message} = req.body || {}

        if(!userId) throw UTILS.httpError(401, "Unauthorized");

        if(!businessId) throw UTILS.httpError(400, "Business ID is required");

        const business = await Business.findByPk(businessId, {attributes: ["id"]});

        if(!business) throw UTILS.httpError(404, "Business not found");

        const existingMembership = await getBusinessMemberShip(models, {businessId, userId});

        if(!canCreateMembership({userId, membership: existingMembership})) throw UTILS.httpError(403, "You are not allowed to create a membership request");

        const existingRequest = await BusinessMembershipRequest.findOne({
            where: {
                business_id: businessId,
                user_id: userId,
                status: "pending"
            }
        });

        if(existingRequest) throw UTILS.httpError(409, "You have already requested to join this business");

        const request = await BusinessMembershipRequest.create({
            business_id: businessId,
            user_id: userId,
            status: "pending",
            message: message || null
        });

        return res.status(201).json({
            success: true,
            message: "Membership request submitted",
            request
        })




    }
)