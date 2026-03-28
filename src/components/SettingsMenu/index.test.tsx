import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen, fireEvent } from "@testing-library/react";
import SettingsMenu from ".";
import type { Theme, Accidental, FretboardDisplaySize } from "../../types";

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    theme: "dark" as Theme,
    fretboardDisplaySize: "standard" as FretboardDisplaySize,
    onFretboardDisplaySizeChange: vi.fn(),
    onThemeChange: vi.fn(),
    accidental: "flat" as Accidental,
    onAccidentalChange: vi.fn(),
    showQuiz: false,
    setShowQuiz: vi.fn(),
    ...overrides,
  };
}

describe("SettingsMenu", () => {
  it("通常/クイズトグルが表示される", () => {
    render(<SettingsMenu {...makeProps()} />);
    expect(screen.getByText("通常")).toBeTruthy();
    expect(screen.getByText("クイズ")).toBeTruthy();
  });

  it("通常ボタンを押すと setShowQuiz(false) が呼ばれる", () => {
    const props = makeProps({ showQuiz: true });
    render(<SettingsMenu {...props} />);
    fireEvent.click(screen.getByText("通常"));
    expect(props.setShowQuiz).toHaveBeenCalledWith(false);
  });

  it("クイズボタンを押すと setShowQuiz(true) が呼ばれる", () => {
    const props = makeProps();
    render(<SettingsMenu {...props} />);
    fireEvent.click(screen.getByText("クイズ"));
    expect(props.setShowQuiz).toHaveBeenCalledWith(true);
  });

  it("設定ボタンをクリックするとパネルが開く", () => {
    render(<SettingsMenu {...makeProps()} />);
    fireEvent.click(screen.getByTitle("設定"));
    expect(screen.getByText("表示サイズ")).toBeTruthy();
    expect(screen.getByText("テーマ")).toBeTruthy();
    expect(screen.getByText("♯")).toBeTruthy();
    expect(screen.getByText("♭")).toBeTruthy();
  });

  it("テーマ切り替えボタンで onThemeChange が呼ばれる", () => {
    const props = makeProps();
    render(<SettingsMenu {...props} />);
    fireEvent.click(screen.getByTitle("設定"));
    // dark テーマのとき light ボタン（最初のボタン）を押すと onThemeChange が呼ばれる
    fireEvent.click(screen.getByText("テーマ").nextElementSibling!.querySelectorAll("button")[0]);
    expect(props.onThemeChange).toHaveBeenCalled();
  });

  it("臨時記号変更で onAccidentalChange が呼ばれる", () => {
    const props = makeProps();
    render(<SettingsMenu {...props} />);
    fireEvent.click(screen.getByTitle("設定"));
    fireEvent.click(screen.getByText("♯"));
    expect(props.onAccidentalChange).toHaveBeenCalledWith("sharp");

    fireEvent.click(screen.getByText("♭"));
    expect(props.onAccidentalChange).toHaveBeenCalledWith("flat");
  });
});
