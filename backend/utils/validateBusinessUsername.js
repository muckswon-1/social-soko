

const USERNAME_BLACKLIST = [
  // System / Admin
  "admin", "administrator", "root", "superuser", "sysadmin", "system",
  "server", "host", "owner", "master", "sudo", "mod", "moderator",

  // Support / Contact
  "support", "help", "contact", "info", "team", "office", "service",
  "services", "feedback", "noreply", "no-reply", "hello", "hi", "mail",
  "email", "contactus", "supportteam",

  // Auth / Security
  "login", "signin", "signup", "logout", "register", "auth", "authentication",
  "verify", "verification", "password", "reset", "forgot", "secure",
  "security", "oauth", "token",

  // Business Generic
  "business", "businesses", "enterprise", "company", "corporate", "shop",
  "store", "stores", "market", "marketplace", "vendor", "vendors",
  "seller", "sellers", "buyer", "buyers",

  // Profile / User terms
  "user", "users", "account", "accounts", "profile", "profiles",
  "dashboard", "settings", "management", "manager",

  // Platform / Page keywords
  "home", "homepage", "about", "aboutus", "faq", "helpcenter", "privacy",
  "privacy-policy", "terms", "terms-of-service", "policy", "policies",
  "billing", "invoice", "api", "status",

  // Reserved Social Soko names
  "social", "soko", "socialsoko", "sokosocial", "official", "team",
  "community", "events", "reviews", "review", "business-review", "hub",

  // Payment / Finance
  "payment", "payments", "pay", "payout", "payouts", "cash", "bank",
  "finance", "financial", "billing", "money", "wallet",

  // Legal / Compliance
  "legal", "compliance", "law", "laws", "copyright", "dmca",

  // Tech / Reserved Endpoints
  "api", "static", "assets", "cdn", "img", "image", "images", "js",
  "css", "script", "scripts", "file", "files", "upload", "uploads",
  "download", "downloads",

  // Developer / System keywords
  "test", "dev", "development", "developer", "staging", "production",
  "beta", "alpha",

  // Offensive (avoid abuse)
  "fuck", "shit", "bitch", "asshole", "cunt", "nigger", "slut", "hoe",
  "gay", "lesbian", "hitler", "nazi",

  // Empty or whitespace variants
  "",
  " ",  
  "-"
];




module.exports = function validateBusinessUsername(rawUsername) {

    const options = {
        blacklist: USERNAME_BLACKLIST,
        minLength:6,
        maxLength: 30,
        allowedCharacters:["letters", "numbers", "underscores"],
        trim: true,
        lowercase: true
    }


    if(typeof rawUsername !== "string") {
      return {
        valid: false,
        reason: "Username must be a string"
      }
    }

    let username = rawUsername;

    if(options.trim) {
      username = username.trim();
    }

    if(options.lowercase) {
      username = username.toLowerCase();
    }

    // basc username presence check
    if(!username) {

      return {
        valid: false,
        reason: "Username cannot be empty"

      }

    }

    //Legth constraints
    if(username.length < options.minLength) {

      return {
        valid: false,
        reason: `Username must be at least ${options.minLength} characters long`

      }
    }

    if(username.length > options.maxLength) {

      return {
        valid: false,
        reason: `Username must be at most ${options.maxLength} characters long`

      }
    }

    // Black list check - case insensitive
    const lowerBlacklist = options.blacklist.map((word) => String(word).toLowerCase());

    if(lowerBlacklist.includes(username.toLowerCase())){
      return {
        valid: false,
        reason: "This username is not allowed"
      }
    }


    // build allowed character class 
    const charClassParts = [];
    if(options.allowedCharacters.includes("letters")){
      charClassParts.push("a-z")
    }

    if(options.allowedCharacters.includes("numbers")){
      charClassParts.push("0-9")
    }

    if(options.allowedCharacters.includes("underscores")){
      charClassParts.push("_")
    }

    if(options.allowedCharacters.includes("dashes")){
      charClassParts.push("\\-")
    }

    if(options.allowedCharacters.includes("spaces")){
      charClassParts.push(" ")
    }


    //Allow only defined characters
    const allowedCharsRegex = new RegExp(`^[${charClassParts.join("")}]+$`);

    console.log(allowedCharsRegex);

    if(!allowedCharsRegex.test(username)){
      return {
        valid: false,
        reason: "Username contains invalid characters (only letters, numbers, underscores allowed)", 
    }

    };

    console.log(username);

    return {
      valid: true,
      value: username
    }

}
            

        