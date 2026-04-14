/**
 * @typedef {import("../../types/models").Models} Models
 * @typedef {import("../../types/common").AuthedRequest} AuthedRequest
 * @typedef {import("express").Response} ExpressResponse
 */

const { getBusinessMemberShip } = require("../../utils/permissions/businessPermissions");
const { canApproveMembershipRequest } = require("../../utils/permissions/canApproveMembershipRequest");
const UTILS = require("../../utils/utils");

module.exports = UTILS.catchAsync(
    /**
   * Reject a membership request for a business.
   *
   * Route idea:
   * POST /business-membership/:businessId/requests/:requestId/reject
   *
   * @param {AuthedRequest} req
   * @param {ExpressResponse} res
   */
  async (req, res) => {
    /**@type {Models} */
    const models = req.app.get("models");

    const {Business, BusinessMembershipRequest} = models;

    const approverId = req.user.id;
    const {businessId, requestId} = req.params;

    const {reason, message} = req.body || {};
    const rejectionMessage = reason ?? message ?? null;

    if(!approverId) throw UTILS.httpError(401, "Unauthorized");
    if(!businessId) throw UTILS.httpError(400, "Business ID is required");
    if(!requestId) throw UTILS.httpError(400, "Request ID is required");

    const business = await Business.findByPk(businessId);
    if(!business) throw UTILS.httpError(404, "Business not found");

    const reviewerMembership = await getBusinessMemberShip(models, {businessId, userId: approverId});

    if(!canApproveMembershipRequest({userId: approverId, membership: reviewerMembership})){
        throw UTILS.httpError(403, "You are not authorized to reject membership requests for this business")
    }

  
    const request = await BusinessMembershipRequest.findOne({where: {id: requestId, business_id: businessId}});

    if(!request) throw UTILS.httpError(404, "Membership request not found");

    if(request.status !== "pending") throw UTILS.httpError(409, `Request is already ${request.status}`);

    const patch = {status: "rejected"};


     const attributes = BusinessMembershipRequest?.getAttributes();
     if(attributes.reviewed_by_user_id) patch.reviewed_by_user_id = approverId;
     if(attributes.reviewed_at) patch.reviewed_at = new Date();
     if(attributes.rejected_message) patch.rejected_message = rejectionMessage;
     patch.updated_at = new Date();

     await request.update(patch)

     return res.status(200).json({success: true, message: "Membership request rejected successfully"}, request);






  }

)