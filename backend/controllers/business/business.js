// controllers/business/createBusiness.js
const createError = require('http-errors');
const { User, Business } = require('../../models');
const { sendTemplatedEmail } = require('../../services/email/emailService');
const UTILS = require('../../utils/utils');


const createBusiness = UTILS.catchAsync(async (req, res) => {
  const { userId } = req.params;
  if (!userId) throw createError(400, 'User ID is required');


  const { newBusiness } = req.body || {};
  if (!newBusiness || !newBusiness.name) {
    throw createError(400, 'Missing newBusiness payload or name');
  }

  // Check user exists
  const existingUser = await User.findOne({ where: { id: userId } });
  if (!existingUser) throw createError(404, 'User not found');

  // Create business
  const business = await Business.create({
    user_id: userId,
    name: newBusiness.name,
    description: newBusiness.description || '',
    address: newBusiness.address || '',
    city: newBusiness.city || '',
    state: newBusiness.state || '',
    country: newBusiness.country || '',
    postal_code: newBusiness.postal_code || '',
    phone: newBusiness.phone || '',
    email: newBusiness.email || '',
    website: newBusiness.website || '',
    slug: newBusiness.slug || '',
    logo_url: newBusiness.logo_url || '',
  });

  // Send email (await so failures hit the error middleware)
  await sendTemplatedEmail({
    to: existingUser.email,
    template: 'businessCreated',
    props: { email: existingUser.email },
  }).catch((err) => {
    console.error('Failed to send email:', err)
    // Don't throw here, just log the error
    // This is a non-critical failure
    // The business was created, but the email failed to send
    // You may want to log this to a monitoring service
    // or add it to a retry queue
 });

  return res.status(201).json({
    success: true,
    message: 'Business created successfully',
    business,
  });
});

module.exports = createBusiness;
