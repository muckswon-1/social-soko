"use strict";

/**
 * List businesses the authenticated user can post in (member/admin/owner).
 *
 * This is used by the PostForm business selector so users can only create posts
 * inside businesses they belong to.
 *
 * @typedef {import("../../types/models").Models} Models
 * @typedef {import("../../types/common").AuthedRequest} AuthedRequest
 * @typedef {import("express").Response} ExpressResponse
 */
const UTILS = require("../../utils/utils");

module.exports = UTILS.catchAsync(

   /**
   * GET /api/v1/business-membership/me/businesses
   *
   * Query params:
   * - page, limit (optional pagination)
   * - q (optional search by business name)
   *
   * Response:
   * - rows: [{ business, membershipRole, membershipStatus }]
   * - count, page, limit
   *
   * @param {AuthedRequest} req
   * @param {ExpressResponse} res
   */
  async (req, res) => {
    /**@type {Models} */
    const models = req.app.get("models");
    const {Business, BusinessMembership} = models;

    const userId = req.user?.id;
    if (!userId) throw UTILS.httpError(401, "Unauthorized");

    const { page, limit, offset } = UTILS.pagination(req.query.page, req.query.limit);
    const q = req.query?.q ? String(req.query.q).trim() : "";

    const {Op} = require('sequelize');

    const membershipWhere = {
      user_id: userId,
      status: "active",
      role: {[Op.in]: ["owner", "admin", "member"]}
    
    };

    const businessWhere = q ? {name: {[Op.iLike]: `%${q}%`}} : undefined;

    const result = await BusinessMembership.findAndCountAll({
      where: membershipWhere,
      include: [
        {
          model: Business,
          as: BusinessMembership.associations?.business ? "business" : undefined,
          required: true,
          where: businessWhere,
          attributes: ["id", "user_id", "username", "slug","name", "verification_status", "created_at", "updated_at"],


        }
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset
    });

     const rows = (result.rows || []).map((m) => ({
      business: m.business || null,
      membershipRole: m.role,
      membershipStatus: m.status,
    }));

    return res.status(200).json({
      success: true,
      message: "Businesses fetched",
      data: {
        rows,
        count: result.count,
        page,
        limit,
      },
    });


});
