const express = require('express');
const router = express.Router();
const   verifyToken  = require('../controllers/auth/verifyToken');
const { verifyAccessToken, authSlowDown, authRateLimiter } = require('../middleware/security');
const resetPasswordWithToken = require('../controllers/auth/resetPasswordWithToken');
const sendVerificationEmail = require('../controllers/auth/sendVerificationEmail');
const verifyEmail = require('../controllers/auth/verifyEmail');
const sendResetPasswordEmail = require('../controllers/auth/sendResetPasswordEmail');
const login = require('../controllers/auth/login');
const logout = require('../controllers/auth/logout');
const register = require('../controllers/auth/register');
const refreshExpiredAccessToken = require('../controllers/auth/refreshExpiredAccessToken');
const fetchUser = require('../controllers/auth/fetchUser');
const authedUserUpdatePassword = require('../controllers/auth/authedUserUpdatePassword');
const sendVerificationDigits = require('../controllers/auth/sendVerificationDigits');
const updateUserEmail = require('../controllers/auth/updateUserEmail');




router.post('/register', authSlowDown, authRateLimiter, register);
router.post('/login', login);
router.post('/refresh-token', refreshExpiredAccessToken);
router.get('/verify',verifyAccessToken, verifyToken);
router.post('/logout',logout);
router.post('/forgot-password', authSlowDown, authRateLimiter, sendResetPasswordEmail);
router.post('/reset-password/:token/:id', resetPasswordWithToken); 
router.post('/send-verification-digits-code',verifyAccessToken, authSlowDown,authRateLimiter, sendVerificationDigits);
router.post('/reset-password-with-digit-code',verifyAccessToken, authSlowDown,authRateLimiter,authedUserUpdatePassword);
router.post('/send-verification-email', authSlowDown, authRateLimiter, verifyAccessToken,sendVerificationEmail);
router.post('/email-update-with-digit-code', authSlowDown, authRateLimiter,updateUserEmail);
router.post('/verify-email/:token',verifyEmail);
router.get('/refresh-user', verifyAccessToken,fetchUser);

module.exports = router;