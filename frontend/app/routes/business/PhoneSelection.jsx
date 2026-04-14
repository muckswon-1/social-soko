import React from 'react';
import countryCodes from '../../utils/CountryCodes.json';



const PhoneSelection = ({onChange, value, setForm}) => {

    const handleChange = (e) => {
    const newCode = e.target.value;
    const country = countryCodes.find(c => c.code === newCode) || null;

    if(onChange) {
        onChange(newCode, country, setForm)
    }
}

    return (
        
          
          <select
           className="form-control"
           value={value || ""}
           onChange={handleChange}
          >
            <option value="">Select Country</option>
            {
                countryCodes.map((c) =>(
                    <option key={c.code} value={c.code}>
                        {c.name} ({c.dial_code})
                    </option>
                ))
            }
          
          </select>
         
    );
}

export default PhoneSelection;
