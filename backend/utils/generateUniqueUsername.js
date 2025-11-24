const {Business} = require("../models");

function toUsernamebase(str){
    return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, "-") // replace spaces & invalid with -
    .replace(/^-+|-+$/g, "");
}


 async function generateUniqueUsername(desiredUsername, fallbackName) {
    const MAX_LEN = 30;
    const MIN_LEN = 3;

    let rawBase = desiredUsername && String(desiredUsername).trim() ? desiredUsername : fallbackName;


    if(!rawBase) {
         // ultimate fall back if we have nothing
         rawBase = `business-${Date.now().toString(36)}`;
    }

    let base = toUsernamebase(rawBase);

    if(base.length < MIN_LEN) {
        base = `${base || "biz"}-${Date.now().toString(36).slice(-4)}`;
    }

    if(base.length > MAX_LEN) {
        base = base.slice(0, MAX_LEN);
    }

    let candidate = base; 
    let counter = 1;

    while(true){
        const existing = await Business.findOne({
            where: {username: candidate}
        });

        if(!existing) break;

        counter +=1;

        const suffix = `-${counter}`;
        const availableLen = MAX_LEN  - suffix.length;
        const trimmedBase = base.slice(0, availableLen);
        candidate = `${trimmedBase}${suffix}`;


    }

    return candidate;

  
}

module.exports = {generateUniqueUsername}