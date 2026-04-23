export declare const PIPE_SIZES: any[];
export declare const PIPE_SIZES_FLUSH_VALVE: any[];
export declare const C_FACTORS: any[];
export declare function getPipeBySize(mm: number): any;
export declare function getPipeByInch(inches: string): any;
export declare function getInternalDiameter(mm: number): number;
export declare function getRecommendedPipeSize(fixtureUnits: number, systemType?: 'FLUSH_TANK' | 'FLUSH_VALVE', demandType?: 'average' | '100percent'): {
    mm: number;
    inches: string;
};
export declare function getCFactor(material?: string, useRecommended?: boolean): number;
export declare function getPipeMaterials(): string[];
export declare function calculatePipeArea(diameterM: number): number;
export declare const UNIT_CONVERSIONS: {
    GPM_TO_LPS: number;
    GPM_TO_M3S: number;
    LPS_TO_GPM: number;
    LPS_TO_M3S: number;
    M3S_TO_GPM: number;
    M3S_TO_LPS: number;
    BAR_TO_MWG: number;
    MWG_TO_BAR: number;
    BAR_TO_PSI: number;
    PSI_TO_BAR: number;
    INCH_TO_MM: number;
};
export declare function gpmToLps(gpm: number): number;
export declare function gpmToM3s(gpm: number): number;
export declare function lpsToM3s(lps: number): number;
export declare function barToMwg(bar: number): number;
export declare function mwgToBar(mwg: number): number;
export declare function barToPsi(bar: number): number;
export declare const PVC_PIPES_SPECS: any[];
export declare function calculatePVCInternalDiameterWorstCase(dn: number, pvcClass: number): number;
export declare function calculatePVCInternalDiameter(dn: number, pvcClass: number): number;
export declare function getPVCPipeSpecs(dn: number): any;
//# sourceMappingURL=pipes.d.ts.map