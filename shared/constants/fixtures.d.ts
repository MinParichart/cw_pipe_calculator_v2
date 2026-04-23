export declare const FIXTURE_UNITS: any;
export declare enum FixtureType {
    WC_TANK = "WC_TANK",
    WC_VALVE = "WC_VALVE",
    LAVATORY = "LAVATORY",
    BATHTUB = "BATHTUB",
    SHOWER = "SHOWER",
    KITCHEN_SINK = "KITCHEN_SINK",
    LAUNDRY_TRAY = "LAUNDRY_TRAY",
    DISHWASHER = "DISHWASHER",
    WASHING_MACHINE_3_5KG = "WASHING_MACHINE_3_5KG",
    WASHING_MACHINE_7KG = "WASHING_MACHINE_7KG",
    HOSE_BIBB = "HOSE_BIBB",
    DRINKING_FOUNTAIN = "DRINKING_FOUNTAIN",
    URINAL_VALVE = "URINAL_VALVE",
    SERVICE_SINK = "SERVICE_SINK"
}
export declare function getFixtureUnits(type: FixtureType | string, supplyType?: 'hot' | 'cold' | 'total'): number;
export declare function getFixtureLabel(type: FixtureType | string): string;
export declare function getFixtureMinSize(type: FixtureType | string): {
    mm: number | null;
    inches: string | null;
};
export declare function hasHotWater(type: FixtureType | string): boolean;
export declare function hasColdWater(type: FixtureType | string): boolean;
export declare function getAllFixtureTypes(): {
    type: string;
    label: any;
    cold: any;
    hot: any;
    total: any;
    minSizeMM: any;
    minSizeIn: any;
    flowRateGPM: any;
}[];
//# sourceMappingURL=fixtures.d.ts.map