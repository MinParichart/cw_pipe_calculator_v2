"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HUNTER_CURVE_FLUSH_VALVE = exports.HUNTER_CURVE_FLUSH_TANK = void 0;
exports.fuToGPM = fuToGPM;
exports.getFlowRate = getFlowRate;
exports.isValidFU = isValidFU;
exports.getFURange = getFURange;
exports.calculateUPCGPM = calculateUPCGPM;
// Hunter's Curve - Flush Tank System (ตาราง 2.3)
exports.HUNTER_CURVE_FLUSH_TANK = [
    { fu: 6, gpm: 5.0 },
    { fu: 8, gpm: 6.5 },
    { fu: 10, gpm: 8.0 },
    { fu: 12, gpm: 9.2 },
    { fu: 14, gpm: 10.4 },
    { fu: 16, gpm: 11.6 },
    { fu: 18, gpm: 12.8 },
    { fu: 20, gpm: 14.0 },
    { fu: 25, gpm: 17.0 },
    { fu: 30, gpm: 20.0 },
    { fu: 35, gpm: 22.5 },
    { fu: 40, gpm: 24.8 },
    { fu: 45, gpm: 27.0 },
    { fu: 50, gpm: 29.0 },
    { fu: 60, gpm: 32.0 },
    { fu: 70, gpm: 35.0 },
    { fu: 80, gpm: 38.0 },
    { fu: 90, gpm: 41.0 },
    { fu: 100, gpm: 43.5 },
    { fu: 120, gpm: 48.0 },
    { fu: 140, gpm: 52.5 },
    { fu: 160, gpm: 57.0 },
    { fu: 180, gpm: 61.0 },
    { fu: 200, gpm: 65.0 },
    { fu: 225, gpm: 70.0 },
    { fu: 250, gpm: 75.0 },
    { fu: 275, gpm: 80.0 },
    { fu: 300, gpm: 85.0 },
    { fu: 400, gpm: 105.0 },
    { fu: 500, gpm: 125.0 },
    { fu: 750, gpm: 170.0 },
    { fu: 1000, gpm: 208.0 },
    { fu: 1250, gpm: 240.0 },
    { fu: 1500, gpm: 267.0 },
    { fu: 1750, gpm: 294.0 },
    { fu: 2000, gpm: 321.0 },
    { fu: 2250, gpm: 348.0 },
    { fu: 2500, gpm: 375.0 },
    { fu: 2750, gpm: 402.0 },
    { fu: 3000, gpm: 432.0 },
    { fu: 4000, gpm: 525.0 },
    { fu: 5000, gpm: 593.0 },
    { fu: 6000, gpm: 643.0 },
    { fu: 7000, gpm: 685.0 },
    { fu: 8000, gpm: 718.0 },
    { fu: 9000, gpm: 745.0 },
    { fu: 10000, gpm: 769.0 },
];
// Hunter's Curve - Flush Valve System (ตาราง 2.3)
exports.HUNTER_CURVE_FLUSH_VALVE = [
    { fu: 10, gpm: 27.0 },
    { fu: 12, gpm: 28.6 },
    { fu: 14, gpm: 30.2 },
    { fu: 16, gpm: 31.8 },
    { fu: 18, gpm: 33.4 },
    { fu: 20, gpm: 35.0 },
    { fu: 25, gpm: 38.0 },
    { fu: 30, gpm: 41.0 },
    { fu: 35, gpm: 43.5 },
    { fu: 40, gpm: 46.5 },
    { fu: 45, gpm: 49.0 },
    { fu: 50, gpm: 51.5 },
    { fu: 60, gpm: 55.0 },
    { fu: 70, gpm: 58.5 },
    { fu: 80, gpm: 62.0 },
    { fu: 90, gpm: 64.8 },
    { fu: 100, gpm: 67.5 },
    { fu: 120, gpm: 72.5 },
    { fu: 140, gpm: 77.5 },
    { fu: 160, gpm: 82.5 },
    { fu: 180, gpm: 87.0 },
    { fu: 200, gpm: 91.5 },
];
// Interpolate FU to GPM
function fuToGPM(fu, systemType = 'FLUSH_TANK') {
    const table = systemType === 'FLUSH_TANK' ? exports.HUNTER_CURVE_FLUSH_TANK : exports.HUNTER_CURVE_FLUSH_VALVE;
    // Find surrounding points
    const lower = table.filter(p => p.fu <= fu).pop();
    const upper = table.find(p => p.fu >= fu);
    if (!lower) {
        // FU is below minimum, use first value
        return table[0].gpm;
    }
    if (!upper) {
        // FU is above maximum, use last value
        return table[table.length - 1].gpm;
    }
    if (lower.fu === upper.fu) {
        return lower.gpm;
    }
    // Interpolate
    return lower.gpm + (fu - lower.fu) * ((upper.gpm - lower.gpm) / (upper.fu - lower.fu));
}
// Get GPM for multiple FUs
function getFlowRate(fixtureUnits, systemType = 'FLUSH_TANK') {
    return fuToGPM(fixtureUnits, systemType);
}
// Validate FU is within range
function isValidFU(fu, systemType = 'FLUSH_TANK') {
    const table = systemType === 'FLUSH_TANK' ? exports.HUNTER_CURVE_FLUSH_TANK : exports.HUNTER_CURVE_FLUSH_VALVE;
    return fu >= 0 && fu <= table[table.length - 1].fu;
}
// Get FU range for system type
function getFURange(systemType = 'FLUSH_TANK') {
    const table = systemType === 'FLUSH_TANK' ? exports.HUNTER_CURVE_FLUSH_TANK : exports.HUNTER_CURVE_FLUSH_VALVE;
    return {
        min: table[0].fu,
        max: table[table.length - 1].fu,
    };
}
// UPC Standard: Calculate GPM for mixed systems (Flush Tank + Flush Valve)
// ถ้ามี Flush Valve ในระบบ → รวม FU ทั้งหมด → ใช้ Flush Valve curve
// ถ้าไม่มี Flush Valve → รวม FU ทั้งหมด → ใช้ Flush Tank curve
function calculateUPCGPM(flushTankFU, flushValveFU) {
    const totalFU = flushTankFU + flushValveFU;
    // UPC Standard: ถ้ามี Flush Valve แม้ตัวเดียว ให้ใช้ Flush Valve curve
    if (flushValveFU > 0) {
        return {
            totalFU,
            totalGPM: fuToGPM(totalFU, 'FLUSH_VALVE'),
            systemType: 'FLUSH_VALVE'
        };
    }
    // มีแต่ Flush Tank
    return {
        totalFU,
        totalGPM: fuToGPM(totalFU, 'FLUSH_TANK'),
        systemType: 'FLUSH_TANK'
    };
}
//# sourceMappingURL=hunterCurve.js.map