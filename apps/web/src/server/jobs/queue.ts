import { Queue, QueueEvents } from "bullmq";
import { REPORT_JOB_NAME, REPORT_QUEUE_NAME, REPORT_SCHEDULES } from "@doctor-who/shared";

const connection = {
  host: process.env.REDIS_HOST ?? "127.0.0.1",
  port: Number(process.env.REDIS_PORT ?? "6379"),
  password: process.env.REDIS_PASSWORD
};

export const reportQueue = new Queue(REPORT_QUEUE_NAME, { connection });
export const reportQueueEvents = new QueueEvents(REPORT_QUEUE_NAME, { connection });

export async function seedReportSchedules() {
  for (const schedule of REPORT_SCHEDULES) {
    await reportQueue.add(
      REPORT_JOB_NAME,
      {
        modules: schedule.modules
      },
      {
        jobId: schedule.id,
        repeat: {
          pattern: schedule.pattern
        }
      }
    );
  }
}
