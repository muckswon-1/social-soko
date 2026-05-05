module.exports = (req,relativePath) => {

    const normalized = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;

   // const protocol = req.protocol;
    //const host = req.get("host");
    //const baseUrl = `${protocol}://${host}`;
    const fileUrl = `/uploads${normalized}`;
    return fileUrl;
}