import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen, fireEvent } from "@testing-library/react";
import { ScaleSelect } from "./ScaleSelect";
import type { ScaleType } from "../../types";

const options: { value: ScaleType; label: string }[] = [
  { value: "major", label: "メジャースケール" },
  { value: "dorian", label: "ドリアン" },
  { value: "harmonic-minor", label: "ハーモニックマイナー" },
];

const groups = [
  { title: "基本", options: [options[0]] },
  { title: "マイナー派生", options: [options[2]] },
  { title: "モード", options: [options[1]] },
];

describe("ScaleSelect", () => {
  it("開くと一覧ダイアログとグループが表示される", () => {
    render(
      <ScaleSelect
        theme="dark"
        value="major"
        onChange={() => {}}
        options={options}
        groups={groups}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "メジャースケール" }));

    expect(screen.getByRole("dialog", { name: "スケール一覧" })).toBeTruthy();
    expect(screen.getByText("基本")).toBeTruthy();
    expect(screen.getByText("マイナー派生")).toBeTruthy();
    expect(screen.getByText("モード")).toBeTruthy();
  });

  it("選択すると onChange が呼ばれて閉じる", () => {
    const onChange = vi.fn();
    render(
      <ScaleSelect
        theme="light"
        value="major"
        onChange={onChange}
        options={options}
        groups={groups}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "メジャースケール" }));
    fireEvent.click(screen.getByRole("button", { name: "ドリアン" }));

    expect(onChange).toHaveBeenCalledWith("dorian");
    expect(screen.queryByRole("dialog", { name: "スケール一覧" })).toBeNull();
  });
});
