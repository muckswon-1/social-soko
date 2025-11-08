const express = require('express');
const router = express.Router();
const   verifyToken  = require('../controllers/auth/verifyToken');
const { verifyAccessToken, authSlowDown, authRateLimiter } = require('../middleware/security');

const sendVerificationEmail = require('../controllers/auth/sendVerificationEmail');
const verifyEmail = require('../controllers/auth/verifyEmail');
const login = require('../controllers/auth/login');
const logout = require('../controllers/auth/logout');
const register = require('../controllers/auth/register');
const refreshExpiredAccessToken = require('../controllers/auth/refreshExpiredAccessToken');
const fetchUser = require('../controllers/auth/fetchUser');
const sendVerificationDigits = require('../controllers/auth/sendVerificationDigits');
const updateUserEmail = require('../controllers/auth/updateUserEmail');
const sendResetPasswordLinkEmail = require('../controllers/auth/sendResetPasswordLinkEmail');
const resetPasswordWithTokenParameter = require('../controllers/auth/resetPasswordWithTokenParameter');
const updatePasswordWithDigitCode = require('../controllers/auth/updatePasswordWithDigitCode');




router.post('/register', authSlowDown, authRateLimiter, register);
router.post('/login', login);
router.post('/refresh-token', refreshExpiredAccessToken);
router.get('/verify',verifyAccessToken, verifyToken);
router.post('/logout',logout);
router.post('/forgot-password', authSlowDown, authRateLimiter, sendResetPasswordLinkEmail);
router.post('/reset-password/:token', resetPasswordWithTokenParameter); 
router.post('/send-verification-digits-code',verifyAccessToken, authSlowDown,authRateLimiter, sendVerificationDigits);
router.post('/reset-password-with-digit-code',verifyAccessToken, authSlowDown,authRateLimiter,updatePasswordWithDigitCode);
router.post('/send-verification-email', authSlowDown, authRateLimiter, verifyAccessToken,sendVerificationEmail);
router.post('/email-update-with-digit-code', authSlowDown, authRateLimiter,updateUserEmail);
router.post('/verify-email/:token',verifyEmail);
router.get('/refresh-user', verifyAccessToken,fetchUser);

module.exports = router;