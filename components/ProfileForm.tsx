"use client";

// ---------------------------------------------------------------------------
// components/ProfileForm.tsx: collects the user's household and habits.
// Holds only form state; the parent decides what to do on submit.
// ---------------------------------------------------------------------------

import { useState } from "react";
import type { FormEvent } from "react";
import { COMMUTES, FUELS } from "@/lib/types";
import type { Commute, Fuel, UserProfile } from "@/lib/types";

const COMMUTE_LABELS: Record<Commute, string> = {
  car: "Car",
  bike: "Bike",
  public_transport: "Public transport",
  walk: "Walk",
};

const FUEL_LABELS: Record<Fuel, string> = {
  lpg: "LPG",
  electric: "Electric",
  wood_or_coal: "Wood or coal",
};

const INITIAL_PROFILE: UserProfile = {
  city: "",
  hasChildren: false,
  hasElderly: false,
  hasRespiratoryCondition: false,
  hasPurifier: false,
  commute: "car",
  fuel: "lpg",
};

// One-click sample households. They only prefill the form; the user still
// submits, so the real API, live air data and safety rule all run as normal.
const EXAMPLES: Array<{ label: string; profile: UserProfile }> = [
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
    label: "Asthma, Kolkata",
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

const INPUT_STYLE =
  "mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 min-h-[44px] transition-colors focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/25";

const EXAMPLE_BUTTON_STYLE =
  "min-h-[44px] rounded-full border border-slate-400 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500";

interface ProfileFormProps {
  isLoading: boolean;
  onSubmit: (profile: UserProfile) => void;
}

interface CheckboxFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function CheckboxField({ id, label, checked, onChange }: CheckboxFieldProps) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-3 rounded-xl border p-3 min-h-[44px] cursor-pointer transition-all duration-150 select-none ${checked
        ? "border-sky-600 bg-sky-50/70 text-slate-900 shadow-xs ring-1 ring-sky-600/30"
        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/80"
        }`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-slate-300 text-sky-600 accent-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 focus:outline-none cursor-pointer"
      />
      <span className="text-sm font-medium leading-normal">{label}</span>
    </label>
  );
}

export function ProfileForm({ isLoading, onSubmit }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);

  function update<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ ...profile, city: profile.city.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div role="group" aria-label="Try an example" className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-700">Try an example:</span>
        {EXAMPLES.map((example) => (
          // type="button" so clicking an example never submits the form.
          <button
            key={example.label}
            type="button"
            onClick={() => setProfile(example.profile)}
            className={EXAMPLE_BUTTON_STYLE}
          >
            {example.label}
          </button>
        ))}
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-semibold text-slate-900">
          City
        </label>
        <p className="mt-0.5 text-xs text-slate-600">
          Live AQI coordinates are retrieved automatically.
        </p>
        <div className="relative mt-1">
          <input
            id="city"
            type="text"
            required
            maxLength={100}
            value={profile.city}
            onChange={(event) => update("city", event.target.value)}
            placeholder="For example: Delhi, London, Lahore"
            className={INPUT_STYLE}
          />
        </div>
      </div>

      <fieldset className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5">
        <legend className="px-1 text-sm font-semibold text-slate-900">Who lives at home?</legend>
        <p className="text-xs text-slate-600 -mt-1 pb-1">Select all vulnerable groups that apply:</p>
        <div className="space-y-2">
          <CheckboxField
            id="children"
            label="Children"
            checked={profile.hasChildren}
            onChange={(value) => update("hasChildren", value)}
          />
          <CheckboxField
            id="elderly"
            label="Elderly people"
            checked={profile.hasElderly}
            onChange={(value) => update("hasElderly", value)}
          />
          <CheckboxField
            id="respiratory"
            label="Someone with a respiratory condition"
            checked={profile.hasRespiratoryCondition}
            onChange={(value) => update("hasRespiratoryCondition", value)}
          />
        </div>
      </fieldset>

      <div>
        <label htmlFor="commute" className="block text-sm font-semibold text-slate-900">
          Main way of getting around
        </label>
        <p className="mt-0.5 text-xs text-slate-600">Affects outdoor exposure tips.</p>
        <select
          id="commute"
          value={profile.commute}
          onChange={(event) => update("commute", event.target.value as Commute)}
          className={INPUT_STYLE}
        >
          {COMMUTES.map((option) => (
            <option key={option} value={option}>
              {COMMUTE_LABELS[option]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="fuel" className="block text-sm font-semibold text-slate-900">
          Cooking or heating fuel
        </label>
        <p className="mt-0.5 text-xs text-slate-600">Affects indoor air tips.</p>
        <select
          id="fuel"
          value={profile.fuel}
          onChange={(event) => update("fuel", event.target.value as Fuel)}
          className={INPUT_STYLE}
        >
          {FUELS.map((option) => (
            <option key={option} value={option}>
              {FUEL_LABELS[option]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <CheckboxField
          id="purifier"
          label="I have an air purifier"
          checked={profile.hasPurifier}
          onChange={(value) => update("hasPurifier", value)}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 px-5 py-3.5 text-base font-semibold text-white shadow-md shadow-sky-950/15 hover:from-sky-500 hover:to-teal-500 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 min-h-[44px] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <svg
              className="h-5 w-5 motion-safe:animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Preparing your plan...</span>
          </>
        ) : (
          <>
            <span>Get my clean-air plan</span>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}