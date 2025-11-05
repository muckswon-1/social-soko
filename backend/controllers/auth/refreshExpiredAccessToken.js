const UTILS = require('../../utils/utils');
const jwt = require('jsonwebtoken');
const { accessTokenCookieOptions, refreshTokenCookieOptions, CSRFTokenCookieOptions } = require('./tokens.cookies');

require('dotenv').config();


module.exports = async (req,res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

 

    if(!refreshToken) {
      return res.status(401).json({message: 'Refresh token is required'});
    }


    //verify refresh token

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

   // TODO:  Look into: 'Verify token against DB/jti/blacklist here.'


    //Generate new access token
    const newAccessToken = UTILS.generateAccessToken(UTILS.normalizedUserAuthData(decoded));
    const newRefreshToken = UTILS.generateRefreshToken(UTILS.normalizedUserAuthData(decoded));
    const newCSRFToken = UTILS.generateCSRFToken(decoded);

     res.cookie('access_token', newAccessToken, accessTokenCookieOptions);
     res.cookie('refresh_token', newRefreshToken, refreshTokenCookieOptions);
     res.cookie('XSRF-TOKEN', newCSRFToken, CSRFTokenCookieOptions);

    res.json({
      message: 'Token refreshed successfully',
      
    })
  } catch (error) {
    console.log('Error during refresh token',error);
    res.status(403).json({ message: 'Invalid or expired refresh token', error: error.message });
  }
}