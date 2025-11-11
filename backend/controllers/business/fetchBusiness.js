const createError = require('http-errors');
const {Business} = require('../../models');
const UTILS = require('../../utils/utils');


module.exports  = UTILS.catchAsync(async (req, res) => {
    const { userId } = req.params;

    if(!userId) {
        throw createError(400,"Business ID is required");
    }

    const business = await Business.findOne({where: {user_id: userId}});

    return res.status(200).json({
    success: true,
    message: 'Business found',
    business,
  });


})