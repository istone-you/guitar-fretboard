import { useCallback, useEffect, useState } from "react";
import {
  NOTES_SHARP,
  NOTES_FLAT,
  getDegreeName,
  getNoteIndex,
  getRootIndex,
} from "../logic/fretboard";
import type { Accidental } from "../types";
import type { QuizMode, QuizQuestion, QuizType } from "../components/QuizPanel/index";

const DEGREE_NAMES = ["P1", "m2", "M2", "m3", "M3", "P4", "b5", "P5", "m6", "M6", "m7", "M7"];

interface UseQuizParams {
  accidental: Accidental;
  fretRange: [number, number];
  rootNote: string;
  showQuiz: boolean;
}

export function useQuiz({ accidental, fretRange, rootNote, showQuiz }: UseQuizParams) {
  const [quizMode, setQuizMode] = useState<QuizMode>("note");
  const [quizType, setQuizType] = useState<QuizType>("choice");
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [quizAnsweredCell, setQuizAnsweredCell] = useState<{
    stringIdx: number;
    fret: number;
  } | null>(null);
  const [quizCorrectFret, setQuizCorrectFret] = useState<number | null>(null);

  const generateQuizQuestion = useCallback(
    (mode: QuizMode, type: QuizType = "choice"): QuizQuestion => {
      const notes = accidental === "sharp" ? NOTES_SHARP : NOTES_FLAT;
      const stringIdx = Math.floor(Math.random() * 6);
      const fret = fretRange[0] + Math.floor(Math.random() * (fretRange[1] - fretRange[0] + 1));
      const noteIdx = getNoteIndex(stringIdx, fret);
      const rootIdx = getRootIndex(rootNote);

      if (type === "fretboard") {
        const correct = mode === "note" ? notes[noteIdx] : getDegreeName(noteIdx, rootIdx);
        return { stringIdx, fret, correct, choices: [] };
      }

      if (mode === "note") {
        const correct = notes[noteIdx];
        const pool = notes.filter((note) => note !== correct).sort(() => Math.random() - 0.5);
        const choices = [...pool.slice(0, 3), correct].sort(() => Math.random() - 0.5);
        return { stringIdx, fret, correct, choices };
      }

      const correct = getDegreeName(noteIdx, rootIdx);
      const pool = DEGREE_NAMES.filter((degree) => degree !== correct).sort(
        () => Math.random() - 0.5,
      );
      const choices = [...pool.slice(0, 3), correct].sort(() => Math.random() - 0.5);
      return { stringIdx, fret, correct, choices };
    },
    [accidental, fretRange, rootNote],
  );

  const resetQuizProgress = useCallback(() => {
    setSelectedAnswer(null);
    setQuizAnsweredCell(null);
    setQuizCorrectFret(null);
    setQuizScore({ correct: 0, total: 0 });
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

  const handleQuizAnswer = useCallback(
    (answer: string) => {
      if (selectedAnswer !== null || quizQuestion === null) return;
      const isCorrect = answer === quizQuestion.correct;
      setSelectedAnswer(answer);
      setQuizScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));
    },
    [selectedAnswer, quizQuestion],
  );

  const handleFretboardQuizAnswer = useCallback(
    (stringIdx: number, fret: number) => {
      if (!showQuiz || quizType !== "fretboard" || selectedAnswer !== null || quizQuestion === null)
        return;

      const notes = accidental === "sharp" ? NOTES_SHARP : NOTES_FLAT;
      const rootIdx = getRootIndex(rootNote);
      const clickedNoteIdx = getNoteIndex(stringIdx, fret);
      const isCorrect =
        quizMode === "note"
          ? notes[clickedNoteIdx] === quizQuestion.correct
          : getDegreeName(clickedNoteIdx, rootIdx) === quizQuestion.correct;

      setQuizAnsweredCell({ stringIdx, fret });
      setQuizCorrectFret(isCorrect ? fret : quizQuestion.fret);
      setSelectedAnswer(isCorrect ? quizQuestion.correct : notes[clickedNoteIdx]);
      setQuizScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));
    },
    [showQuiz, quizType, selectedAnswer, quizQuestion, accidental, rootNote, quizMode],
  );

  useEffect(() => {
    if (selectedAnswer === null || quizQuestion === null) return;
    const timer = window.setTimeout(() => {
      setSelectedAnswer(null);
      setQuizAnsweredCell(null);
      setQuizCorrectFret(null);
      setQuizQuestion(generateQuizQuestion(quizMode, quizType));
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [generateQuizQuestion, quizMode, quizQuestion, quizType, selectedAnswer]);

  useEffect(() => {
    if (showQuiz && quizQuestion === null) {
      startQuiz();
    }
    if (!showQuiz) {
      setQuizQuestion(null);
      setSelectedAnswer(null);
      setQuizAnsweredCell(null);
      setQuizCorrectFret(null);
    }
  }, [quizQuestion, showQuiz, startQuiz]);

  return {
    quizMode,
    quizType,
    quizQuestion,
    selectedAnswer,
    quizScore,
    quizAnsweredCell,
    quizCorrectFret,
    setQuizMode,
    setQuizType,
    setQuizQuestion,
    handleQuizModeChange,
    handleQuizTypeChange,
    handleQuizAnswer,
    handleFretboardQuizAnswer,
  };
}
