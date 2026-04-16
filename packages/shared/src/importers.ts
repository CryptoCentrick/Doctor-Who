import type { BiometricReading } from "./types";

type ParsedImport = {
  readings: BiometricReading[];
  sourceLabel: string;
};

function parseCsv(input: string) {
  const [headerLine, ...lines] = input.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((item) => item.trim());

  return lines.map((line) => {
    const values = line.split(",").map((item) => item.trim());
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index] ?? "";
      return acc;
    }, {});
  });
}

export function parseImportedPayload(userId: string, filename: string, payload: string): ParsedImport {
  const lowerName = filename.toLowerCase();

  if (lowerName.endsWith(".json")) {
    const parsed = JSON.parse(payload) as Array<Record<string, string | number>>;
    return {
      sourceLabel: "JSON import",
      readings: parsed.map((entry, index) => ({
        id: `import-json-${index}`,
        userId,
        type: String(entry.type) as BiometricReading["type"],
        value: Number(entry.value),
        unit: String(entry.unit ?? ""),
        source: "IMPORT",
        recordedAt: String(entry.recordedAt)
      }))
    };
  }

  if (lowerName.endsWith(".csv")) {
    const records = parseCsv(payload);
    return {
      sourceLabel: "CSV import",
      readings: records.map((record, index) => ({
        id: `import-csv-${index}`,
        userId,
        type: String(record.type) as BiometricReading["type"],
        value: Number(record.value),
        unit: record.unit,
        source: "IMPORT",
        recordedAt: record.recordedAt
      }))
    };
  }

  if (lowerName.endsWith(".xml")) {
    const matches = Array.from(
      payload.matchAll(/<Record type="([^"]+)" value="([^"]+)" unit="([^"]*)" startDate="([^"]+)"/g)
    );

    return {
      sourceLabel: "Apple Health XML import",
      readings: matches.slice(0, 50).map((match, index) => ({
        id: `import-xml-${index}`,
        userId,
        type: "HEART_RATE",
        value: Number(match[2]),
        unit: match[3],
        source: "IMPORT",
        recordedAt: new Date(match[4]).toISOString(),
        metadata: {
          originalType: match[1]
        }
      }))
    };
  }

  return {
    sourceLabel: "Unsupported import",
    readings: []
  };
}
