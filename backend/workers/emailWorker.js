// workers/emailWorker.js (or wherever this file lives)
const { Op } = require("sequelize");
const { EmailJob } = require("../models");
const { sendTemplatedEmail } = require("../services/email/emailService");

require("dotenv").config();

// Config (overridable via env if you want)
const MAX_ATTEMPTS = Number(process.env.EMAIL_WORKER_MAX_ATTEMPTS || 5);
const BATCH_SIZE = Number(process.env.EMAIL_WORKER_BATCH_SIZE || 20);
const INTERVAL_MS = Number(process.env.EMAIL_WORKER_INTERVAL_MS || 20_000);

// -------------------------- Core runner --------------------------

async function runEmailJobsOnce() {
  const now = new Date();

  console.log(`[email-worker] Running email jobs at ${now.toISOString()}`);

  const pendingJobs = await EmailJob.findAll({
    where: {
      status: "pending",
      attempts: { [Op.lte]: MAX_ATTEMPTS },
      [Op.or]: [
        { scheduled_at: null },
        { scheduled_at: { [Op.lte]: now } },
      ],   
      
    },
    limit: BATCH_SIZE,
    order: [["created_at", "ASC"]],
  });

  if (pendingJobs.length === 0) {
    console.log("[email-worker] No pending email jobs found");
    return;
  }

  console.log(
    `[email-worker] Found ${pendingJobs.length} pending email job(s)`,
  );

  for (const job of pendingJobs) {
    try {
      await sendTemplatedEmail({
        to: job.to,
        template: job.template,
        props: job.payload || {},
      });

      job.status = "sent";
      job.sent_at = new Date();
      job.last_error = null;

      console.log(
        `[email-worker] EmailJob ${job.id} sent -> ${job.to} (template: ${job.template})`,
      );
    } catch (error) {
      const message = error?.message || String(error);
      job.attempts += 1;
      job.status = job.attempts >= MAX_ATTEMPTS ? "failed" : "pending";
      job.last_error = message.slice(0, 1000);

      console.error(
        `[email-worker] Failed EmailJob ${job.id} (attempt ${job.attempts}): ${message}`,
      );
    }

    await job.save();
  }
}

// -------------------------- Worker loop --------------------------

async function startWorkerLoop() {
  console.log(
    `[email-worker] Worker loop started (batchSize=${BATCH_SIZE}, intervalMs=${INTERVAL_MS}, maxAttempts=${MAX_ATTEMPTS})`,
  );

  // Run immediately once on start
  await runEmailJobsOnce();

  // Then schedule repeated runs
  setInterval(() => {
    runEmailJobsOnce().catch((error) => {
      console.error("[email-worker] Error in email worker loop:", error);
    });
  }, INTERVAL_MS);
}

// -------------------------- CLI Helpers --------------------------

/**
 * Very small arg parser: turns:
 *   node emailWorker.js send --to a@b.com --template auth.passwordReset --props '{"email":"a@b.com","token":"123"}'
 * into { to: 'a@b.com', template: 'auth.passwordReset', props: '{"email":"a@b.com","token":"123"}' }
 */
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;

    const key = arg.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith("--")
      ? argv[i + 1]
      : true;

    args[key] = value;
  }
  return args;
}

async function handleCliSend() {
  const argv = process.argv.slice(3); // after "send"
  const args = parseArgs(argv);

  const to = args.to;
  const template = args.template;
  const propsRaw = args.props;

  if (!to || !template) {
    console.error(
      "Usage: node emailWorker.js send --to <email> --template <templateKey> [--props '{\"foo\":\"bar\"}']",
    );
    process.exit(1);
  }

  let props = {};
  if (propsRaw) {
    try {
      props = JSON.parse(propsRaw);
    } catch (err) {
      console.error(
        "[email-worker] Failed to parse --props JSON. Make sure it's valid JSON.",
      );
      console.error(err.message);
      process.exit(1);
    }
  }

  console.log(
    `[email-worker] Sending one-off email -> to=${to}, template=${template}, props=${propsRaw || "{}"}`,
  );

  try {
    await sendTemplatedEmail({ to, template, props });
    console.log("[email-worker] One-off email sent successfully");
    process.exit(0);
  } catch (error) {
    console.error("[email-worker] Failed to send one-off email:", error);
    process.exit(1);
  }
}

// -------------------------- Entrypoint --------------------------

/**
 * Modes:
 *   node emailWorker.js worker     -> startWorkerLoop (default)
 *   node emailWorker.js run-once   -> runEmailJobsOnce and exit
 *   node emailWorker.js send ...   -> send single email via template
 */
if (require.main === module) {
  const mode = process.argv[2] || "worker";

  if (mode === "worker") {
    startWorkerLoop().catch((error) => {
      console.error("[email-worker] Fatal error in worker:", error);
      process.exit(1);
    });
  } else if (mode === "run-once") {
    runEmailJobsOnce()
      .then(() => {
        console.log("[email-worker] run-once complete");
        process.exit(0);
      })
      .catch((error) => {
        console.error("[email-worker] Error in run-once:", error);
        process.exit(1);
      });
  } else if (mode === "send") {
    // CLI one-off send
    handleCliSend();
  } else {
    console.error(
      `Unknown mode "${mode}". Supported: worker | run-once | send`,
    );
    process.exit(1);
  }
}

module.exports = {
  runEmailJobsOnce,
  startWorkerLoop,
};
