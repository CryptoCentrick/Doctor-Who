import {
  differenceInYears,
  eachDayOfInterval,
  endOfDay,
  format,
  parseISO,
  startOfDay,
  subDays
} from "date-fns";

import { MEDICAL_DISCLAIMER, REPORT_MODULE_LABELS } from "./constants";
import { average, clamp, latest, normalizeScore, percentageChange } from "./scoring";
import type {
  ActivitySession,
  Alert,
  BiometricReading,
  HealthReport,
  ModuleReportData,
  ReportInsight,
  ReportModuleType,
  SleepSession,
  UserProfile
} from "./types";

type SnapshotInput = {
  user: UserProfile;
  readings: BiometricReading[];
  sleepSessions: SleepSession[];
  activitySessions: ActivitySession[];
  alerts: Alert[];
};

const THIRTY_DAYS = 29;
const NINETY_DAYS = 89;

function getReadingsByType(readings: BiometricReading[], type: BiometricReading["type"]) {
  return readings
    .filter((reading) => reading.type === type)
    .sort((left, right) => left.recordedAt.localeCompare(right.recordedAt));
}

function buildDailySeries(readings: BiometricReading[], startDate: Date, label: string) {
  const grouped = new Map<string, number[]>();

  for (const reading of readings) {
    const key = format(parseISO(reading.recordedAt), "yyyy-MM-dd");
    const existing = grouped.get(key) ?? [];
    existing.push(reading.value);
    grouped.set(key, existing);
  }

  return eachDayOfInterval({ start: startDate, end: endOfDay(new Date()) }).map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const values = grouped.get(key) ?? [];

    return {
      date: format(day, "MMM d"),
      [label]: values.length ? Number(average(values).toFixed(1)) : 0
    };
  });
}

function buildSleepDebtSeries(sleepSessions: SleepSession[]) {
  let cumulativeDebt = 0;

  return sleepSessions.slice(-30).map((session) => {
    const durationHours =
      (parseISO(session.endTime).getTime() - parseISO(session.startTime).getTime()) /
      3_600_000;
    const debt = Math.max(0, 8 - durationHours);
    cumulativeDebt += debt;

    return {
      date: format(parseISO(session.endTime), "MMM d"),
      sleepDebt: Number(cumulativeDebt.toFixed(1))
    };
  });
}

function createInsights(items: Array<{ title: string; description: string; severity: ReportInsight["severity"] }>) {
  return items.map((item) => ({
    title: item.title,
    description: item.description,
    severity: item.severity
  }));
}

