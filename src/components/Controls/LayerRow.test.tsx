import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen, fireEvent } from "@testing-library/react";
import { LayerRow } from "./LayerRow";

describe("LayerRow", () => {
  it("非アクティブ時はパネルクリックで onToggle を呼ぶ", () => {
    const onToggle = vi.fn();
    render(
      <LayerRow
        label="スケール"
        color="bg-emerald-600"
        active={false}
        onToggle={onToggle}
        theme="dark"
      >
        <div>Body</div>
      </LayerRow>,
    );

    fireEvent.click(screen.getByText("スケール").closest("div[class*='rounded-lg']")!);

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("アクティブ時はボタン以外のクリックで onToggle を呼ぶ", () => {
    const onToggle = vi.fn();
    render(
      <LayerRow label="スケール" color="bg-emerald-600" active onToggle={onToggle} theme="light">
        <div>Body</div>
      </LayerRow>,
    );

    fireEvent.click(screen.getByText("Body"));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("アクティブ時は子ボタンのクリックで onToggle を呼ばない", () => {
    const onToggle = vi.fn();
    render(
      <LayerRow label="スケール" color="bg-emerald-600" active onToggle={onToggle} theme="dark">
        <button type="button">Inner</button>
      </LayerRow>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Inner" }));

    expect(onToggle).not.toHaveBeenCalled();
  });
});
