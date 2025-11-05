module.exports = async (req,res) => {

  try {

     // Since we're using JWT tokens, we can't invalidate them on the server side
    // The simplest approach is to return a success response
    // Frontend should clear tokens from localStorage/sessionStorage
    res.clearCookie('access_token', {path: '/'});
    res.clearCookie('refresh_token', {path: '/'});
    res.clearCookie('XSRF-TOKEN', {path: '/'});

   return  res.json({
      message: 'Logout successful',
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Logout error',
        details: error.message
      }
    });
  }
}