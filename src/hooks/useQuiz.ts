import { useCallback, useEffect, useRef, useState } from "react";
import {
  NOTES_SHARP,
  NOTES_FLAT,
  SEMITONE_TO_DEGREE,
  CHORD_SEMITONES,
  getDegreeName,
  getNoteIndex,
  getRootIndex,
} from "../logic/fretboard";
import type { Accidental, ChordType } from "../types";
import type { QuizMode, QuizQuestion, QuizType } from "../components/QuizPanel/index";

const DEGREE_NAMES = ["P1", "m2", "M2", "m3", "M3", "P4", "b5", "P5", "m6", "M6", "m7", "M7"];

export const CHORD_QUIZ_TYPES_ALL: ChordType[] = [
  "Major",
  "Minor",
  "7th",
  "maj7",
  "m7",
  "m7(b5)",
  "dim7",
  "m(maj7)",
  "sus2",
  "sus4",
  "6",
  "m6",
  "dim",
  "aug",
];

const CHORD_SUFFIX_MAP: Record<ChordType, string> = {
  Major: "",
  Minor: "m",
  "7th": "7",
  maj7: "maj7",
  m7: "m7",
  "m7(b5)": "m7(b5)",
  dim7: "dim7",
  "m(maj7)": "m(maj7)",
  sus2: "sus2",
  sus4: "sus4",
  "6": "6",
  m6: "m6",
  dim: "dim",
  aug: "aug",
};

interface UseQuizParams {
  accidental: Accidental;
  fretRange: [number, number];
  rootNote: string;
  showQuiz: boolean;
  chordQuizTypes: ChordType[];
}

