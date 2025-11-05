
const {User}= require('../../models');
const UTILS = require('../../utils/utils');


module.exports = async (req,res) => {
  try {
    // Since verifyAccessToken middleware already verified the token,
    // we can simply return a success response with user info

    const {email} = req.user;

    const user = await User.findOne({ where: { email } });

    const data = UTILS.normalizedUserAuthData(user);

    res.json({
      valid: true,
      user: data,
       
    });

  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Token verification error',
        details: error.message
      }
    });


  }
}

