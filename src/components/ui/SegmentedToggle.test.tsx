import { describe, it, expect, vi } from "vite-plus/test";
import { fireEvent, render, screen } from "@testing-library/react";
import { SegmentedToggle } from "./SegmentedToggle";

describe("SegmentedToggle", () => {
  it("選択中の値を aria-pressed に反映する", () => {
    render(
      <SegmentedToggle
        theme="dark"
        value="a"
        onChange={() => {}}
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "A" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "B" }).getAttribute("aria-pressed")).toBe("false");
  });

  it("クリックで onChange を呼ぶ", () => {
    const onChange = vi.fn();
    render(
      <SegmentedToggle
        theme="light"
        value={false}
        onChange={onChange}
        options={[
          { value: false, label: "Off" },
          { value: true, label: "On" },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "On" }));

    expect(onChange).toHaveBeenCalledWith(true);
  });
});
