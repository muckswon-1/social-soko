export const calcStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(score, 5); // 0..5
};


export const getInitials = (first, last, email) => {
  const a = (first || "").trim();
  const b = (last || "").trim();
  if (a || b) return `${a[0] || ""}${b[0] || ""}`.toUpperCase();
  const e = (email || "").trim();
  return e ? e[0].toUpperCase() : "U";
};





export const isPlainObject = (v) =>
  Object.prototype.toString.call(v) === '[object Object]';

export const isIsoDateLike = (v) =>
  typeof v === 'string' &&
  /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d{3})?)?Z?)?$/.test(v);



export const prettyKey = (k) =>
  k
    .replace(/[_\-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\b(id)\b/i, 'ID')
    .replace(/\burl\b/i, 'URL')
    .replace(/\bip\b/i, 'IP')
    .replace(/\buuid\b/i, 'UUID')
    .replace(/\b2fa\b/i, '2FA')
    .replace(/\s+/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());




