import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen, fireEvent } from "@testing-library/react";
import AppHeader from ".";
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

describe("AppHeader", () => {
  it("通常/クイズタブが表示される", () => {
    render(<AppHeader {...makeProps()} />);
    expect(screen.getByText("通常")).toBeTruthy();
    expect(screen.getByText("クイズ")).toBeTruthy();
  });

  it("通常タブを押すと setShowQuiz(false) が呼ばれる", () => {
    const props = makeProps({ showQuiz: true });
    render(<AppHeader {...props} />);
    fireEvent.click(screen.getByText("通常"));
    expect(props.setShowQuiz).toHaveBeenCalledWith(false);
  });

  it("クイズタブを押すと setShowQuiz(true) が呼ばれる", () => {
    const props = makeProps();
    render(<AppHeader {...props} />);
    fireEvent.click(screen.getByText("クイズ"));
    expect(props.setShowQuiz).toHaveBeenCalledWith(true);
  });

  it("設定ボタンをクリックするとパネルが開く", () => {
    render(<AppHeader {...makeProps()} />);
    fireEvent.click(screen.getByTitle("設定"));
    expect(screen.getByText("表示サイズ")).toBeTruthy();
    expect(screen.getByText("テーマ")).toBeTruthy();
    expect(screen.getByText("♯")).toBeTruthy();
    expect(screen.getByText("♭")).toBeTruthy();
  });

  it("テーマ切り替えボタンで onThemeChange が呼ばれる", () => {
    const props = makeProps();
    render(<AppHeader {...props} />);
    fireEvent.click(screen.getByTitle("設定"));
    // dark テーマのとき light ボタン（最初のボタン）を押すと onThemeChange が呼ばれる
    fireEvent.click(screen.getByText("テーマ").nextElementSibling!.querySelectorAll("button")[0]);
    expect(props.onThemeChange).toHaveBeenCalled();
  });

  it("臨時記号変更で onAccidentalChange が呼ばれる", () => {
    const props = makeProps();
    render(<AppHeader {...props} />);
    fireEvent.click(screen.getByTitle("設定"));
    fireEvent.click(screen.getByText("♯"));
    expect(props.onAccidentalChange).toHaveBeenCalledWith("sharp");

    fireEvent.click(screen.getByText("♭"));
    expect(props.onAccidentalChange).toHaveBeenCalledWith("flat");
  });
});
