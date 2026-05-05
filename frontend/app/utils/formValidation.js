
export const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
export const urlRe = /^(https?:\/\/)?([a-z0-9\-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i;
export const passwordRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


  export  const validateRegisterForm = (formData) => {
     const { email, password, confirmPassword } = formData;
   
     const next = {};
 
     if(!email){
       next.email = "Email is required"
     }else if (!emailRe.test(email)){
       next.email = "Enter a valid email"
     }
 
     if(!password) {
       next.password = "Password is required"
     }else if(password.length < 8){
       next.password = "Password must be at least 8 characters"
     }
     else if(!passwordRe.test(password)){
       next.password  = "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
     }
 
 
     if(!confirmPassword) {
       next.confirmPassword = "Confirm Password is required"
     }else if(confirmPassword !== password){
       next.confirmPassword = "Passwords do not match"
     }
 
     console.log('Inside validate form: ',next)
 
     return next;
   };
 