const createError = require("http-errors");
const {Business} = require("../../models");
const UTILS = require("../../utils/utils");

module.exports = UTILS.catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw createError(400, "User ID is required");
  }

  const { businessData } = req.body || {};

  const {name, description, address, city, state, country, postal_code, phone, email, website, slug, logo_url} = businessData

  //Enusre atleast one filed to updaate
  const hasUpdates  = name !== undefined || description !== undefined || address !== undefined || city !== undefined || state !== undefined || country !== undefined || postal_code !== undefined || phone !== undefined || email !== undefined || website !== undefined || slug !== undefined || logo_url !== undefined;

  if(!hasUpdates) {
    throw createError(400, "No fields to update");
  }

  if (!businessData || !businessData.name) {
    throw createError(400, "Missing businessData payload or name");
  }
  // Find business by live pk
  const business = await Business.findByPk(id);

  if(!business) {
    throw createError(404, "Business not found");
  }

  // update fields found in businessData
  await business.update({
   ...(name !== undefined && {name}),
   ...(description !== undefined && {description}),
   ...(address !== undefined && {address}),
   ...(city !== undefined && {city}),
   ...(state !== undefined && {state}),
   ...(country !== undefined && {country}),
   ...(postal_code !== undefined && {postal_code}),
   ...(phone !== undefined && {phone}),
   ...(email !== undefined && {email}),
   ...(website !== undefined && {website}),
   ...(slug !== undefined && {slug}),
   ...(logo_url !== undefined && {logo_url}),

  });

  // return updated business
  return res.status(200).json({
    success: true,
    message: "Business updated successfully",
    business,
  });

})
