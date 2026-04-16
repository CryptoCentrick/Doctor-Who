import { Worker } from "bullmq";
import { REPORT_JOB_NAME, REPORT_QUEUE_NAME } from "@doctor-who/shared";

import { generateReports } from "@/src/server/reports/service";

const connection = {
  host: process.env.REDIS_HOST ?? "127.0.0.1",
  port: Number(process.env.REDIS_PORT ?? "6379"),
  password: process.env.REDIS_PASSWORD
};

const worker = new Worker(
  REPORT_QUEUE_NAME,
  async (job) => {
    if (job.name !== REPORT_JOB_NAME) {
      return null;
    }

    return generateReports(job.data.modules);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Completed report job ${job.id}`);
});

worker.on("failed", (job, error) => {
  console.error(`Failed report job ${job?.id}`, error);
});
