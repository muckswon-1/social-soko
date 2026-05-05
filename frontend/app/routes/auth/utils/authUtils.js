import passwordValidator from 'password-validator';
import commonPasswords from "../../../utils/10k-most-common.json";
import emailValidator from 'email-validator'
/**
 * @typedef {import("../../../types/authForm").LoginFormCredentials} LoginForm
 * @typedef {import("../../../types/authForm").RegisterForm} RegisterForm
 * @typedef {import("../../../types/formError").FormError} FormError
 * @typedef {import("../../../types/authForm").UpdateEmailForm} UpdateEmailForm */
 
 /** @typedef {import("../../../types/authForm").ResetPasswordForm} ResetPasswordForm */


/**
 * Validate login / register form values (frontend-only validation)
 *
 * @param {LoginForm | RegisterForm |  ResetPasswordForm | UpdateEmailForm } values
 * @param {"login_form" | "register_form" | "reset_password_form" | "update_password_form"|"update_email_form"} type
 * @returns {FormError}
 */
export function validateAuthForm(values, type = "login_form") {
  /** @type {FormError} */
  const errors = {};

  console.log(values);


  const email = (values.email || "").trim();
  const password = values.password || "";
  const confirmPassword = values.confirmPassword || ""
  const confirmEmail = values.confirmEmail

  
    //
  // -----------------------------------
  // EMAIL VALIDATION (shared)
  // -----------------------------------
  //
  if(type === "login_form" || type ==="register_form" || type ==="update_password_form" || type === "update_email_form"){
    if (!email) {
    errors.email = "Email is required.";
  } else if (!emailValidator.validate(email)) {
    errors.email = "Enter a valid email address.";
  }
  }

  //
  // -----------------------------------
  // PASSWORD VALIDATION (shared)
  // -----------------------------------
  //
  if (!password) {
    errors.password = "Password is required.";
  } else {
    const schema = new passwordValidator();
    schema
      .is().min(8)
      .is().max(100)
      .has().uppercase()
      .has().lowercase()
      .has().not().spaces()
      .is().not().oneOf(commonPasswords.unsafe_passwords);

    /** @type {Array<{validation: string, message: string}>|boolean} */
    const validationResults = schema.validate(password, { details: true });

    if (Array.isArray(validationResults) && validationResults.length > 0) {
      const messages = validationResults.map((v) => {
        if (v.validation === "oneOf") {
          return "This password is too common. Please choose a more secure password.";
        }
        return v.message;
      });

      errors.password = messages.join(" | ");
    }
  }


       //
  // -----------------------------------
  // PASSWORD RESET (shared)
  // -----------------------------------
 
  if (type === "reset_password_form" | type==="update_password_form") {
  
    // Confirm Password required

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    }
  


    // Must match password (only if no main password error)
    if (confirmPassword && !errors.password && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
      }

    }

   

  //
  // -----------------------------------
  // REGISTER-ONLY VALIDATION
  // -----------------------------------
  //
  if (type === "register_form") {
    

    // Confirm Password required
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    }

    // Must match password (only if no main password error)
    if (!errors.password && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }


   //
  // -----------------------------------
  // UPDATE EMAIL ONLY VALIDATION
  // -----------------------------------
  //
  if (type === "update_email_form") {

    

    if(!confirmEmail) {
      errors.confirmEmail = "Please confirm your email.";
    }



    if(confirmEmail && confirmEmail !== email){
      errors.confirmEmail = "Emails do not match"
    }
  }

 

  return errors;
}

/**
 * Utility: check if a FormError object has any errors
 *
 * @param {FormError} errors
 * @returns {boolean}
 */
export function hasErrors(errors) {
  return Object.values(errors).some((error) => !!error);
}


/**
 * Turn a field error string into an array of messages for list rendering.
 * We assume multiple messages are separated by " | " (from validateAuthForm).
 *
 * @param {string | undefined} error
 * @returns {string[]}
 */
export function toErrorList(error) {
  if (!error) return [];
  if (error.includes(" | ")) {
    return error
      .split(" | ")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [error];
}

