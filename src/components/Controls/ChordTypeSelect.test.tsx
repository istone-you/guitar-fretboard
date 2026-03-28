import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChordTypeSelect } from "./ChordTypeSelect";
import type { ChordType } from "../../types";

const options: { value: ChordType; label: string }[] = [
  { value: "Major", label: "Major" },
  { value: "m7", label: "m7" },
  { value: "sus4", label: "sus4" },
];

describe("ChordTypeSelect", () => {
  it("開くとコード一覧が表示される", () => {
    render(<ChordTypeSelect theme="dark" value="Major" onChange={() => {}} options={options} />);

    fireEvent.click(screen.getByRole("button", { name: "Major" }));

    expect(screen.getByRole("dialog", { name: "和音" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "m7" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "sus4" })).toBeTruthy();
  });

  it("選択すると onChange が呼ばれて閉じる", () => {
    const onChange = vi.fn();
    render(<ChordTypeSelect theme="light" value="Major" onChange={onChange} options={options} />);

    fireEvent.click(screen.getByRole("button", { name: "Major" }));
    fireEvent.click(screen.getByRole("button", { name: "sus4" }));

    expect(onChange).toHaveBeenCalledWith("sus4");
    expect(screen.queryByRole("dialog", { name: "和音" })).toBeNull();
  });
});
