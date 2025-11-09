 export const setIfMounted = (fn, mounted) => {
    if (mounted.current) fn();
  };

  export const ok = (extra = {}) => ({ success: true, ...extra });

 export  const fail = (err, fallback = 'Request failed') => ({
    success: false,
    error: err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback,
  });
 