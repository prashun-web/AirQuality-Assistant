// ---------------------------------------------------------------------------
// lib/formOptions.ts: display labels and example presets for ProfileForm.
// ---------------------------------------------------------------------------

import type { Commute, Fuel, UserProfile } from "./types";

export const COMMUTE_LABELS: Record<Commute, string> = {
  car: "Car",
  bike: "Bike",
  public_transport: "Public transport",
  walk: "Walk",
};

export const FUEL_LABELS: Record<Fuel, string> = {
  lpg: "LPG",
  electric: "Electric",
  wood_or_coal: "Wood or coal",
};

// One-click sample households. They only prefill the form; the user still
// submits, so the real API, live air data and safety rule all run as normal.
export const EXAMPLES: Array<{ label: string; profile: UserProfile }> = [
  {
    label: "Family in Delhi",
    profile: {
      city: "Delhi",
      hasChildren: true,
      hasElderly: true,
      hasRespiratoryCondition: false,
      hasPurifier: false,
      commute: "car",
      fuel: "wood_or_coal",
    },
  },
  {
    label: "Asthma Patient in Kolkata",
    profile: {
      city: "Kolkata",
      hasChildren: false,
      hasElderly: false,
      hasRespiratoryCondition: true,
      hasPurifier: true,
      commute: "public_transport",
      fuel: "lpg",
    },
  },
];
