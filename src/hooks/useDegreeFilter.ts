import { useState } from "react";
import { getActiveOverlaySemitones } from "../logic/fretboard";
import type { ChordDisplayMode, ChordType, DegreeName, ScaleType } from "../types";

const DEGREE_BY_SEMITONE: DegreeName[] = [
  "P1",
  "m2",
  "M2",
  "m3",
  "M3",
  "P4",
  "b5",
  "P5",
  "m6",
  "M6",
  "m7",
  "M7",
];

interface AutoFilterParams {
  rootNote: string;
  showScale: boolean;
  scaleType: ScaleType;
  showCaged: boolean;
  showChord: boolean;
  chordDisplayMode: ChordDisplayMode;
  diatonicScaleType: string;
  diatonicDegree: string;
  chordType: ChordType;
}

export function useDegreeFilter() {
  const [hiddenDegrees, setHiddenDegrees] = useState(new Set<string>());

  const handleAutoFilter = ({
    rootNote,
    showScale,
    scaleType,
    showCaged,
    showChord,
    chordDisplayMode,
    diatonicScaleType,
    diatonicDegree,
    chordType,
  }: AutoFilterParams) => {
    const active = getActiveOverlaySemitones({
      rootNote,
      showScale,
      scaleType,
      showCaged,
      showChord,
      chordDisplayMode,
      diatonicScaleType,
      diatonicDegree,
      chordType,
    });

    if (active.size === 0) {
      setHiddenDegrees(new Set());
      return;
    }

    setHiddenDegrees(new Set(DEGREE_BY_SEMITONE.filter((_, i) => !active.has(i))));
  };

  const toggleDegree = (name: string) => {
    setHiddenDegrees((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const resetHiddenDegrees = () => setHiddenDegrees(new Set());
  const hideAllDegrees = () => setHiddenDegrees(new Set(DEGREE_BY_SEMITONE));

  return {
    hiddenDegrees,
    degreeNames: DEGREE_BY_SEMITONE,
    setHiddenDegrees,
    handleAutoFilter,
    toggleDegree,
    resetHiddenDegrees,
    hideAllDegrees,
  };
}
