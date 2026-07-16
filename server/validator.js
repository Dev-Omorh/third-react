/**
 * Validates a plant shift record and flags violations.
 * 
 * Rules:
 * - Efficiency Rate: >= 70%
 * - Downtime Hours: <= 4 hours
 * - Safety Incidents: 0
 * - Production Volume: >= 100 units
 * 
 * @param {Object} record - The shift record to validate
 * @returns {Object} { status: 'PASSED' | 'FLAGGED', flagReasons: string[], errors: string[] }
 */
export function validateRecord(record) {
  const errors = [];
  const flagReasons = [];

  // Data format validation
  if (!record.plantName || typeof record.plantName !== 'string' || record.plantName.trim() === '') {
    errors.push("Plant name is required and must be a string.");
  }
  if (!record.operatorName || typeof record.operatorName !== 'string' || record.operatorName.trim() === '') {
    errors.push("Operator name is required and must be a string.");
  }
  if (!record.shiftDate || isNaN(Date.parse(record.shiftDate))) {
    errors.push("A valid shift date is required.");
  }
  
  const validShifts = ["Morning", "Day", "Evening", "Night"];
  if (!record.shiftType || !validShifts.includes(record.shiftType)) {
    errors.push(`Shift type must be one of: ${validShifts.join(', ')}.`);
  }

  const productionVolume = Number(record.productionVolume);
  if (isNaN(productionVolume) || productionVolume < 0) {
    errors.push("Production volume must be a non-negative number.");
  }

  const efficiencyRate = Number(record.efficiencyRate);
  if (isNaN(efficiencyRate) || efficiencyRate < 0 || efficiencyRate > 100) {
    errors.push("Efficiency rate must be a percentage between 0 and 100.");
  }

  const downtimeHours = Number(record.downtimeHours);
  if (isNaN(downtimeHours) || downtimeHours < 0) {
    errors.push("Downtime hours must be a non-negative number.");
  }

  const safetyIncidents = Number(record.safetyIncidents);
  if (isNaN(safetyIncidents) || safetyIncidents < 0 || !Number.isInteger(safetyIncidents)) {
    errors.push("Safety incidents must be a non-negative integer.");
  }

  if (errors.length > 0) {
    return { status: 'INVALID', flagReasons, errors };
  }

  // Business logic validation rules
  if (productionVolume < 100) {
    flagReasons.push(`Low production volume: ${productionVolume} units (expected >= 100)`);
  }
  if (efficiencyRate < 70) {
    flagReasons.push(`Low efficiency rate: ${efficiencyRate}% (expected >= 70%)`);
  }
  if (downtimeHours > 4) {
    flagReasons.push(`Excessive downtime: ${downtimeHours} hours (expected <= 4)`);
  }
  if (safetyIncidents > 0) {
    flagReasons.push(`Safety incident reported: ${safetyIncidents} incident(s)`);
  }

  const status = flagReasons.length > 0 ? "FLAGGED" : "PASSED";

  return {
    status,
    flagReasons,
    errors
  };
}
