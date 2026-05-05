"use strict";

const { requireBusinessRole } = require("../utils/permissions/businessPermissions");
const UTILS = require("../utils/utils");

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("express").NextFunction} NextFunction
 * @typedef {import("../types/models").Models}ModelsType
 *
 * @typedef {import("../../types/common").UUID} UUID
 *
 * @typedef {Object} RequireBusinessRoleOptions
 * @property {string} [businessIdParam="businessId"] - Route param name containing businessId
 * @property {boolean} [allowOwnerOverride=true] - Reserved for future use
 */

/**
 * Middleware factory that enforces business membership and role permissions.
 *
 * This middleware:
 * - requires an authenticated user (`req.user`)
 * - verifies active membership in the target business
 * - enforces a minimum business role (`member` | `admin` | `owner`)
 *
 * On success:
 * - attaches the BusinessMembership instance to `req.businessMembership`
 *
 * On failure:
 * - throws a structured HTTP error (401 / 403 / 400)
 *
 * @param {"member" | "admin" | "owner"} [minRole="member"] - Minimum required business role
 * @param {RequireBusinessRoleOptions} [opts]
 *
 * @returns {(req: Request, res: Response, next: NextFunction) => Promise<void>}
 *
 * @example
 * router.post(
 *   "/businesses/:businessId/posts",
 *   requireBusinessRoleMW("member"),
 *   createPostHandler
 * );
 */
function requireBusinessRoleMW(minRole = "member", opts = {}) {
  const { businessIdParam = "businessId", allowOwnerOverride = true } = opts;

  return async function requireBusinessRoleHandler(req, res, next) {
    try {
      /**@type {ModelsType} */
      const models = req.app.get("models");

      
      const userId = req.user?.id;

      const businessId = req.body?.[businessIdParam]
     

      if (!userId) {
        throw UTILS.httpError(401, "Unauthorized");
      }

      if (!businessId) {
        throw UTILS.httpError(400, "Missing businessId");
      }

      const result = await requireBusinessRole(models, {
        businessId,
        userId,
        minRole,
      });

      if (!result.ok) {
        throw UTILS.httpError(
          403,
          result.reason === "not_member"
            ? "Not a member of this business"
            : "You dont have permission to perform this action"
        );
      }

      // Expose membership to downstream handlers
      req.businessMembership = result.membership;

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = requireBusinessRoleMW;
