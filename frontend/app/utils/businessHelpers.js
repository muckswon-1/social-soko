export const canRequestBusinessVerification = ({status, rejectedAt, isLoading, cooldownDays=3 }) => {
    
    if(isLoading) return {canRequest: false, daysRemaining: null};

    const normalizedStatus = status || "pending";
    
    if(normalizedStatus === "verified" || normalizedStatus === "requested") return {canRequest: false, daysRemaining: null};


    if(normalizedStatus === "rejected") {
        if(!rejectedAt) return {canRequest: true, daysRemaining: 0};

        const rejectedTime = new Date(rejectedAt);
        if(Number.isNaN(rejectedTime.getTime())) return {canRequest: true, daysRemaining: 0};

        const now =  new Date()
        const timeInMsSinceRejected = now.getTime() - rejectedTime.getTime();
        const oneDayMs = 24 * 60 * 60 * 1000;
        const cooldownMs = cooldownDays * oneDayMs

        if(timeInMsSinceRejected >= cooldownMs) return {canRequest: true, daysRemaining: 0};

        const daysRemaining = Math.ceil( (cooldownMs - timeInMsSinceRejected) / oneDayMs);
        return {canRequest: false, daysRemaining};

       
    }

    return {canRequest: true, daysRemaining: null}
 }


   export const getStatusLabel = (verificationStatus) => {
    switch (verificationStatus) {
      case "verified":
        return "Verified business";
      case "requested":
        return "Verification requested";
      case "rejected":
        return "Verification rejected";
      case "pending":
      default:
        return "Not verified yet";
    }
  };

  export const getStatusDescription = (verificationStatus) => {
    switch (verificationStatus) {
      case "verified":
        return "Your business has been verified. Partners can see you as a trusted business on Social Soko.";
      case "requested":
        return "We're reviewing your verification request. You'll receive an email once we've made a decision.";
      case "rejected":
        return "Your previous verification request was rejected. Check your email for more details.";
      case "pending":
      default:
        return "Complete your profile and request verification so partners know they're dealing with a real business.";
    }
  };

  export const getStatusPillClass = (verificationStatus) => {
    switch (verificationStatus) {
      case "verified":
        return "business-status-pill business-status-pill--verified";
      case "requested":
        return "business-status-pill business-status-pill--requested";
      case "rejected":
        return "business-status-pill business-status-pill--rejected";
      case "pending":
      default:
        return "business-status-pill business-status-pill--pending";
    }
  };