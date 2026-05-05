const {EmailJob} = require("../../../models");
const UTILS = require("../../../utils/utils");


module.exports = UTILS.catchAsync(async (req, res) => {
    const { id } = req.params;

    console.log(id);

    if (!id) {
        throw UTILS.httpError(400, "Job id is required");

    }

    const job = await EmailJob.findByPk(id);

    if (!job) {
        throw UTILS.httpError(404, "Job not found");

    }
    res.json({job});

});