"use strict";

/**
 * @typedef {import("../../types/common").AsyncAuthedRequestHandler} AsyncAuthedRequestHandler
 *  @typedef {import("../../types/models").Models} Models
 */

const { Op } = require("sequelize");
const UTILS = require("../../utils/utils");

/**
 * Search businesses that the current user may request to join.
 *
 * This route is intentionally "public-safe":
 * - It does NOT return private business fields like phone, email, full address,
 *   owner user_id, analytics, members, or internal verification data.
 * - It DOES return enough information for a user to confirm they found the right business.
 *
 * Expected route:
 * GET /business/public/search?query=prairie&page=1&limit=15
 *
 * Auth:
 * - Requires logged-in user.
 * - Does NOT require existing business membership.
 *
 * @type {AsyncAuthedRequestHandler}
 */
const searchBusinessesForJoin = async (req, res) => {
  const userId = req.user?.id;

  /** @type {Models} */
  const models = req.app.get("models");
  const { Business, BusinessMembership, BusinessMembershipRequest} = models

  if (!userId) {
    throw UTILS.httpError(401, "Unauthorized");
  }

  const query = String(
    req.query.query || req.query.q || req.query.search || "",
  ).trim();

  const { page, limit, offset } = UTILS.pagination(req.query.page, req.query.limit);

  if (!query || query.length < 2) {
    throw UTILS.httpError(400, "Search query must be at least 2 characters");
  }

  const { rows: businesses, count } = await Business.findAndCountAll({
    where: {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
        { username: { [Op.iLike]: `%${query}%` } },
        { slug: { [Op.iLike]: `%${query}%` } },
      ],
    },
    attributes: [
      "id",
      "name",
      "username",
      "slug",
      "logo_url",
      "verification_status",
      "city",
      "state",
      "country",
      "created_at",
    ],
    order: [
      ["verification_status", "ASC"],
      ["created_at", "DESC"],
    ],
    limit,
    offset,
  });

  const businessIds = businesses.map((business) => business.id);

  if (!businessIds.length) {
    return res.status(200).json({
      success: true,
      message: "No businesses found",
      data: {
        rows: [],
        count: 0,
        page,
        limit,
      },
    });
  }

  const [memberships, pendingRequests] = await Promise.all([
    BusinessMembership.findAll({
      where: {
        user_id: userId,
        business_id: {
          [Op.in]: businessIds,
        },
      },
      attributes: ["business_id", "role", "status"],
    }),

    BusinessMembershipRequest.findAll({
      where: {
        user_id: userId,
        business_id: {
          [Op.in]: businessIds,
        },
        status: "pending",
      },
      attributes: ["business_id", "status", "created_at"],
    }),
  ]);

  const membershipByBusinessId = new Map(
    memberships.map((membership) => [membership.business_id, membership]),
  );

  const pendingRequestByBusinessId = new Map(
    pendingRequests.map((request) => [request.business_id, request]),
  );

  const rows = businesses.map((business) => {
    const membership = membershipByBusinessId.get(business.id);
    const pendingRequest = pendingRequestByBusinessId.get(business.id);

    const relationship = membership
      ? {
          type: "member",
          role: membership.role,
          status: membership.status,
        }
      : pendingRequest
        ? {
            type: "pending_request",
            status: pendingRequest.status,
            requested_at: pendingRequest.created_at,
          }
        : {
            type: "none",
            role: null,
            status: null,
          };

    return {
      business: {
        id: business.id,
        name: business.name,
        username: business.username,
        slug: business.slug,
        logo_url: business.logo_url,
        verification_status: business.verification_status,
        city: business.city,
        state: business.state,
        country: business.country,
      },
      relationship,
      canRequestMembership: !membership && !pendingRequest,
    };
  });

  return res.status(200).json({
    success: true,
    message: "Businesses fetched",
    data: {
      rows,
      count,
      page,
      limit,
    },
  });
};

module.exports = UTILS.catchAsync(searchBusinessesForJoin);