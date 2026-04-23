export declare const HUNTER_CURVE_FLUSH_TANK: {
    fu: number;
    gpm: number;
}[];
export declare const HUNTER_CURVE_FLUSH_VALVE: {
    fu: number;
    gpm: number;
}[];
export declare function fuToGPM(fu: number, systemType?: 'FLUSH_TANK' | 'FLUSH_VALVE'): number;
export declare function getFlowRate(fixtureUnits: number, systemType?: 'FLUSH_TANK' | 'FLUSH_VALVE'): number;
export declare function isValidFU(fu: number, systemType?: 'FLUSH_TANK' | 'FLUSH_VALVE'): boolean;
export declare function getFURange(systemType?: 'FLUSH_TANK' | 'FLUSH_VALVE'): {
    min: number;
    max: number;
};
export declare function calculateUPCGPM(flushTankFU: number, flushValveFU: number): {
    totalFU: number;
    totalGPM: number;
    systemType: 'FLUSH_TANK' | 'FLUSH_VALVE';
};
//# sourceMappingURL=hunterCurve.d.ts.map