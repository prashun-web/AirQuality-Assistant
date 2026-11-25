"use client";

// ---------------------------------------------------------------------------
// components/ProfileForm.tsx: collects the user's household and habits.
// Holds only form state; the parent decides what to do on submit.
// ---------------------------------------------------------------------------

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { COMMUTE_LABELS, EXAMPLES, FUEL_LABELS } from "@/lib/formOptions";
import { COMMUTES, FUELS } from "@/lib/types";
import type { Commute, Fuel, UserProfile } from "@/lib/types";
import { useCitySuggestions } from "@/hooks/useCitySuggestions";

const INITIAL_PROFILE: UserProfile = {
  city: "",
  hasChildren: false,
  hasElderly: false,
  hasRespiratoryCondition: false,
  hasPurifier: false,
  commute: "car",
  fuel: "lpg",
};

const FIELD_LABEL_STYLE = "block text-sm font-semibold text-slate-900";
const FIELD_HELPER_STYLE = "mt-0.5 text-xs text-slate-600";

const INPUT_STYLE =
  "mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 min-h-[44px] transition-colors focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/25";

const SELECT_STYLE =
  "block w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-slate-900 min-h-[44px] transition-colors focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/25 cursor-pointer";

const EXAMPLE_BUTTON_STYLE =
  "min-h-[44px] rounded-full border border-slate-400 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500";

const CHECKBOX_BASE_STYLE =
  "flex items-center gap-3 rounded-xl border p-3 min-h-[44px] cursor-pointer transition-all duration-150 select-none";
const CHECKBOX_CHECKED_STYLE =
  "border-sky-600 bg-sky-50/70 text-slate-900 shadow-xs ring-1 ring-sky-600/30";
const CHECKBOX_UNCHECKED_STYLE =
  "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/80";

const SUBMIT_BUTTON_STYLE =
  "w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 px-5 py-3.5 text-base font-semibold text-white shadow-md shadow-sky-950/15 hover:from-sky-500 hover:via-teal-500 hover:to-emerald-500 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 min-h-[44px] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none";

const CAR_ICON = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 17h14M6 12l1.5-4.5A2 2 0 019.4 6h5.2a2 2 0 011.9 1.5L18 12m-12 0h12m-12 0a2 2 0 00-2 2v3h2m14-5a2 2 0 012 2v3h-2M7 17v1.5M17 17v1.5"
    />
  </svg>
);

const FLAME_ICON = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3c.5 3.5-2 5.5-2 8.5a4 4 0 008 0c0-2-1-3.5-2-5-.5 1.5-1.5 2-2.5 2C13 6.5 13 4.5 12 3z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a7 7 0 01-7-7c0-3.5 2.5-6.5 5-9.5"
    />
  </svg>
);

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
      className={`${CHECKBOX_BASE_STYLE} ${checked ? CHECKBOX_CHECKED_STYLE : CHECKBOX_UNCHECKED_STYLE
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

interface SelectFieldProps<T extends string> {
  id: string;
  label: string;
  helper: string;
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  icon: ReactNode;
  onChange: (value: T) => void;
}

function SelectField<T extends string>({
  id,
  label,
  helper,
  value,
  options,
  labels,
  icon,
  onChange,
}: SelectFieldProps<T>) {
  return (
    <div>
      <label htmlFor={id} className={FIELD_LABEL_STYLE}>
        {label}
      </label>
      <p className={FIELD_HELPER_STYLE}>{helper}</p>
      <div className="relative mt-1.5">
        <span
          className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-600"
          aria-hidden="true"
        >
          {icon}
        </span>
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className={SELECT_STYLE}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {labels[option]}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-slate-600"
          aria-hidden="true"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
    </div>
  );
}

export function ProfileForm({ isLoading, onSubmit }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const citySuggestions = useCitySuggestions(profile.city);

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
        <label htmlFor="city" className={FIELD_LABEL_STYLE}>
          City
        </label>
        <p className={FIELD_HELPER_STYLE}>
          Live AQI coordinates are retrieved automatically.
        </p>
        <div className="relative mt-1">
          <input
            id="city"
            type="text"
            list="city-suggestions"
            autoComplete="off"
            required
            maxLength={100}
            value={profile.city}
            onChange={(event) => update("city", event.target.value)}
            placeholder="For example: Delhi, London, Lahore"
            className={INPUT_STYLE}
          />
          <datalist id="city-suggestions">
            {citySuggestions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
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

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField<Commute>
          id="commute"
          label="Main way of getting around"
          helper="Affects outdoor exposure tips."
          value={profile.commute}
          options={COMMUTES}
          labels={COMMUTE_LABELS}
          icon={CAR_ICON}
          onChange={(value) => update("commute", value)}
        />

        <SelectField<Fuel>
          id="fuel"
          label="Cooking or heating fuel"
          helper="Affects indoor air tips."
          value={profile.fuel}
          options={FUELS}
          labels={FUEL_LABELS}
          icon={FLAME_ICON}
          onChange={(value) => update("fuel", value)}
        />
      </div>

      <div>
        <CheckboxField
          id="purifier"
          label="I have an air purifier"
          checked={profile.hasPurifier}
          onChange={(value) => update("hasPurifier", value)}
        />
      </div>

      <button type="submit" disabled={isLoading} className={SUBMIT_BUTTON_STYLE}>
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
            <svg
              className="h-5 w-5 shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M10 2l1.6 4.4L16 8l-4.4 1.6L10 14l-1.6-4.4L4 8l4.4-1.6L10 2zm8 10l1 2.8L21.8 16 19 17l-1 2.8L17 17l-2.8-1L17 14.8 18 12z" />
            </svg>
            <span>Get AI-assisted clean-air plan</span>
            <svg
              className="h-4 w-4 shrink-0"
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
