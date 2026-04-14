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
   * List memberships for a business (admin/owner only).
   *
   * GET /business-membership/:businessId/memberships
   *
   * Query params:
   * - status: active|inactive|... (optional)
   * - role: owner|admin|member (optional)
   * - q: search by user name/email (optional)
   * - limit, offset
   *
   * @param {AuthedRequest} req
   * @param {ExpressResponse} res
   */
  async (req, res) => {
    /**@type {Models} */
    const models = req.app.get("models");
    const {User, Business, BusinessMembership} = models;

    const userId = req.user?.id;
    const {businessId} = req.params;

    if(!userId) throw UTILS.httpError(401, "Unauthorized");
    if(!businessId) throw UTILS.httpError(400, "Business ID is required");

    const business = await Business.findByPk(businessId, {attributes: ["id"]});
    if(!business) throw UTILS.httpError(404, "Business not found");

    const adminMembership = await getBusinessMemberShip(models, {businessId, userId});


    if(!canApproveMembershipRequest({userId, membership: adminMembership})) throw UTILS.httpError(403, "You are not allowed to view memberships");

    const { page, limit, offset } = UTILS.pagination(req.query.page, req.query.limit);

    const status = req.query?.status ? String(req.query.status) : null;
    const role = req.query?.role ? String(req.query.role): null;
    const q = req.query?.q ? String(req.query.q).trim() : "";

    const where = {business_id: businessId};
    if(status) where.status = status;
    if(role) where.role = role;

    const include = [];

    if(User) {
        const Op = require('sequelize').Op;

        const userWhere = q ? {
            [Op.or]: [
              { email: { [Op.iLike]: `%${q}%` } },
              { first_name: { [Op.iLike]: `%${q}%` } },
              { last_name: { [Op.iLike]: `%${q}%` } },
              { firstName: { [Op.iLike]: `%${q}%` } },
              { lastName: { [Op.iLike]: `%${q}%` } },
            ]
        }: undefined;

        include.push({
            model: User,
            as: BusinessMembership.associations?.user ? "user" : undefined,
            required: !!q,
            where: userWhere,
            attributes: ["id", "email", "first_name", "last_name"]
        });
    }

    const result = await BusinessMembership.findAndCountAll({
        where,
        include: include.length ? include : undefined,
        order: [["created_at", "DESC"]],
        limit,
        offset
    });

    return res.status(200).json({success: true, data: {rows: result.rows, count: result.count, page, limit}})


  }
)