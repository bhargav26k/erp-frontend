// src/PropertyParts/staticPropertyPartDetails.ts

export interface StaticDetails {
  propertyArea: string;
  ageOfProperty: string;
  locationArea: "FrontSide" | "InnerSide";
  floorNumber: string;
  readyReckonerRate: number;
  depreciation: number;
  // (You can add whatever “age adjustments” or “location adjustments” you want here,
  // but for simplicity we’ll combine them into a single depreciation value.)
  netRate: number;
  finalUnitValuation: number;
  rentRate: number;
}

// For demo purposes, we only populate a few IDs.
// In practice, add one entry per unit.id (or generate defaults on the fly).
export const staticPropertyPartDetails: Record<number, StaticDetails> = {
  1: {
    propertyArea: "1200 sq ft",
    ageOfProperty: "5 yrs",
    locationArea: "FrontSide",
    floorNumber: "Ground",
    readyReckonerRate: 5000,
    depreciation: 500,
    netRate: 4500, // RR – depreciation (for simplicity)
    finalUnitValuation: 1200 * 4500, // area × netRate
    rentRate: 35_000,
  },
  2: {
    propertyArea: "800 sq ft",
    ageOfProperty: "10 yrs",
    locationArea: "InnerSide",
    floorNumber: "1",
    readyReckonerRate: 4500,
    depreciation: 700,
    netRate: 3800,
    finalUnitValuation: 800 * 3800,
    rentRate: 25_000,
  },
  // …add more static entries keyed by unit‐ID…
};
