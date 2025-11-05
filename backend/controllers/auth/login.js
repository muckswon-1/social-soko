const {User} = require("../../models");
const UTILS = require("../../utils/utils");
const { accessTokenCookieOptions, refreshTokenCookieOptions, CSRFTokenCookieOptions } = require("./tokens.cookies");
const bcrypt = require('bcrypt');

require('dotenv');

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { email } });


    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    
    // Generate access and Refresh Tokens

    const accessToken = UTILS.generateAccessToken(user);

    const refreshToken = UTILS.generateRefreshToken(user);

    const userData = UTILS.normalizedUserAuthData(user);

    const csrfToken = UTILS.generateCSRFToken();

    // Set cookies
    res.cookie('access_token', accessToken, accessTokenCookieOptions);
    res.cookie('refresh_token',refreshToken,refreshTokenCookieOptions);
    res.cookie('XSRF-TOKEN', csrfToken,CSRFTokenCookieOptions);
    
    res.json({
      message: 'Login successful',
      user: userData,
    });
  } catch (error) {
     console.log(error);

    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};
