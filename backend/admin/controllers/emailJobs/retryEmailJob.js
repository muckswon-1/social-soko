const {EmailJob} = require("../../../models");
const UTILS = require("../../../utils/utils");

module.exports = UTILS.catchAsync(async (req, res) => {
    const {id} = req.params;
    const {payload,template, to, forceRetry = false} = req.body

    if(!id) {
        throw UTILS.httpError(400, "Job id is required");
    }

    const job = await EmailJob.findByPk(id);


    if(!job) {
       throw UTILS.httpError(404, "Job not found");

    }


    if(job.status === "sent" && !forceRetry) { 
        return res.status(400).json({message: "Email already sent. Use forceRetry to override."});
    }

    // retry with the email info in database
    





    if(typeof template !== "undefined") {
        job.template = template;
    }

    if(typeof payload !== "undefined") {
        if(payload !== null && typeof payload !== "object"){
            throw UTILS.httpError(400, "Payload must be a JSOn object")
        }

        job.payload = payload;
    }

    if(typeof to !== "undefined") {
        job.to = to;

    }


    // return the job to the queue
    job.status = "pending";
    job.attempts = 0;
    job.last_error = null;

    await job.save();
    res.json({
        message: "Job has been retried",
        job
    });

})