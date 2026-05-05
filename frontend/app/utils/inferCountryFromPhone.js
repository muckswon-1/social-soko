import countryCodes from './CountryCodes.json';

export const inferCountryFromPhone = (phone) => {
    if(!phone) return null;

    const cleaned = String(phone).replace(/\s/g,"");

    const match = countryCodes.find((c) => cleaned.startsWith(c.dial_code));

    return match || null;
}