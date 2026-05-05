/**
 * @typedef {import("../../types/models").Models} Models
 * @typedef {import("../../types/common").AuthedRequest} AuthedRequest
 * @typedef {import("express").Response} ExpressResponse
 */

const { sequelize } = require("../../models");
const { getBusinessMemberShip } = require("../../utils/permissions/businessPermissions");
const { canApproveMembershipRequest } = require("../../utils/permissions/canApproveMembershipRequest");
const UTILS = require("../../utils/utils");

module.exports = UTILS.catchAsync(
     /**
   * Approve a membership request for a business.
   *
   * Route idea:
   * POST /businesses/:businessId/membership-requests/:requestId/approve
   *
   * @param {AuthedRequest} req
   * @param {ExpressResponse} res
   */
   async (req, res) => {
        /**@type {Models} */
        const models = req.app.get("models");
        const {Business, BusinessMembership, BusinessMembershipRequest} = models;

        const approverId = req.user?.id;
        const {businessId, requestId} = req.params;
    

        if(!approverId) throw UTILS.httpError(401, "Unauthorized");
        if(!businessId) throw UTILS.httpError(400, "Business ID is required");
        if(!requestId) throw UTILS.httpError(400,"Request ID is required");

        const business = await Business.findByPk(businessId);
        if(!business) throw UTILS.httpError(404, "Business not found");

        const approverMembership = await getBusinessMemberShip(models, {businessId, userId: approverId});

        console.log("approverMembership", approverMembership);

        if(!canApproveMembershipRequest({userId: approverId, membership: approverMembership})){
            throw UTILS.httpError(403, "You do not have permission to approve membership requests")
        }

        const request = await BusinessMembershipRequest.findOne({where: {id: requestId, business_id: businessId}});
        if(!request) throw UTILS.httpError(404, "Membership request not found");

        if(request.status !== "pending") throw UTILS.httpError(409,`Request is already  ${request.status}`);

        //user who requested to join
        const requesterId = request.user_id;

        const t = sequelize ? await sequelize.transaction() : null;

        try {
            const existing = await BusinessMembership.findOne({where: {business_id: businessId, user_id: requesterId}, transaction: t || undefined});

            if(!existing) {
                await BusinessMembership.create({
                    business_id: businessId,
                    user_id: requesterId,
                    role: "member",
                    status: "active"
                }, 
                {transaction: t || undefined}
            )
            }else if (existing.status !== "active") {
                await existing.update({status: "active"}, {transaction: t || undefined});
            }

            const patch = {status: "approved"};

            //update request status
            const attributes = BusinessMembershipRequest?.getAttributes();
            if(attributes.reviewed_by_user_id) patch.reviewed_by_user_id = approverId;
            if(attributes.reviewed_at) patch.reviewed_at = new Date();
            patch.updated_at = new Date();

            await request.update(patch, {transaction: t || undefined});

            if(t) await t.commit();

            return res.status(200).json({success:true, message: "Membership request approved", request});

        }catch(error){
            if(t) await t.rollback();
            throw error
        }
    }
)