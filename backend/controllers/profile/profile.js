// After account registration a user can now update thier information like names, phone number etc. 

const {User} = require("../../models");
const UTILS = require("../../utils/utils");

const updateUser = async (req,res) => {

    try {

        const {userId} = req.params;
       
      const user = await User.findByPk(userId);


        if(!user) {

            return res.status(404).json({message: "User not found"});

        }
        
         const {first_name, last_name, phone} = req.body.patch;
       

        //update user information then return the new user
     await user.update({
        ...(first_name !== undefined && {first_name}),
        ...(last_name !== undefined && {last_name}),
        ...(phone !== undefined && {phone})
    });

    const normalized = UTILS.normalizedUserProfileData(user)
    
        res.status(200).json({
            message: "User information updated successfully",
            updatedUser: normalized
        });

    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Error updating user information',
                details: error.message

            }

        });

    }

}


// Fetch Profile Information
const fetchProfile = async (req,res) => {
   try {
    const {userId} = req.params;

    console.log(userId);

    const user = await User.findOne({where: {id: userId}});

    if(!user) {
        return res.status(400).json({message: "User was not found"})
    }


    const normalizedProfile = UTILS.normalizedUserProfileData(user);

    res.status(200).json(normalizedProfile);


   } catch (error) {
    // An error happended while fetching user profile info
    console.error("Error fetching user profile info: ",error);
     res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Token verification error',
        details: error.message
      }
    });


   }
}

module.exports = {
    updateUser,
    fetchProfile

}
