// Get cookie from header
// This is used to get the cookie from the header of the request

// module.exports = (name, cookieheader="") => {
//     if(!cookieheader) return null;

//      const escapedName = name.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
//   const match = cookieHeader.match(
//     new RegExp(`(^|; )${escapedName}=([^;]*)`)
//   );

//   return match ? decodeURIComponent(match[2]) : null;
// }