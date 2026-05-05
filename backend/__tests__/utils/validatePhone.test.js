const validatePhone = require("../../utils/validatePhone");

const invalidPhoneNumber = "123";
const validPhoneNumber = "703456789";
const validPhoneNumberWithCountry = "+254703456789";
const validUSPhoneNumber = "+18175698900'"

describe('Phone number validation', () => {
  it("Should throw an error if countryIso2 is missing", () => {
    expect(() => validatePhone({localPhone: validPhoneNumber})).toThrow("Country is required");
  });

  it("Should throw an error if localPhone is missing", () => {
    expect(() => validatePhone({countryIso2: "KE"})).toThrow("Phone number is required");
  });

  it("Should throw an error if phone number is not valid for the selected country", () => {
    expect(() => validatePhone({countryIso2: "KE", localPhone: invalidPhoneNumber})).toThrow("Invalid phone number for selected country");
  })

  
  it("Should return a valid normalized phone object for Kenya", () => {
    const result = validatePhone({countryIso2: "KE", localPhone: validPhoneNumber});
    
    expect(result).toEqual(
        expect.objectContaining({
            e164: expect.stringMatching(/^\+254/),
            countryIso2: "KE",
            countryIso3: "KEN",
            countryCode: "+254"
        })
    )
  })
   
  
});