export function generateModuleReport(
  moduleType: ReportModuleType,
  input: SnapshotInput
): ModuleReportData {
  const start30 = startOfDay(subDays(new Date(), THIRTY_DAYS));
  const start90 = startOfDay(subDays(new Date(), NINETY_DAYS));

  const heartRateReadings = getReadingsByType(input.readings, "HEART_RATE");
  const hrvReadings = getReadingsByType(input.readings, "HRV");
  const spo2Readings = getReadingsByType(input.readings, "SPO2");
  const bloodPressureReadings = getReadingsByType(input.readings, "BLOOD_PRESSURE");
  const glucoseReadings = getReadingsByType(input.readings, "GLUCOSE");
  const weightReadings = getReadingsByType(input.readings, "WEIGHT");
  const bodyFatReadings = getReadingsByType(input.readings, "BODY_FAT");
  const breathingReadings = getReadingsByType(input.readings, "BREATHING_RATE");
  const stressReadings = getReadingsByType(input.readings, "STRESS_SCORE");
  const stepReadings = getReadingsByType(input.readings, "STEPS");
  const temperatureReadings = getReadingsByType(input.readings, "TEMPERATURE");

  const latestWeightKg = latest(weightReadings.map((reading) => reading.value)) || input.user.weightKg;
  const bmi = latestWeightKg / Math.pow(input.user.heightCm / 100, 2);
  const age = differenceInYears(new Date(), parseISO(input.user.dateOfBirth));

  if (moduleType === "CARDIOVASCULAR") {
    const restingHeartRate = average(heartRateReadings.slice(-14).map((reading) => reading.value));
    const activeHeartRate = average(input.activitySessions.slice(-10).map((session) => session.avgHeartRate));
    const hrvAverage = average(hrvReadings.slice(-14).map((reading) => reading.value));
    const latestBp = latest(bloodPressureReadings.map((reading) => reading.value));
    const systolic = Math.round(latestBp);
    const diastolic = Math.round((latestBp % 1) * 100);
    const spo2Average = average(spo2Readings.slice(-14).map((reading) => reading.value));

    const cardioScore = Math.round(
      average([
        normalizeScore(restingHeartRate, 52, 68, 35),
        normalizeScore(hrvAverage, 40, 90, 60),
        normalizeScore(spo2Average, 96, 100, 8),
        normalizeScore(systolic, 105, 120, 40)
      ])
    );

    const bpClassification =
      systolic >= 140 || diastolic >= 90
        ? "Stage 2"
        : systolic >= 130 || diastolic >= 80
          ? "Stage 1"
          : systolic >= 120
            ? "Elevated"
            : "Normal";

    return {
      moduleType,
      headline: "A steady resting heart rate and oxygen profile are keeping cardiovascular strain in check.",
      score: cardioScore,
      summary: [
        {
          label: "Cardiovascular Health Score",
          value: `${cardioScore}/100`,
          tone: cardioScore > 70 ? "positive" : cardioScore > 40 ? "warning" : "critical"
        },
        {
          label: "Resting vs active HR",
          value: `${restingHeartRate.toFixed(0)} / ${activeHeartRate.toFixed(0)} bpm`,
          helper: "14-day resting baseline vs latest workouts"
        },
        {
          label: "HRV status",
          value: `${hrvAverage.toFixed(0)} ms`,
          tone: hrvAverage > 45 ? "positive" : "warning"
        },
        {
          label: "Blood pressure risk",
          value: `${systolic}/${diastolic} mmHg (${bpClassification})`,
          tone: bpClassification === "Normal" ? "positive" : bpClassification === "Elevated" ? "warning" : "critical"
        },
        {
          label: "SpO2 trend",
          value: `${spo2Average.toFixed(1)}%`,
          helper: "Low oxygen events flagged below 93%"
        }
      ],
      charts: [
        {
          id: "cardio-heart-rate",
          title: "Resting vs Active Heart Rate",
          type: "line",
          data: buildDailySeries(
            heartRateReadings.filter((reading) => parseISO(reading.recordedAt) >= start30),
            start30,
            "heartRate"
          ),
          keys: ["heartRate"]
        },
        {
          id: "cardio-hrv",
          title: "HRV Trend",
          type: "area",
          data: buildDailySeries(
            hrvReadings.filter((reading) => parseISO(reading.recordedAt) >= start30),
            start30,
            "hrv"
          ),
          keys: ["hrv"]
        },
        {
          id: "cardio-spo2",
          title: "SpO2 Trend",
          type: "line",
          data: buildDailySeries(
            spo2Readings.filter((reading) => parseISO(reading.recordedAt) >= start30),
            start30,
            "spo2"
          ),
          keys: ["spo2"]
        }
      ],
      insights: createInsights([
        {
          title: "Blood pressure classification",
          description: `Latest recorded blood pressure sits in the ${bpClassification.toLowerCase()} band.`,
          severity: bpClassification === "Normal" ? "info" : "warning"
        },
        {
          title: "Recovery window",
          description:
            hrvAverage > 45
              ? "HRV remains resilient for most days this month."
              : "HRV is trending slightly compressed, suggesting extra recovery may help.",
          severity: hrvAverage > 45 ? "info" : "warning"
        }
      ]),
      recommendations: [
        "Repeat a seated morning blood pressure reading 3 times per week for cleaner trend analysis.",
        "Keep scan sessions longer than 45 seconds to improve webcam and phone PPG estimate quality.",
        "Log any dizziness, shortness of breath, or chest symptoms separately and seek clinical guidance if they appear."
      ],
      disclaimer: MEDICAL_DISCLAIMER
    };
  }

  if (moduleType === "METABOLIC") {
    const glucoseAverage = average(glucoseReadings.slice(-30).map((reading) => reading.value));
    const timeInRange =
      glucoseReadings.length === 0
        ? 0
        : Math.round(
            (glucoseReadings.filter((reading) => reading.value >= 70 && reading.value <= 140).length /
              glucoseReadings.length) *
              100
          );
    const bodyFat = latest(bodyFatReadings.map((reading) => reading.value));
    const caloricBurn = average(input.activitySessions.slice(-14).map((session) => session.caloriesBurned)) * 7;
    const caloricIntake = 2120 * 7;
    const insulinSensitivity = clamp(100 - Math.max(glucoseAverage - 95, 0) * 1.5 - Math.max(bmi - 24, 0) * 3, 35, 95);
    const metabolicScore = Math.round(
      average([
        normalizeScore(bmi, 20, 24.9, 10),
        normalizeScore(bodyFat || 22, 14, 24, 15),
        normalizeScore(glucoseAverage || 96, 75, 105, 70),
        insulinSensitivity
      ])
    );

    return {
      moduleType,
      headline: "Body composition and glucose markers suggest a manageable metabolic load with room to improve recovery nutrition.",
      score: metabolicScore,
      summary: [
        {
          label: "Metabolic Health Score",
          value: `${metabolicScore}/100`,
          tone: metabolicScore > 70 ? "positive" : metabolicScore > 40 ? "warning" : "critical"
        },
        {
          label: "BMI trend",
          value: `${bmi.toFixed(1)}`,
          helper: "Calculated from latest body weight and profile height"
        },
        {
          label: "Body fat estimate",
          value: bodyFat ? `${bodyFat.toFixed(1)}%` : "Awaiting input",
          tone: bodyFat && bodyFat < 26 ? "positive" : "warning"
        },
        {
          label: "Glucose time in range",
          value: `${timeInRange}%`,
          tone: timeInRange > 75 ? "positive" : "warning"
        },
        {
          label: "Calorie balance",
          value: `${Math.round(caloricBurn - caloricIntake)} kcal / week`,
          helper: "Burn estimate vs manual intake baseline"
        }
      ],
      charts: [
        {
          id: "metabolic-weight",
          title: "Weight & BMI Trend",
          type: "line",
          data: buildDailySeries(
            weightReadings.filter((reading) => parseISO(reading.recordedAt) >= start90),
            start90,
            "weight"
          ),
          keys: ["weight"]
        },
        {
          id: "metabolic-glucose",
          title: "Glucose Trend",
          type: "area",
          data: buildDailySeries(
            glucoseReadings.filter((reading) => parseISO(reading.recordedAt) >= start30),
            start30,
            "glucose"
          ),
          keys: ["glucose"],
          helper: "Target time-in-range: 70-140 mg/dL"
        }
      ],
      insights: createInsights([
        {
          title: "Insulin sensitivity proxy",
          description: `Estimated sensitivity index is ${Math.round(insulinSensitivity)}/100 from glucose, BMI, and activity balance.`,
          severity: insulinSensitivity > 70 ? "info" : "warning"
        },
        {
          title: "Visceral fat marker",
          description:
            bodyFat > 26
              ? "Body fat estimate is high enough to watch visceral fat trends closely."
              : "Current body fat estimate sits in a moderate band.",
          severity: bodyFat > 26 ? "warning" : "info"
        }
      ]),
      recommendations: [
        "Track fasting glucose at consistent times to sharpen daily and weekly trend quality.",
        "Use a connected glucose or weight device when possible to improve metabolic forecasting.",
        "Pair calorie intake logs with active minutes so the burn-vs-intake score stays grounded in real behavior."
      ],
      disclaimer: MEDICAL_DISCLAIMER
    };
  }

  if (moduleType === "SLEEP") {
    const latestSessions = input.sleepSessions.slice(-30);
    const averageDuration = average(
      latestSessions.map((session) => {
        return (
          (parseISO(session.endTime).getTime() - parseISO(session.startTime).getTime()) /
          3_600_000
        );
      })
    );
    const sleepConsistency = clamp(
      100 - Math.abs(averageDuration - 8) * 12 - average(latestSessions.map((session) => session.apneaEvents)) * 2,
      25,
      100
    );
    const totalStageMinutes = latestSessions.reduce(
      (acc, session) => {
        acc.rem += session.stages.remMinutes;
        acc.deep += session.stages.deepMinutes;
        acc.light += session.stages.lightMinutes;
        acc.awake += session.stages.awakeMinutes;
        return acc;
      },
      { rem: 0, deep: 0, light: 0, awake: 0 }
    );
    const sleepScore = Math.round(
      average([
        normalizeScore(averageDuration, 7.5, 8.5, 3),
        sleepConsistency,
        normalizeScore(average(latestSessions.map((session) => session.snoreEvents)), 0, 3, 12)
      ])
    );

    return {
      moduleType,
      headline: "Sleep duration is close to target, but consistency and overnight breathing events are shaping the score.",
      score: sleepScore,
      summary: [
        {
          label: "Sleep Quality Score",
          value: `${sleepScore}/100`,
          tone: sleepScore > 70 ? "positive" : sleepScore > 40 ? "warning" : "critical"
        },
        {
          label: "Average nightly duration",
          value: `${averageDuration.toFixed(1)} hrs`
        },
        {
          label: "Circadian consistency",
          value: `${Math.round(sleepConsistency)}/100`
        },
        {
          label: "Snoring / apnea events",
          value: `${Math.round(average(latestSessions.map((session) => session.snoreEvents)))}/${Math.round(average(latestSessions.map((session) => session.apneaEvents)))}`,
          helper: "30-night rolling average"
        },
        {
          label: "Recommended bedtime",
          value: "10:15 PM - 10:45 PM"
        }
      ],
      charts: [
        {
          id: "sleep-duration",
          title: "Nightly Sleep Duration",
          type: "bar",
          data: latestSessions.map((session) => ({
            date: format(parseISO(session.endTime), "MMM d"),
            duration:
              Number(
                (
                  (parseISO(session.endTime).getTime() - parseISO(session.startTime).getTime()) /
                  3_600_000
                ).toFixed(1)
              )
          })),
          keys: ["duration"]
        },
        {
          id: "sleep-stage",
          title: "Sleep Stage Breakdown",
          type: "pie",
          data: [
            { name: "REM", value: totalStageMinutes.rem },
            { name: "Deep", value: totalStageMinutes.deep },
            { name: "Light", value: totalStageMinutes.light },
            { name: "Awake", value: totalStageMinutes.awake }
          ],
          keys: ["value"]
        },
        {
          id: "sleep-debt",
          title: "Sleep Debt Curve",
          type: "line",
          data: buildSleepDebtSeries(latestSessions),
          keys: ["sleepDebt"]
        }
      ],
      insights: createInsights([
        {
          title: "Sleep debt buildup",
          description:
            averageDuration < 7.5
              ? "Recent sleep debt is accumulating and may impact recovery readiness."
              : "Recent sleep debt is stable and broadly manageable.",
          severity: averageDuration < 7.5 ? "warning" : "info"
        },
        {
          title: "Sleep mode note",
          description:
            "Microphone-based snore and breathing events remain estimate-grade signals and should be used as advisory context only.",
          severity: "info"
        }
      ]),
      recommendations: [
        "Use Sleep Mode for at least 5 nights in a row to stabilize the circadian rhythm score.",
        "Keep the phone stationary and charging overnight when using microphone-based sleep monitoring.",
        "If breathing pauses or severe daytime fatigue appear, seek professional evaluation."
      ],
      disclaimer: MEDICAL_DISCLAIMER
    };
  }

  if (moduleType === "FITNESS") {
    const weeklySteps = average(stepReadings.slice(-7).map((reading) => reading.value));
    const activeMinutes = average(input.activitySessions.slice(-14).map((session) => session.durationMinutes)) * 7;
    const vo2Max = clamp(58 - average(heartRateReadings.slice(-14).map((reading) => reading.value)) * 0.18 + weeklySteps / 1800, 28, 62);
    const fitnessBand =
      vo2Max >= 52 ? "Superior" : vo2Max >= 46 ? "Excellent" : vo2Max >= 40 ? "Good" : vo2Max >= 34 ? "Fair" : "Poor";
    const readinessScore = clamp(
      average(hrvReadings.slice(-10).map((reading) => reading.value)) +
        (65 - average(heartRateReadings.slice(-10).map((reading) => reading.value))),
      25,
      95
    );
    const fitnessScore = Math.round(
      average([
        normalizeScore(vo2Max, 40, 55, 20),
        normalizeScore(activeMinutes, 180, 320, 180),
        readinessScore
      ])
    );

    return {
      moduleType,
      headline: "Training load is productive, and recovery signals suggest you can push hard selectively rather than every day.",
      score: fitnessScore,
      summary: [
        {
          label: "Fitness Readiness Score",
          value: `${fitnessScore}/100`,
          tone: fitnessScore > 70 ? "positive" : fitnessScore > 40 ? "warning" : "critical"
        },
        {
          label: "VO2 max estimate",
          value: `${vo2Max.toFixed(1)} ml/kg/min`,
          helper: fitnessBand
        },
        {
          label: "Weekly activity",
          value: `${Math.round(weeklySteps)} avg daily steps`
        },
        {
          label: "Active minutes",
          value: `${Math.round(activeMinutes)} min/week`
        },
        {
          label: "Recovery readiness",
          value: `${Math.round(readinessScore)}/100`
        }
      ],
      charts: [
        {
          id: "fitness-steps",
          title: "Weekly Activity Breakdown",
          type: "bar",
          data: stepReadings.slice(-7).map((reading) => ({
            date: format(parseISO(reading.recordedAt), "EEE"),
            steps: Math.round(reading.value)
          })),
          keys: ["steps"]
        },
        {
          id: "fitness-strain",
          title: "Strain vs Recovery",
          type: "area",
          data: input.activitySessions.slice(-12).map((session, index) => ({
            date: format(parseISO(session.startedAt), "MMM d"),
            strain: Math.round(session.caloriesBurned / 15 + session.avgHeartRate / 2),
            recovery: Math.round(readinessScore - index)
          })),
          keys: ["strain", "recovery"]
        }
      ],
      insights: createInsights([
        {
          title: "Aerobic fitness classification",
          description: `Current VO2 max estimate falls in the ${fitnessBand.toLowerCase()} band.`,
          severity: fitnessBand === "Poor" || fitnessBand === "Fair" ? "warning" : "info"
        },
        {
          title: "Readiness outlook",
          description:
            readinessScore > 70
              ? "Recovery markers support moderate to high training intensity."
              : "Recovery markers favor lighter training or active recovery today.",
          severity: readinessScore > 70 ? "info" : "warning"
        }
      ]),
      recommendations: [
        "Use Quick Scan before hard sessions to refresh readiness scoring with current HR and HRV.",
        "Mix one mobility or low-intensity day into each three-day training block.",
        "When importing wearable workouts, include calories and distance for better VO2 estimation."
      ],
      disclaimer: MEDICAL_DISCLAIMER
    };
  }

  if (moduleType === "STRESS") {
    const stressAverage = average(stressReadings.slice(-30).map((reading) => reading.value));
    const breathingAverage = average(breathingReadings.slice(-14).map((reading) => reading.value));
    const focusHours = average(input.activitySessions.slice(-10).map((session) => session.durationMinutes / 60));
    const keyboardHeatmap = Array.from({ length: 7 }, (_, dayIndex) => ({
      date: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][dayIndex],
      intensity: Math.round(48 + Math.sin(dayIndex * 1.3) * 18 + dayIndex * 4)
    }));
    const wellnessScore = Math.round(
      average([
        normalizeScore(100 - stressAverage, 45, 100, 65),
        normalizeScore(average(hrvReadings.slice(-14).map((reading) => reading.value)), 40, 90, 60),
        normalizeScore(breathingAverage, 10, 18, 10)
      ])
    );

    return {
      moduleType,
      headline: "Daily load is manageable, though stress proxies suggest your busiest desktop windows deserve planned recovery breaks.",
      score: wellnessScore,
      summary: [
        {
          label: "Stress & Wellness Score",
          value: `${wellnessScore}/100`,
          tone: wellnessScore > 70 ? "positive" : wellnessScore > 40 ? "warning" : "critical"
        },
        {
          label: "Stress load",
          value: `${Math.round(stressAverage)}/100`
        },
        {
          label: "Morning cortisol proxy",
          value: `${Math.round(100 - average(hrvReadings.slice(-5).map((reading) => reading.value)))}`
        },
        {
          label: "Breathing rate",
          value: `${breathingAverage.toFixed(1)} br/min`
        },
        {
          label: "Focus sessions",
          value: `${focusHours.toFixed(1)} hrs/day`
        }
      ],
      charts: [
        {
          id: "stress-load",
          title: "Stress Load Trend",
          type: "line",
          data: buildDailySeries(
            stressReadings.filter((reading) => parseISO(reading.recordedAt) >= start30),
            start30,
            "stress"
          ),
          keys: ["stress"]
        },
        {
          id: "stress-heatmap",
          title: "Keyboard / Mouse Intensity",
          type: "heatmap",
          data: keyboardHeatmap,
          keys: ["intensity"]
        }
      ],
      insights: createInsights([
        {
          title: "Break recommendation engine",
          description:
            stressAverage > 55
              ? "High-intensity desktop activity suggests a 5-minute reset every 60 minutes."
              : "Current digital load supports a lighter break cadence.",
          severity: stressAverage > 55 ? "warning" : "info"
        },
        {
          title: "Breathing irregularity watch",
          description:
            breathingAverage > 18
              ? "Breathing rate is slightly elevated relative to a calm resting baseline."
              : "Breathing rate sits within a typical relaxed range.",
          severity: breathingAverage > 18 ? "warning" : "info"
        }
      ]),
      recommendations: [
        "Use the in-app mindfulness prompt after back-to-back focus sessions longer than 90 minutes.",
        "Record a 60-second breathing capture in a quiet room to reduce microphone noise artifacts.",
        "Treat keyboard and mouse load as a wellness proxy, not a clinical stress measure."
      ],
      disclaimer: MEDICAL_DISCLAIMER
    };
  }

  const cardioReport = generateModuleReport("CARDIOVASCULAR", input);
  const metabolicReport = generateModuleReport("METABOLIC", input);
  const sleepReport = generateModuleReport("SLEEP", input);
  const fitnessReport = generateModuleReport("FITNESS", input);
  const stressReport = generateModuleReport("STRESS", input);
  const overallScore = Math.round(
    average([
      cardioReport.score,
      metabolicReport.score,
      sleepReport.score,
      fitnessReport.score,
      stressReport.score
    ])
  );
  const biologicalAge = clamp(age + Math.round((100 - overallScore) / 7), 18, 92);
  const heartTrend30 = percentageChange(
    average(
      heartRateReadings
        .filter((reading) => parseISO(reading.recordedAt) >= start90 && parseISO(reading.recordedAt) < start30)
        .map((reading) => reading.value)
    ),
    average(
      heartRateReadings
        .filter((reading) => parseISO(reading.recordedAt) >= start30)
        .map((reading) => reading.value)
    )
  );
  const anomalyAlerts = input.alerts.filter((alert) => !alert.resolvedAt).slice(0, 4);
  const cardiovascularRisk = overallScore > 75 ? "Low" : overallScore > 55 ? "Moderate" : "High";
  const diabetesRisk =
    bmi < 25 && average(glucoseReadings.slice(-30).map((reading) => reading.value)) < 105
      ? "Low"
      : bmi < 30
        ? "Moderate"
        : "High";

  return {
    moduleType,
    headline: "Composite trends show a stable wellness trajectory with the strongest upside coming from sleep regularity and metabolic logging.",
    score: overallScore,
    summary: [
      {
        label: "Overall Health Index",
        value: `${overallScore}/100`,
        tone: overallScore > 70 ? "positive" : overallScore > 40 ? "warning" : "critical"
      },
      {
        label: "Biological age estimate",
        value: `${biologicalAge} yrs`,
        helper: `Chronological age: ${age}`
      },
      {
        label: "Cardiovascular risk",
        value: cardiovascularRisk,
        tone: cardiovascularRisk === "Low" ? "positive" : cardiovascularRisk === "Moderate" ? "warning" : "critical"
      },
      {
        label: "Diabetes risk proxy",
        value: diabetesRisk,
        tone: diabetesRisk === "Low" ? "positive" : diabetesRisk === "Moderate" ? "warning" : "critical"
      },
      {
        label: "30-day resting HR shift",
        value: `${heartTrend30.toFixed(1)}%`
      }
    ],
    charts: [
      {
        id: "predictive-trajectory",
        title: "Longitudinal Health Trajectory",
        type: "line",
        data: [
          {
            date: "30d",
            cardio: cardioReport.score - 4,
            metabolic: metabolicReport.score - 3,
            sleep: sleepReport.score - 5,
            fitness: fitnessReport.score - 2,
            stress: stressReport.score - 4
          },
          {
            date: "60d",
            cardio: cardioReport.score - 2,
            metabolic: metabolicReport.score - 1,
            sleep: sleepReport.score - 3,
            fitness: fitnessReport.score,
            stress: stressReport.score - 2
          },
          {
            date: "90d",
            cardio: cardioReport.score,
            metabolic: metabolicReport.score,
            sleep: sleepReport.score,
            fitness: fitnessReport.score,
            stress: stressReport.score
          }
        ],
        keys: ["cardio", "metabolic", "sleep", "fitness", "stress"]
      },
      {
        id: "predictive-temp",
        title: "Temperature Deviation",
        type: "area",
        data: buildDailySeries(
          temperatureReadings.filter((reading) => parseISO(reading.recordedAt) >= start30),
          start30,
          "temperature"
        ),
        keys: ["temperature"]
      }
    ],
    insights: createInsights([
      {
        title: "Anomaly watchlist",
        description:
          anomalyAlerts.length > 0
            ? anomalyAlerts.map((alert) => alert.message).join(" ")
            : "No unresolved anomalies are currently flagged.",
        severity: anomalyAlerts.length > 0 ? "warning" : "info"
      },
      {
        title: "Advisory-only rhythm check",
        description: "AFib-style rhythm irregularity flags remain advisory and are not diagnostic.",
        severity: "info"
      }
    ]),
    recommendations: [
      "Review 30/60/90-day trend summaries weekly so anomalies are interpreted with context, not in isolation.",
      "Connect a wearable or blood pressure cuff for stronger longitudinal confidence in the predictive score.",
      "Use anomaly alerts as prompts for follow-up, not final medical conclusions."
    ],
    disclaimer: MEDICAL_DISCLAIMER
  };
}

export function generateAllReports(input: SnapshotInput): HealthReport[] {
  return (
    ["CARDIOVASCULAR", "METABOLIC", "SLEEP", "FITNESS", "STRESS", "PREDICTIVE"] as ReportModuleType[]
  ).map((moduleType) => ({
    id: `${moduleType.toLowerCase()}-report`,
    userId: input.user.id,
    moduleType,
    generatedAt: new Date().toISOString(),
    pdfUrl: `/export/${moduleType.toLowerCase()}.pdf`,
    data: generateModuleReport(moduleType, input)
  }));
}

export function getModuleSubtitle(moduleType: ReportModuleType) {
  return REPORT_MODULE_LABELS[moduleType];
}
