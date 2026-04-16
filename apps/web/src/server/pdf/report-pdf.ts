import PDFDocument from "pdfkit";
import { REPORT_MODULES, type HealthReport, type ReportModuleType } from "@doctor-who/shared";

const templateMap: Record<ReportModuleType, { accent: string; heading: string; subheading: string }> =
  REPORT_MODULES.reduce((acc, moduleDefinition) => {
    acc[moduleDefinition.moduleType] = {
      accent: moduleDefinition.accent,
      heading: moduleDefinition.title,
      subheading: moduleDefinition.description
    };
    return acc;
  }, {} as Record<ReportModuleType, { accent: string; heading: string; subheading: string }>);

function writeReportSection(doc: PDFKit.PDFDocument, report: HealthReport, isFirst: boolean) {
  const template = templateMap[report.moduleType];

  if (!isFirst) {
    doc.addPage();
  }

  doc
    .roundedRect(42, 42, 520, 100, 24)
    .fillOpacity(0.16)
    .fill(template.accent)
    .fillOpacity(1);

  doc
    .fillColor("#ffffff")
    .fontSize(28)
    .text(template.heading, 64, 68)
    .fontSize(12)
    .fillColor("#d5dde5")
    .text(template.subheading, 64, 104, { width: 420 });

  doc
    .fillColor("#0f172a")
    .fontSize(12)
    .text(`Score: ${report.data.score}/100`, 64, 166)
    .text(`Generated: ${new Date(report.generatedAt).toLocaleString()}`, 64, 186)
    .text(report.data.headline, 64, 214, { width: 470 });

  let y = 270;
  doc.fontSize(16).fillColor("#0f172a").text("Key metrics", 64, y);
  y += 26;

  report.data.summary.forEach((metric) => {
    doc
      .roundedRect(64, y, 470, 44, 14)
      .fillAndStroke("#f8fafc", "#e2e8f0")
      .fillColor("#0f172a")
      .fontSize(11)
      .text(metric.label, 78, y + 10)
      .fontSize(12)
      .text(metric.value, 310, y + 10, { width: 210, align: "right" });
    y += 54;
  });

  y += 8;
  doc.fontSize(16).fillColor("#0f172a").text("Interpretation", 64, y);
  y += 24;
  report.data.insights.forEach((insight) => {
    doc
      .fontSize(12)
      .fillColor("#0f172a")
      .text(`${insight.title}: ${insight.description}`, 64, y, { width: 470 });
    y += 38;
  });

  y += 8;
  doc.fontSize(16).fillColor("#0f172a").text("Recommended actions", 64, y);
  y += 24;
  report.data.recommendations.forEach((recommendation) => {
    doc
      .fontSize(12)
      .fillColor("#334155")
      .text(`- ${recommendation}`, 74, y, { width: 450 });
    y += 28;
  });

  doc
    .roundedRect(64, 690, 470, 72, 18)
    .fillAndStroke("#fff7ed", "#fdba74")
    .fillColor("#7c2d12")
    .fontSize(11)
    .text(report.data.disclaimer, 78, 712, {
      width: 440
    });
}

export async function renderReportsPdf(reports: HealthReport[]) {
  const document = new PDFDocument({
    size: "A4",
    margin: 40
  });
  const chunks: Buffer[] = [];

  document.on("data", (chunk) => chunks.push(chunk as Buffer));

  const finished = new Promise<Buffer>((resolve, reject) => {
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);
  });

  reports.forEach((report, index) => writeReportSection(document, report, index === 0));
  document.end();

  return finished;
}
