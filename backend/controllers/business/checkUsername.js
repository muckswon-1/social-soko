const {Business} = require("../../models");
const UTILS = require("../../utils/utils");
const validateBusinessUsername = require("../../utils/validateBusinessUsername");


module.exports = UTILS.catchAsync(async ( req, res) => {

    const {username} = req.params;


    if(!username) throw UTILS.httpError(400, "Business username is required");


   const result = validateBusinessUsername(username);

   if(!result.valid){
     throw UTILS.httpError(400, result.reason)
   }


   // check if username already exists
   const existing = await Business.findOne({
    where: {username}
   });

   if(existing) {
    throw UTILS.httpError(400, "Username already taken")
   }

   return res.status(200).json({
    valid: true,
    username: result.username
   })
  
});