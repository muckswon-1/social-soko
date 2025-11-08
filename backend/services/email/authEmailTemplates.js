const { Comp, escapeHtml } = require('./utils');
const wrapLayout = require('./wrapLayout');

require('dotenv');

   
   const FRONTEND_URL = process.env.FRONTEND_URL;
   const BRAND_NAME = process.env.BRAND_NAME;
   
   //Password reset
   const  sendPasswordResetLinkEmail =  ({email, token, expiresInMinutes=60}) => {
        const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

        console.log(resetUrl);

        return {
            subject: 'Password Reset Request',
            html: wrapLayout({
                title: 'Reset Your Password',
                bodyHtml: [
                    Comp.p(`Hello ${escapeHtml(email)},`),
                    Comp.p(`We received a request to reset your password. Click the link below to reset it. This link will expire in <strong>${expiresInMinutes} minutes</strong>.`),
                    Comp.p(Comp.link(resetUrl, "Reset Password")),
                ].join(""),
                brandName: BRAND_NAME
            })
        }
    }


    // Password reset Successful
    const sendPasswordResetSuccessEmail =  ({email, loginUrl=`${FRONTEND_URL}/login`}) => {

       return { subject: `Password Reset Successful`,
        html: wrapLayout({
            title: 'Password Reset Successful',
            bodyHtml:[
                Comp.p(`Hello ${escapeHtml(email)},`),
                Comp.p(`Your password has been successfully reset. You can now log in with your new password. `),
                Comp.p(Comp.link(loginUrl,"Click here to login"))
            ].join(""),
            brandName: BRAND_NAME
        }),
    }
    }


       // Send 6 digit code email
    const sendSixDigitCodeEmail = ({email,code, expiresInMinutes}) => {
      return {
        subject: `Verification Code`,
        html: wrapLayout({
          title: 'Verification Code',
          bodyHtml: [
             Comp.p(`Hello ${escapeHtml(email)},`),

                    Comp.p(`Your verification digit code is: <strong>${code}</strong> The code will expire in <strong>${expiresInMinutes} minutes</strong>.`),
          ].join(""),
          brandName: BRAND_NAME
        })
      }
    }


      //Verify Email
    const sendVerifyEmail =  ({email, token, expiresInMinutes=60}) => {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

        return {

            subject: `Verify Your Email Address`,

            html: wrapLayout({
                title: 'Verify Your Email Address',
                bodyHtml: [

                    Comp.p(`Hello ${escapeHtml(email)},`),

                    Comp.p(`Please click the button below to verify your email address. This link will expire in <strong>${expiresInMinutes} minutes</strong>.`),

                    `<p style="margin:24px 0">${Comp.btn(verifyUrl, "Verify email")}</p>`,
                    Comp.p(`If the button doesn't work, copy and paste this URL into your browser:`),
          Comp.p(Comp.link(verifyUrl, verifyUrl)),
          `<p style="color:#666">If you didn't request this, you can safely ignore this email.</p>`,
                ].join(""),
                brandName: BRAND_NAME
            
        })
    }
    }


      // email successfully verifed
    const sendEmailVerificationSuccessful = ({email}) => {
       return {

            subject: `Email Verification Successful`,

            html: wrapLayout({

                title: 'Email Verification Successful',

                bodyHtml: [

                    Comp.p(`Hello ${escapeHtml(email)},`),

                    Comp.p(`Your email address has been successfully verified.`),

                    Comp.p(`You can now log in to your account.`),

                    Comp.p(`If you have any questions, feel free to reply to this email.`),
                    Comp.p(`Best regards,`),
                    Comp.p(`The ${BRAND_NAME} Team`),
                    Comp.p(Comp.link(`${FRONTEND_URL}/login`, "Log in")),
                ].join(""),
                brandName: BRAND_NAME
              })
            }
    }



        //send email updated
       const  sendEmailUpdated =  ({email}) => {
    
            return {
               subject: `Your Email Address Has Been Updated`,
    
                html: wrapLayout({
    
                    title: 'Email Address Updated',
    
                    bodyHtml: [
    
                        Comp.p(`Hello ${escapeHtml(email)},`),
    
                        Comp.p(`Your email address has been successfully updated.`),
    
                        Comp.p(`If you did not make this change, please contact us immediately.`),
    
                        Comp.p(`If you have any questions, feel free to reply to this email.`),
                        Comp.p(`Best regards,`),
                        Comp.p(`The ${BRAND_NAME} Team`),
                        Comp.p(Comp.link(`${FRONTEND_URL}/dashboard`, "Go to your dashboard")),
                        Comp.p(Comp.link(`${FRONTEND_URL}/contact`, "Contact Us")),
                        Comp.p(Comp.link(`${FRONTEND_URL}/support`, "Support")),
                        Comp.p(Comp.link(`${FRONTEND_URL}/privacy`, "Privacy Policy")),
                        Comp.p(Comp.link(`${FRONTEND_URL}/terms`, "Terms of Service")),
                        Comp.p(Comp.link(`${FRONTEND_URL}/unsubscribe`, "Unsubscribe")),
                    ].join(""),
                    brandName: BRAND_NAME
                  })
                }
              }


                  //Welcome
    const sendWelcomeEmail =  ({email}) => {
        return {
              subject: `Welcome to ${BRAND_NAME}`,
        html: wrapLayout({
            title: "Welcome!",
            bodyHtml:[
                Comp.p(`Hi ${escapeHtml(email)}`),
                Comp.p(`We're excited to have you on board.`),
                Comp.p(Comp.link(`${FRONTEND_URL}/dashboard`, "Go to your dashboard")),
            ].join(""),
            brandName: BRAND_NAME
        })
        }
    }

   //export an array of all templates
const authEmailTemplates = {
    passwordReset: sendPasswordResetLinkEmail,
    passwordResetSuccess: sendPasswordResetSuccessEmail,
    sixDigitCode: sendSixDigitCodeEmail,
    verifyEmail: sendVerifyEmail,
    emailVerificationSuccess: sendEmailVerificationSuccessful,
    emailUpdated: sendEmailUpdated,
    welcome: sendWelcomeEmail
};

module.exports = authEmailTemplates;


       


    
                       
