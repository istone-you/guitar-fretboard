import { describe, it, expect } from "vite-plus/test";
import { fireEvent, render, screen } from "@testing-library/react";
import { DropdownPanelSelect } from "./DropdownPanelSelect";

describe("DropdownPanelSelect", () => {
  it("開いてパネルを表示できる", () => {
    render(
      <DropdownPanelSelect theme="dark" label="Scale" dialogLabel="scale-dialog">
        <div>panel-content</div>
      </DropdownPanelSelect>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Scale" }));

    expect(screen.getByRole("dialog", { name: "scale-dialog" })).toBeTruthy();
    expect(screen.getByText("panel-content")).toBeTruthy();
  });

  it("disabled のとき開かない", () => {
    render(
      <DropdownPanelSelect theme="dark" label="Scale" dialogLabel="scale-dialog" disabled>
        <div>panel-content</div>
      </DropdownPanelSelect>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Scale" }));

    expect(screen.queryByRole("dialog", { name: "scale-dialog" })).toBeNull();
  });

  it("外側クリックで閉じる", () => {
    render(
      <DropdownPanelSelect theme="dark" label="Scale" dialogLabel="scale-dialog">
        <div>panel-content</div>
      </DropdownPanelSelect>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Scale" }));
    fireEvent.click(document.querySelector(".fixed.inset-0.z-20")!);

    expect(screen.queryByRole("dialog", { name: "scale-dialog" })).toBeNull();
  });
});
