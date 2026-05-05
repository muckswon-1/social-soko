/**
 *  @typedef {import('sequelize').Model} SequelizeMOdel
 * @typedef {import("./common").UUID} UUID
 */

/**
 * @typedef {SequelizeMOdel & {
 * id: UUID,
 * business_id: UUID,
 * role: "member" | "admin" | "owner",
 * status: "active" | "banned"
 * }} BusinessMembershipModel
 */

/**
 * @typedef {Object} BusinessRoleBuckets
 * @property {UUID[]} memberBusinessIds
 * @property {UUID[]} adminBusinessIds
 * @property {UUID[]} ownerBusinessIds
 */

export {}
