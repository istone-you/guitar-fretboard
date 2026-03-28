import Fretboard, { type FretboardProps } from "../ui/Fretboard";

export type { FretboardProps } from "../ui/Fretboard";

export default function QuizFretboard(props: FretboardProps) {
  return (
    <Fretboard
      {...props}
      showChord={false}
      showScale={false}
      showCaged={false}
      hiddenDegrees={new Set()}
      suppressRegularDisplay
    />
  );
}
