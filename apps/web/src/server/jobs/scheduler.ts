import { seedReportSchedules } from "@/src/server/jobs/queue";

seedReportSchedules()
  .then(() => {
    console.log("Doctor Who report schedules registered.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to register report schedules.", error);
    process.exit(1);
  });
