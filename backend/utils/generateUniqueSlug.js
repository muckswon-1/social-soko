const {Business} = require("../models/index.js");
const UTILS = require("./utils.js");

  
  // build a slug from a string
  function buildSlugFromStr(str)  {
  return String(str || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g,"")
  }


   async function generateUniqueSlug(baseSlug, fallbackName) {
    const rawBase = baseSlug && String(baseSlug).trim() ? baseSlug : fallbackName;

    if(!rawBase) {
        throw UTILS.httpError(400, "Slug or name is required to generate a business slug");
    }


    const base = buildSlugFromStr(rawBase);

    if(!base) {
        throw UTILS.httpError(400,"Unable to generate a valid slug from business name")
    }

    let candidate = base;
    let counter = 1;

    while(true) {
        const existing = await Business.findOne({
            where: {slug: candidate},
            attributes: ["id"],
        });

        if(!existing) break;
        counter += 1;
        candidate = `${base}-${counter}`
    }

    return candidate;


  }

  module.exports = {generateUniqueSlug, buildSlugFromStr}


