const { Comp, escapeHtml } = require("./utils")
const wrapLayout = require("./wrapLayout");


require('dotenv');

   const FRONTEND_URL = process.env.FRONTEND_URL;
   const BRAND_NAME = process.env.BRAND_NAME;

// send business created successfully
const sendBussinessCreatedSuccessful = ({email}) => {
    return {
        subject: 'Business created successfully',
        html: wrapLayout({
            title: 'Business created successfully',
            bodyHtml: [
                Comp.p(`Hello ${escapeHtml(email)},`),
                Comp.p(`Your business has been created successfully. You can now start using our platform to manage your business.`)
            ].join(''),
            brandName: BRAND_NAME
        })
    }
}










module.exports = {
    businessCreated: sendBussinessCreatedSuccessful
}

    
