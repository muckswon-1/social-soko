import imageCompression from "browser-image-compression";

/**
 * 
 * @param {File} file 
 * 
 * @returns {File}
 */
export async function compressImageFile(file) {
    if(!file) return null;

    const MAX_SIZE_MB = 100;
    const sizeInMB = file.size / (1024 * 1024);

    if(sizeInMB > MAX_SIZE_MB) {
        const err = new Error(`File is too large (${sizeInMB.toFixed(1)} MB. Max allowed is ${MAX_SIZE_MB}`);

        err.code = "FILE_TOO_LARGE";
        throw err;
    }

    const options = {
            maxSizeMB: 15,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            maxIteration: 15,
        }
    try {
        const compressedFile = await imageCompression(file,options );
        return compressedFile;
    } catch (error) {
        console.error( error);

        return file;
    }

}