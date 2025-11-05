const {User} = require("../../models");
const UTILS = require("../../utils/utils");



module.exports = async (req,res) => {
  try {
    const {email} = req.user

    //search user by email
    const user = await User.findOne({ where: {email} });

    // check if there is no user
    if(!user) {
      return res.status(404).json({message: "User not found"})
    }
  
      const data = UTILS.normalizedUserAuthData(user);
    
    res.status(200).json({data});

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Token verification error',
        details: error.message
      }
    });
  }
}