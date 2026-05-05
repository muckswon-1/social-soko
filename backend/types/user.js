/**
 * Backend User Shape (snake_case fields)
 *
 * This matches the Sequelize/Postgres structure.
 *
 * Frontend camelCase ← transformed from this shape.
 */

 /**
  * @typedef {import("./common").UUID} UUID
  * @typedef {import("./common").StringType} StringType
  * @typedef {import("./common").NullableString} NullableString
  * @typedef {import("./common").Timestamp} Timestamp
  *  @typedef {import("./common").NullableBoolean} NullableBoolean
  */

 /**
  * @typedef {Object} User
  *
  * @property {UUID} id
  *
  * @property {StringType} email
  * @property {"admin" | "business" | "customer"} role
  *
  * @property {boolean} email_verified
  * @property {Timestamp | null} email_verified_at
  *
  * @property {NullableString} first_name
  * @property {NullableString} last_name
  *
  * @property {NullableString} phone_number
  * @property {boolean | null} phone_verified
  * @property {Timestamp | null} phone_verified_at
  *
  * @property {NullableString} title
  * @property {NullableString} bio
  * @property {NullableString} avatar_url
  * @property {NullableString} skills
  *
  * @property {NullableBoolean} account_verified
  *
  * @property {Timestamp | null} last_login_at
  * @property {Timestamp} created_at
  * @property {Timestamp} updated_at
  */

export {};
