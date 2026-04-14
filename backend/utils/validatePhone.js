const { default: phone } = require("phone");


module.exports = ({countryIso2, localPhone}) => {
   
    const country = String(countryIso2 || "").trim().toUpperCase();
    const rawPhone = String(localPhone || "").trim();


    if(!country){
        const error = new Error("Country is required");
        error.status = 400;
        throw error
    }

    if(!rawPhone) {
        const error = new Error("Phone number is required");
        error.status = 400;
        throw error
    }

    const result = phone(rawPhone, {country});

    if(!result.isValid) {
        const error = new Error("Invalid phone number for selected country");
        error.status = 400;
        throw error
    }


    return {
       
        e164: result.phoneNumber,
        countryIso2: result.countryIso2,
        countryIso3: result.countryIso3,
        countryCode: result.countryCode,
    }


}





