import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen, fireEvent } from "@testing-library/react";
import { DropdownButton } from "./DropdownButton";

describe("DropdownButton", () => {
  it("ラベルを表示してクリック時に onClick を呼ぶ", () => {
    const onClick = vi.fn();
    render(<DropdownButton theme="dark" label="Scale" open={false} onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Scale" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disabled のときは onClick を呼ばない", () => {
    const onClick = vi.fn();
    render(<DropdownButton theme="light" label="Scale" open={false} onClick={onClick} disabled />);

    fireEvent.click(screen.getByRole("button", { name: "Scale" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("open 状態を aria-expanded に反映する", () => {
    render(<DropdownButton theme="dark" label="Scale" open onClick={() => {}} />);

    expect(screen.getByRole("button", { name: "Scale" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });
});
