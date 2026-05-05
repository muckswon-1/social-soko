 
 export const businessFilter = (businesses, localSearch) => {
    if (!localSearch.trim()) return businesses;

    const term = localSearch.toLowerCase();

    return businesses.filter((b) => {
      const name = b.name || "";
      const email = b.email || "";
      const phone = b.phone || "";
      const contactName = b.contact_name || b.contactName || "";

      return (
        name.toLowerCase().includes(term) ||
        email.toLowerCase().includes(term) ||
        phone.toLowerCase().includes(term) ||
        contactName.toLowerCase().includes(term)
      );
    });
}

export const resolveVerificationStatus = (b) => {

    if(!b || typeof b !== "object") return "unknown"
    
    if (typeof b.verification_status === "string") {
      return b.verification_status;
    }

    if (typeof b.verified === "string") {
      return b.verified;
    }

    if (typeof b.is_verified === "boolean") {
      return b.is_verified ? "verified" : "unverified";
    }

    if (typeof b.business_verified === "boolean") {
      return b.business_verified ? "verified" : "unverified";
    }

    return "unknown";
  };


  export const generateTasks = (business) => {

    if(!business || typeof business !== "object") return []

    const {verification_reasons, verification_status, verification_requested_at, verification_rejected_reason} = business

    const tasks = [];

    // If you store individual reasons as an array
    if (Array.isArray(verification_reasons) && verification_reasons.length) {
      verification_reasons.forEach((r) => {
        if (typeof r === "string" && r.trim()) {
          tasks.push(r.trim());
        }
      });
    }

    // If status is requested and you have a timestamp
    if (verification_status === "requested" && verification_requested_at) {
      tasks.push(
        `Verification was requested on ${new Date(
          verification_requested_at
        ).toLocaleString()}.`
      );
    } else if (verification_status === "requested") {
      tasks.push("Verification request pending review.");
    }

    // If previously rejected with a reason, surface that as a task as well
    if (verification_status === "rejected" && verification_rejected_reason) {
      tasks.push(`Last rejection reason: ${verification_rejected_reason}`);
    }

    if (tasks.length === 0) {
      tasks.push("No open verification tasks.");
    }

    return tasks;
  }


   
