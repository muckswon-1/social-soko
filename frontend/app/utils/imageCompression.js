import imageCompression from "browser-image-compression";

export async function compressImageFile(file, avatar) {
    if(!file) return null;

    const MAX_SIZE_MB = 1000;
    const sizeInMB = file.size / (1024 * 1024);

    if(sizeInMB > MAX_SIZE_MB) {
        const err = new Error(`File is too large (${sizeInMB.toFixed(1)} MB. Max allowed is ${MAX_SIZE_MB}`);

        err.code = "FILE_TOO_LARGE";
        throw err;
    }

    const options = {
            maxSizeMB: 10,
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