export function useQuiz({
  accidental,
  fretRange,
  rootNote,
  showQuiz,
  chordQuizTypes,
}: UseQuizParams) {
  const [quizMode, setQuizMode] = useState<QuizMode>("note");
  const [quizType, setQuizType] = useState<QuizType>("choice");
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [quizAnsweredCell, setQuizAnsweredCell] = useState<{
    stringIdx: number;
    fret: number;
  } | null>(null);
  const [quizCorrectCell, setQuizCorrectCell] = useState<{
    stringIdx: number;
    fret: number;
  } | null>(null);
  const [quizSelectedCells, setQuizSelectedCells] = useState<{ stringIdx: number; fret: number }[]>(
    [],
  );
  const [quizSelectedChoices, setQuizSelectedChoices] = useState<string[]>([]);
  const [quizRevealNoteNames, setQuizRevealNoteNames] = useState<string[] | null>(null);
  const chordQuizTypesKey = chordQuizTypes.join("|");
  const previousChordQuizTypesKeyRef = useRef(chordQuizTypesKey);

  const generateQuizQuestion = useCallback(
    (mode: QuizMode, type: QuizType = "choice"): QuizQuestion => {
      const notes = accidental === "sharp" ? NOTES_SHARP : NOTES_FLAT;
      const stringIdx = Math.floor(Math.random() * 6);
      const fret = fretRange[0] + Math.floor(Math.random() * (fretRange[1] - fretRange[0] + 1));
      const noteIdx = getNoteIndex(stringIdx, fret);
      const rootIdx = getRootIndex(rootNote);

      if (mode === "chord") {
        const chordRootIndex = Math.floor(Math.random() * 12);
        const availableChordQuizTypes: ChordType[] =
          chordQuizTypes.length > 0 ? chordQuizTypes : ["Major"];
        const chordType =
          availableChordQuizTypes[Math.floor(Math.random() * availableChordQuizTypes.length)];
        const chordSemitones = [...(CHORD_SEMITONES[chordType] ?? new Set<number>())];
        const correctNoteNames = chordSemitones.map(
          (semitone) => notes[(chordRootIndex + semitone) % 12],
        );
        const promptChordLabel = `${notes[chordRootIndex]}${CHORD_SUFFIX_MAP[chordType]}`;
        const matchingCells: { stringIdx: number; fret: number }[] = [];

        for (let currentStringIdx = 0; currentStringIdx < 6; currentStringIdx += 1) {
          for (let currentFret = fretRange[0]; currentFret <= fretRange[1]; currentFret += 1) {
            if (correctNoteNames.includes(notes[getNoteIndex(currentStringIdx, currentFret)])) {
              matchingCells.push({ stringIdx: currentStringIdx, fret: currentFret });
            }
          }
        }

        const targetCell = matchingCells[Math.floor(Math.random() * matchingCells.length)];
        return {
          stringIdx: targetCell?.stringIdx ?? stringIdx,
          fret: targetCell?.fret ?? fret,
          correct: correctNoteNames[0] ?? "",
          choices: type === "choice" ? [...notes] : [],
          answerLabel: correctNoteNames.join(" / "),
          promptChordLabel,
          correctNoteNames,
        };
      }

      if (mode === "relative") {
        const promptRootIndex = Math.floor(Math.random() * 12);
        const promptRoot = notes[promptRootIndex];
        const promptDegree =
          SEMITONE_TO_DEGREE[1 + Math.floor(Math.random() * (SEMITONE_TO_DEGREE.length - 1))];
        const degreeSemitone = SEMITONE_TO_DEGREE.indexOf(promptDegree);
        const correctIndex = (promptRootIndex + degreeSemitone) % 12;
        const correct = notes[correctIndex];

        if (type === "fretboard") {
          const matchingCells: { stringIdx: number; fret: number }[] = [];
          for (let currentStringIdx = 0; currentStringIdx < 6; currentStringIdx += 1) {
            for (let currentFret = fretRange[0]; currentFret <= fretRange[1]; currentFret += 1) {
              if (getNoteIndex(currentStringIdx, currentFret) === correctIndex) {
                matchingCells.push({ stringIdx: currentStringIdx, fret: currentFret });
              }
            }
          }
          const targetCell = matchingCells[Math.floor(Math.random() * matchingCells.length)];
          return {
            stringIdx: targetCell.stringIdx,
            fret: targetCell.fret,
            correct,
            choices: [],
            promptRoot,
            promptDegree,
          };
        }

        const choices = [...notes];
        return {
          stringIdx,
          fret,
          correct,
          choices,
          promptRoot,
          promptDegree,
        };
      }

      if (type === "fretboard") {
        const correct = mode === "note" ? notes[noteIdx] : getDegreeName(noteIdx, rootIdx);
        return { stringIdx, fret, correct, choices: [] };
      }

      if (mode === "note") {
        const correct = notes[noteIdx];
        const choices = [...notes];
        return { stringIdx, fret, correct, choices };
      }

      const correct = getDegreeName(noteIdx, rootIdx);
      const choices = DEGREE_NAMES;
      return { stringIdx, fret, correct, choices };
    },
    [accidental, chordQuizTypes, fretRange, rootNote],
  );

  const resetQuizProgress = useCallback(() => {
    setSelectedAnswer(null);
    setQuizAnsweredCell(null);
    setQuizCorrectCell(null);
    setQuizSelectedCells([]);
    setQuizSelectedChoices([]);
    setQuizRevealNoteNames(null);
    setQuizScore({ correct: 0, total: 0 });
  }, []);

  const clearCurrentQuizState = useCallback(() => {
    setSelectedAnswer(null);
    setQuizAnsweredCell(null);
    setQuizCorrectCell(null);
    setQuizSelectedCells([]);
    setQuizSelectedChoices([]);
    setQuizRevealNoteNames(null);
  }, []);

  const startQuiz = useCallback(() => {
    resetQuizProgress();
    setQuizQuestion(generateQuizQuestion(quizMode, quizType));
  }, [generateQuizQuestion, quizMode, quizType, resetQuizProgress]);

  const handleQuizModeChange = useCallback(
    (mode: QuizMode) => {
      setQuizMode(mode);
      resetQuizProgress();
      setQuizQuestion(generateQuizQuestion(mode, quizType));
    },
    [generateQuizQuestion, quizType, resetQuizProgress],
  );

  const handleQuizTypeChange = useCallback(
    (type: QuizType) => {
      setQuizType(type);
      resetQuizProgress();
      setQuizQuestion(generateQuizQuestion(quizMode, type));
    },
    [generateQuizQuestion, quizMode, resetQuizProgress],
  );

  const handleQuizKindChange = useCallback(
    (mode: QuizMode, type: QuizType) => {
      setQuizMode(mode);
      setQuizType(type);
      resetQuizProgress();
      setQuizQuestion(generateQuizQuestion(mode, type));
    },
    [generateQuizQuestion, resetQuizProgress],
  );

  const handleQuizAnswer = useCallback(
    (answer: string) => {
      if (selectedAnswer !== null || quizQuestion === null) return;

      if (quizMode === "chord" && quizType === "choice") {
        const correctNoteNames = quizQuestion.correctNoteNames ?? [];
        const isCorrectNote = correctNoteNames.includes(answer);

        if (!isCorrectNote) {
          setSelectedAnswer(answer);
          setQuizScore((prev) => ({
            correct: prev.correct,
            total: prev.total + 1,
          }));
          return;
        }

        const nextSelectedChoices = quizSelectedChoices.includes(answer)
          ? quizSelectedChoices
          : [...quizSelectedChoices, answer];
        setQuizSelectedChoices(nextSelectedChoices);

        const completed = correctNoteNames.every((noteName) =>
          nextSelectedChoices.includes(noteName),
        );
        if (completed) {
          setSelectedAnswer(quizQuestion.correct);
          setQuizScore((prev) => ({
            correct: prev.correct + 1,
            total: prev.total + 1,
          }));
        }
        return;
      }

      const isCorrect = answer === quizQuestion.correct;
      setSelectedAnswer(answer);
      setQuizScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));
    },
    [quizMode, quizQuestion, quizSelectedChoices, quizType, selectedAnswer],
  );

  const handleFretboardQuizAnswer = useCallback(
    (stringIdx: number, fret: number) => {
      if (!showQuiz || quizType !== "fretboard" || selectedAnswer !== null || quizQuestion === null)
        return;

      const notes = accidental === "sharp" ? NOTES_SHARP : NOTES_FLAT;
      const rootIdx = getRootIndex(rootNote);
      const clickedNoteIdx = getNoteIndex(stringIdx, fret);

      if (quizMode === "chord") {
        const clickedNoteName = notes[clickedNoteIdx];
        const correctNoteNames = quizQuestion.correctNoteNames ?? [];
        const isCorrectNote = correctNoteNames.includes(clickedNoteName);

        if (!isCorrectNote) {
          setQuizAnsweredCell({ stringIdx, fret });
          setQuizCorrectCell(null);
          setQuizRevealNoteNames(correctNoteNames);
          setSelectedAnswer(clickedNoteName);
          setQuizScore((prev) => ({
            correct: prev.correct,
            total: prev.total + 1,
          }));
          return;
        }

        const nextSelectedCells = [
          ...quizSelectedCells,
          ...(quizSelectedCells.some((cell) => cell.stringIdx === stringIdx && cell.fret === fret)
            ? []
            : [{ stringIdx, fret }]),
        ];
        const selectedNoteNames = new Set<string>(
          nextSelectedCells.map((cell) => notes[getNoteIndex(cell.stringIdx, cell.fret)]),
        );
        setQuizSelectedCells(nextSelectedCells);

        const completed = correctNoteNames.every((noteName) => selectedNoteNames.has(noteName));
        if (completed) {
          setQuizRevealNoteNames(correctNoteNames);
          setSelectedAnswer(quizQuestion.correct);
          setQuizScore((prev) => ({
            correct: prev.correct + 1,
            total: prev.total + 1,
          }));
        }
        return;
      }

      const isCorrect =
        quizMode === "note" || quizMode === "relative"
          ? notes[clickedNoteIdx] === quizQuestion.correct
          : getDegreeName(clickedNoteIdx, rootIdx) === quizQuestion.correct;

      setQuizAnsweredCell({ stringIdx, fret });
      setQuizCorrectCell(
        isCorrect
          ? { stringIdx, fret }
          : { stringIdx: quizQuestion.stringIdx, fret: quizQuestion.fret },
      );
      setSelectedAnswer(isCorrect ? quizQuestion.correct : notes[clickedNoteIdx]);
      setQuizScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));
    },
    [
      showQuiz,
      quizType,
      selectedAnswer,
      quizQuestion,
      accidental,
      rootNote,
      quizMode,
      quizSelectedCells,
    ],
  );

  const handleNextQuestion = useCallback(() => {
    if (quizQuestion === null) return;
    clearCurrentQuizState();
    setQuizQuestion(generateQuizQuestion(quizMode, quizType));
  }, [clearCurrentQuizState, generateQuizQuestion, quizMode, quizQuestion, quizType]);

  useEffect(() => {
    if (previousChordQuizTypesKeyRef.current === chordQuizTypesKey) return;
    previousChordQuizTypesKeyRef.current = chordQuizTypesKey;
    if (!showQuiz || quizQuestion === null) return;
    if (quizMode !== "chord") return;

    clearCurrentQuizState();
    setQuizQuestion(generateQuizQuestion(quizMode, quizType));
  }, [
    chordQuizTypesKey,
    clearCurrentQuizState,
    generateQuizQuestion,
    quizMode,
    quizQuestion,
    quizType,
    showQuiz,
  ]);

  useEffect(() => {
    if (showQuiz && quizQuestion === null) {
      startQuiz();
    }
    if (!showQuiz) {
      setQuizQuestion(null);
      clearCurrentQuizState();
    }
  }, [clearCurrentQuizState, quizQuestion, showQuiz, startQuiz]);

  return {
    quizMode,
    quizType,
    quizQuestion,
    selectedAnswer,
    quizScore,
    quizAnsweredCell,
    quizCorrectCell,
    quizSelectedCells,
    quizSelectedChoices,
    quizRevealNoteNames,
    setQuizMode,
    setQuizType,
    setQuizQuestion,
    handleQuizModeChange,
    handleQuizTypeChange,
    handleQuizKindChange,
    handleQuizAnswer,
    handleFretboardQuizAnswer,
    handleNextQuestion,
  };
}
