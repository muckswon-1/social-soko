const db = require('../models');
const crypto = require('crypto');

const {User, VerificationToken} = db;


module.exports = async (token, token_type) =>  {
 

  if(!token || !token_type) {
    throw new Error('Token and token type are required')
  }

  // Find token record
  const tokenRecord = await VerificationToken.findOne({
    where: {token, token_type},
    include: [{model: User, as: 'user'}]
  });


  if(!tokenRecord) {
    throw new Error('Invalid or expired token.')
  }

  
  if(tokenRecord.expires_at < new Date()) {
    await tokenRecord.destroy();
    throw new Error('Token has expired.')
  }

 
  

  // //Timing safe compare
  const isValid = crypto.timingSafeEqual(Buffer.from(token), Buffer.from(tokenRecord.token));

  if(!isValid) {
    throw new Error('Invalid token')
  }


   const user = tokenRecord.user;
  

  const returnTokenRecord = tokenRecord
  // Delete token after use
  await tokenRecord.destroy();


  return {
    
    token:returnTokenRecord,
    user
  }
}