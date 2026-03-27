import { describe, it, expect } from "vite-plus/test";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  // ===== 表示切り替え =====
  it("音名/度数トグルが表示される", () => {
    render(<App />);
    expect(screen.getByText("音名")).toBeTruthy();
    expect(screen.getByText("度数")).toBeTruthy();
  });

  it("度数ボタンをクリックすると絞り込むボタンが表示される", () => {
    render(<App />);
    fireEvent.click(screen.getByText("度数"));
    expect(screen.getByText("絞り込む")).toBeTruthy();
  });

  it("音名ボタンをクリックすると度数セクションが非表示になる", () => {
    render(<App />);
    fireEvent.click(screen.getByText("度数"));
    fireEvent.click(screen.getByText("音名"));
    expect(screen.queryByText("絞り込む")).toBeNull();
  });
});
