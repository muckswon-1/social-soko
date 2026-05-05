

 export function normaliseGenericErrorResponse(response){
    console.log(response);
 }




/**
 * Map raw API error object to our UI ErrorResponse shape
 * 
 * @param {any} raw
 * @returns {ErrorResponse}
 * 
 *
 * */
export function mapApiErrorToUiError(raw)
{
    if(!raw){
        return {status: null, error: null, message: null}

    }

    const {status, data} = raw;

    const error = data?.error || data?.message || null;
    const code = data?.code || null;

    return {status, error, code}

}


 export function normaliseErrorResponse(response){
   
    if(!response){
        return {status: null, error: null, code: null}
    }

    const {status, error, code} = response ? mapApiErrorToUiError(response) : null;

    let message = null;
    if(status === 403){
        message = "You are not authorized to view this resource"
    }
    
    return {status, error: error || message, code}

 }










