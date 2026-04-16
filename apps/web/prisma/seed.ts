import { PrismaClient } from "@prisma/client";
import { demoSnapshot } from "@doctor-who/shared";

const prisma = new PrismaClient();

async function main() {
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.healthReport.deleteMany();
  await prisma.connectedDevice.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.activitySession.deleteMany();
  await prisma.sleepSession.deleteMany();
  await prisma.biometricReading.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      id: demoSnapshot.user.id,
      email: demoSnapshot.user.email,
      name: demoSnapshot.user.name,
      dateOfBirth: new Date(demoSnapshot.user.dateOfBirth),
      gender: demoSnapshot.user.gender,
      height: demoSnapshot.user.heightCm,
      weight: demoSnapshot.user.weightKg,
      createdAt: new Date(demoSnapshot.user.createdAt)
    }
  });

  await prisma.biometricReading.createMany({
    data: demoSnapshot.readings.map((reading) => ({
      id: reading.id,
      userId: user.id,
      type: reading.type,
      value: reading.value,
      unit: reading.unit,
      source: reading.source,
      recordedAt: new Date(reading.recordedAt),
      metadata: reading.metadata
    }))
  });

  await prisma.sleepSession.createMany({
    data: demoSnapshot.sleepSessions.map((session) => ({
      id: session.id,
      userId: user.id,
      startTime: new Date(session.startTime),
      endTime: new Date(session.endTime),
      stages: session.stages,
      apneaEvents: session.apneaEvents,
      snoreEvents: session.snoreEvents
    }))
  });

  await prisma.activitySession.createMany({
    data: demoSnapshot.activitySessions.map((session) => ({
      id: session.id,
      userId: user.id,
      type: session.type,
      durationMinutes: session.durationMinutes,
      caloriesBurned: session.caloriesBurned,
      avgHeartRate: session.avgHeartRate,
      startedAt: new Date(session.startedAt),
      distanceKm: session.distanceKm ?? null,
      metadata: session.metadata
    }))
  });

  await prisma.alert.createMany({
    data: demoSnapshot.alerts.map((alert) => ({
      id: alert.id,
      userId: user.id,
      severity: alert.severity,
      message: alert.message,
      metric: alert.metric,
      value: alert.value,
      createdAt: new Date(alert.createdAt),
      resolvedAt: alert.resolvedAt ? new Date(alert.resolvedAt) : null
    }))
  });

  await prisma.connectedDevice.createMany({
    data: demoSnapshot.devices.map((device) => ({
      id: device.id,
      userId: user.id,
      deviceType: device.deviceType,
      deviceName: device.deviceName,
      connectionMethod: device.connectionMethod,
      lastSyncedAt: new Date(device.lastSyncedAt)
    }))
  });

  for (const report of demoSnapshot.reports) {
    await prisma.healthReport.create({
      data: {
        id: report.id,
        userId: user.id,
        moduleType: report.moduleType,
        generatedAt: new Date(report.generatedAt),
        score: report.data.score,
        data: report.data,
        pdfUrl: report.pdfUrl
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
