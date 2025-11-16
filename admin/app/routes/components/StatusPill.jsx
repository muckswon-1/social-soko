import { resolveVerificationStatus } from "../../utils/emailListHelpers";

 
 export const renderStatusPill = (b) => {
    const status = resolveVerificationStatus(b);

    switch (status) {
      case "verified":
        return (
          <span className="businesses-pill businesses-pill--verified">
            Verified
          </span>
        );
      case "requested":
        return (
          <span className="businesses-pill businesses-pill--requested">
            Requested
          </span>
        );
      case "rejected":
        return (
          <span className="businesses-pill businesses-pill--rejected">
            Rejected
          </span>
        );
      case "pending":
        return (
          <span className="businesses-pill businesses-pill--pending">
            Pending
          </span>
        );
      case "unverified":
        return (
          <span className="businesses-pill businesses-pill--unverified">
            Unverified
          </span>
        );
      default:
        return (
          <span className="businesses-pill businesses-pill--unknown">
            —
          </span>
        );
    }
  };