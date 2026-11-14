export interface ConsistencyResult {
  percent: number;
  pass: boolean;
  amountNeeded: number;
}

export function checkConsistency(
  totalProfit: number,
  bestDayProfit: number,
  maxPercent: number | null,
): ConsistencyResult {
  if (totalProfit <= 0) {
    return { percent: 0, pass: false, amountNeeded: 0 };
  }

  const percent = (bestDayProfit / totalProfit) * 100;

  if (maxPercent === null) {
    return { percent, pass: true, amountNeeded: 0 };
  }

  const pass = percent <= maxPercent;
  const requiredTotal = bestDayProfit / (maxPercent / 100);
  const amountNeeded = pass ? 0 : Math.max(0, requiredTotal - totalProfit);

  return { percent, pass, amountNeeded };
}

export interface DrawdownResult {
  floor: number;
  dollarsToBreach: number;
  alreadyBreached: boolean;
  maxSafeLots: number;
}

export function calculateDrawdown(
  currentBalance: number,
  peakBalance: number,
  drawdownLimit: number,
  stopLossUnits: number,
  valuePerUnitPerLot: number,
): DrawdownResult {
  const floor = peakBalance - drawdownLimit;
  const dollarsToBreach = currentBalance - floor;
  const alreadyBreached = dollarsToBreach <= 0;

  const riskPerLot = stopLossUnits * valuePerUnitPerLot;
  const maxSafeLots = riskPerLot > 0 && !alreadyBreached ? dollarsToBreach / riskPerLot : 0;

  return { floor, dollarsToBreach, alreadyBreached, maxSafeLots };
}
