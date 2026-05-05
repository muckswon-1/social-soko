
const UTILS = require("../../utils/utils");
const validatePhone = require("../../utils/validatePhone");

module.exports = UTILS.catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  /**@type {Models} */
  const models = req.app.get("models");
  const {Business, BusinessMembership} = models;
  

  if (!id ) {
    throw UTILS.httpError(400, "Business ID is required");
  }

  if(!userId) {
    throw UTILS.httpError(401, "Unauthorized");
  }


  const { businessData = {} } = req.body || {};


  console.log("businessData", businessData);

  
  const {
    name,
    description,
    address,
    city,
    state,
    country,
    postal_code,
    email,
    website,
    slug,
    countryIso2,
    localPhone
  } = businessData;


  const business = await Business.findByPk(id);

  if (!business) {
    throw UTILS.httpError(404, "Business not found");
  }

  const membership = await BusinessMembership.findOne({
    where: {
      user_id: userId,
      business_id: id,
      status: "active"
    }
  });

  if(!membership) {
    throw UTILS.httpError(403, "You are not a member of this business")
  }


const canUpdateBusiness = membership.role === "owner" || membership.role === "admin";

if(!canUpdateBusiness) {
  throw UTILS.httpError(403,"You do not have permission to update this business");
}



  const shouldUpdatePhone = countryIso2 !== undefined || localPhone !== undefined;

  console.log("Should update phone: ", shouldUpdatePhone)

  //Enusre atleast one filed to updaate
  const hasUpdates =
    name !== undefined ||
    description !== undefined ||
    address !== undefined ||
    city !== undefined ||
    state !== undefined ||
    country !== undefined ||
    postal_code !== undefined ||
    email !== undefined ||
    website !== undefined ||
    shouldUpdatePhone ||
    slug !== undefined;

  if (!hasUpdates) {
    return res.status(200).json({
      success: true,
      message: "No business fields were provided to update",
      business: null,
    })
  }
  


 let normalizedPhone = null;



 if(shouldUpdatePhone) {
  if(!countryIso2 || !localPhone){
    throw UTILS.httpError(400, "countryIso2 and localPhone are required to update phone")
  }
   normalizedPhone = validatePhone({countryIso2, localPhone});

   if(!normalizedPhone.e164) {
    throw UTILS.httpError(400, "Invalid phone number")
   }
 }

 
 
  
  // update fields found in businessData
  const updatePayload = {
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
    ...(address !== undefined && { address }),
    ...(city !== undefined && { city }),
    ...(state !== undefined && { state }),
    ...(country !== undefined && { country }),
    ...(postal_code !== undefined && { postal_code }),
    ...(normalizedPhone?.e164 !== undefined && { phone: normalizedPhone.e164 }),
    ...(email !== undefined && { email }),
    ...(website !== undefined && { website }),
    ...(slug !== undefined && { slug }),
  };


  await business.update(updatePayload);
    

  // return updated business
  return res.status(200).json({
    success: true,
    message: "Business updated successfully",
    business,
    membershipRole: membership.role,
    membershipStatus: membership.status,
    permissions: {
      canManage: true,
      canEdit: true,
      canManageMembers: membership.role === "owner" || membership.role === "admin",
      canViewPrivateDetails: true
    }
  });
});
