"use strict";
// Fixture Units (ตาราง 2.2)
// Using plain object for flexibility across frontend/backend
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureType = exports.FIXTURE_UNITS = void 0;
exports.getFixtureUnits = getFixtureUnits;
exports.getFixtureLabel = getFixtureLabel;
exports.getFixtureMinSize = getFixtureMinSize;
exports.hasHotWater = hasHotWater;
exports.hasColdWater = hasColdWater;
exports.getAllFixtureTypes = getAllFixtureTypes;
exports.FIXTURE_UNITS = {
    // Private Use
    WC_TANK: { cold: 3, total: 3, label: 'Water Closet (Flush Tank)', minSizeMM: 15, minSizeIn: '1/2' },
    WC_VALVE: { cold: 6, total: 6, label: 'Water Closet (Flush Valve)', minSizeMM: 25, minSizeIn: '1' },
    LAVATORY: { hot: 1, cold: 1, total: 1, label: 'Lavatory', minSizeMM: 15, minSizeIn: '1/2' },
    BATHTUB: { hot: 2, cold: 2, total: 2, label: 'Bathtub', minSizeMM: 15, minSizeIn: '1/2' },
    SHOWER: { hot: 2, cold: 2, total: 2, label: 'Shower', minSizeMM: 15, minSizeIn: '1/2' },
    KITCHEN_SINK: { hot: 2, cold: 2, total: 2, label: 'Kitchen Sink', minSizeMM: 15, minSizeIn: '1/2' },
    LAUNDRY_TRAY: { hot: 2, cold: 2, total: 3, label: 'Laundry Tray', minSizeMM: null, minSizeIn: null },
    DISHWASHER: { hot: 1, total: 1, label: 'Dishwasher', minSizeMM: 15, minSizeIn: '1/2' },
    WASHING_MACHINE_3_5KG: { hot: 2, cold: 2, total: 2, label: 'Washing Machine 3.5kg', minSizeMM: null, minSizeIn: null },
    WASHING_MACHINE_7KG: { hot: 2, cold: 3, total: 4, label: 'Washing Machine 7kg', minSizeMM: null, minSizeIn: null },
    HOSE_BIBB: { total: 0, label: 'Hose Bibb', minSizeMM: 15, minSizeIn: '1/2', flowRateGPM: 5 },
    DRINKING_FOUNTAIN: { total: 0, label: 'Drinking Fountain', minSizeMM: 10, minSizeIn: '3/8' },
    URINAL_VALVE: { cold: 5, total: 5, label: 'Urinal (Flush Valve)', minSizeMM: 20, minSizeIn: '3/4' },
    SERVICE_SINK: { hot: 2, cold: 2, total: 3, label: 'Service Sink', minSizeMM: 20, minSizeIn: '3/4' },
};
// Fixture Types Enum
var FixtureType;
(function (FixtureType) {
    FixtureType["WC_TANK"] = "WC_TANK";
    FixtureType["WC_VALVE"] = "WC_VALVE";
    FixtureType["LAVATORY"] = "LAVATORY";
    FixtureType["BATHTUB"] = "BATHTUB";
    FixtureType["SHOWER"] = "SHOWER";
    FixtureType["KITCHEN_SINK"] = "KITCHEN_SINK";
    FixtureType["LAUNDRY_TRAY"] = "LAUNDRY_TRAY";
    FixtureType["DISHWASHER"] = "DISHWASHER";
    FixtureType["WASHING_MACHINE_3_5KG"] = "WASHING_MACHINE_3_5KG";
    FixtureType["WASHING_MACHINE_7KG"] = "WASHING_MACHINE_7KG";
    FixtureType["HOSE_BIBB"] = "HOSE_BIBB";
    FixtureType["DRINKING_FOUNTAIN"] = "DRINKING_FOUNTAIN";
    FixtureType["URINAL_VALVE"] = "URINAL_VALVE";
    FixtureType["SERVICE_SINK"] = "SERVICE_SINK";
})(FixtureType || (exports.FixtureType = FixtureType = {}));
// Get fixture units by type
function getFixtureUnits(type, supplyType = 'total') {
    const fixture = exports.FIXTURE_UNITS[type];
    if (!fixture)
        return 0;
    if (supplyType === 'hot') {
        return fixture.hot || 0;
    }
    if (supplyType === 'cold') {
        return fixture.cold || fixture.total || 0;
    }
    return fixture.total || 0;
}
// Get fixture label
function getFixtureLabel(type) {
    const fixture = exports.FIXTURE_UNITS[type];
    return fixture?.label || type;
}
// Get minimum pipe size for fixture
function getFixtureMinSize(type) {
    const fixture = exports.FIXTURE_UNITS[type];
    return {
        mm: fixture?.minSizeMM || null,
        inches: fixture?.minSizeIn || null,
    };
}
// Check if fixture has hot water supply
function hasHotWater(type) {
    const fixture = exports.FIXTURE_UNITS[type];
    return typeof fixture?.hot === 'number' && fixture.hot > 0;
}
// Check if fixture has cold water supply
function hasColdWater(type) {
    const fixture = exports.FIXTURE_UNITS[type];
    return typeof fixture?.cold === 'number' && fixture.cold > 0;
}
// Get all fixture types for catalog
function getAllFixtureTypes() {
    return Object.entries(exports.FIXTURE_UNITS).map(([key, value]) => ({
        type: key,
        label: value.label,
        cold: value.cold || 0,
        hot: value.hot || 0,
        total: value.total || 0,
        minSizeMM: value.minSizeMM,
        minSizeIn: value.minSizeIn,
        flowRateGPM: value.flowRateGPM,
    }));
}
//# sourceMappingURL=fixtures.js.map