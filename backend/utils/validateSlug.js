module.exports = (normalizedSlug) => {
    if(!normalizedSlug) {
        return {
            valid: false,
            reason: "Slug is required after normalization"
        }
    }

    // check length
    if(normalizedSlug.length > 80) {
        return {
            valid: false,
            reason: "Slug should not be longer than 80 characters"

        }
    }

    if(normalizedSlug.length < 3) {
        return {
            valid: false,
            reason: "Slug should be at least 3 characters long"

        }

    }


    //only letters, numers, hyphens

    if(!/^[a-z0-9-]+$/.test(normalizedSlug)) {
        return {
            valid: false,
            reason: "Slug can only contain lowercase letters, numbers and hyphens"

        }
    }

    //prevent consecutive hyphens
    if(normalizedSlug.includes("--")) {
        return {
            valid: false,
            reason: "Slug cannot contain consecutive hyphens"

        }
    }

    return {valid: true}

}