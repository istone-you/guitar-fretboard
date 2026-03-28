import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen, fireEvent } from "@testing-library/react";
import { DropdownSelect } from "./DropdownSelect";

const options = [
  { value: "major", label: "Major" },
  { value: "minor", label: "Minor" },
];

describe("DropdownSelect", () => {
  it("開いて選ぶと onChange が呼ばれて閉じる", () => {
    const onChange = vi.fn();
    render(<DropdownSelect theme="dark" value="major" onChange={onChange} options={options} />);

    fireEvent.click(screen.getByRole("button", { name: "Major" }));
    fireEvent.click(screen.getByRole("button", { name: "Minor" }));

    expect(onChange).toHaveBeenCalledWith("minor");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("disabled のときは開かない", () => {
    render(
      <DropdownSelect theme="light" value="major" onChange={() => {}} options={options} disabled />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Major" }));

    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("keepOpen のときは選択後も開いたまま", () => {
    const onChange = vi.fn();
    render(
      <DropdownSelect theme="light" value="major" onChange={onChange} options={options} keepOpen />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Major" }));
    fireEvent.click(screen.getByRole("button", { name: "Minor" }));

    expect(onChange).toHaveBeenCalledWith("minor");
    expect(screen.getByRole("listbox")).toBeTruthy();
  });
});
