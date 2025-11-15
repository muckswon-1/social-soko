const { Op } = require("sequelize");
const {EmailJob} = require("../models");
const { sendTemplatedEmail } = require("../services/email/emailService");


const MAX_ATTEMPTS = 5;
const BATCH_SIZE = 20;
const INTERVAL_MS = 60_000;

const  runEmailJobsOnce = async () => {
    const now = new Date();

    console.log(`Running email jobs at ${now.toISOString()}`);

    const pendingJobs = await EmailJob.findAll({
        where: {
            status: "pending",
            attempts: {[Op.lte]: MAX_ATTEMPTS},
            [Op.or]: [
                {scheduled_at: null},
                {scheduled_at: {[Op.lte]: now}}
            ],
        },
        limit: BATCH_SIZE,
        order: [["created_at", "ASC"]]
    });

    if(pendingJobs.length === 0) {
        console.log("No pending email jobs found");
        return;
    }

    console.log(`Found ${pendingJobs.length} pending email jobs`);

    for (const job of pendingJobs) {
        try {

            await sendTemplatedEmail({
                to: job.to,
                template: job.template,
                props: job.payload
            });

            job.status = "sent";
            job.sent_at = new Date();
            job.last_error = null;

            console.log(`EmailJob ${job.id} sent -> ${job.to}`)

        } catch (error) {
            job.attempts += 1;
            job.status = job.attempts >= MAX_ATTEMPTS ? "failed" : "pending";
            job.last_error = error.message?.slice(0, 1000) || String(error);
        }
        await job.save();
    }

}


async function startWorkerLoop() {
    console.log("Email worker loop started");

    await runEmailJobsOnce();

    //run every minute
    setInterval(() => {
        runEmailJobsOnce().catch((error) => {
            console.error("Error in email worker loop:", error)
        })
    },INTERVAL_MS)
}




if(require.main === module) {
    startWorkerLoop().catch(error => {
        console.error("Fatal error in email worker:", error);
        process.exit(1);
    });
}
