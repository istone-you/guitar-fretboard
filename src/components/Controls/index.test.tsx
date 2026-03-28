import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen, fireEvent } from "@testing-library/react";
import Controls from ".";
import { DropdownSelect } from "../ui/DropdownSelect";
import type { Theme, Accidental, ChordDisplayMode, ScaleType, ChordType } from "../../types";

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    theme: "dark" as Theme,
    rootNote: "C",
    accidental: "flat" as Accidental,
    showChord: false,
    setShowChord: vi.fn(),
    chordDisplayMode: "form" as ChordDisplayMode,
    setChordDisplayMode: vi.fn(),
    showScale: false,
    setShowScale: vi.fn(),
    scaleType: "major" as ScaleType,
    setScaleType: vi.fn(),
    showCaged: false,
    setShowCaged: vi.fn(),
    cagedForms: new Set(["E"]),
    toggleCagedForm: vi.fn(),
    chordType: "Major" as ChordType,
    setChordType: vi.fn(),
    triadStringSet: "1-3",
    setTriadStringSet: vi.fn(),
    triadInversion: "root",
    setTriadInversion: vi.fn(),
    diatonicKeyType: "major",
    setDiatonicKeyType: vi.fn(),
    diatonicChordSize: "triad",
    setDiatonicChordSize: vi.fn(),
    diatonicDegree: "I",
    setDiatonicDegree: vi.fn(),
    showQuiz: false,
    ...overrides,
  };
}

describe("Controls", () => {
  // ===== レンダリング =====
  it("スケール・CAGED・コードのラベルが表示される", () => {
    render(<Controls {...makeProps()} />);
    expect(screen.getByText("スケール")).toBeTruthy();
    expect(screen.getByText("CAGED")).toBeTruthy();
    expect(screen.getAllByText("コード").length).toBeGreaterThan(0);
  });

  it("ライトテーマでも表示できる", () => {
    render(<Controls {...makeProps({ theme: "light" as Theme })} />);
    expect(screen.getByText("スケール")).toBeTruthy();
  });

  it("スケール選択を開くと一覧で候補が見える", () => {
    render(<Controls {...makeProps()} />);

    fireEvent.click(screen.getByRole("button", { name: "メジャースケール" }));

    expect(screen.getByRole("dialog", { name: "スケール一覧" })).toBeTruthy();
    expect(screen.getByText("基本")).toBeTruthy();
    expect(screen.getByText("マイナー派生")).toBeTruthy();
    expect(screen.getByText("モード")).toBeTruthy();
    expect(screen.getByRole("button", { name: "ハーモニックマイナー" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "ロクリアン" })).toBeTruthy();
  });

  it("スケール一覧から選ぶと setScaleType が呼ばれて閉じる", () => {
    const props = makeProps();
    render(<Controls {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "メジャースケール" }));
    fireEvent.click(screen.getByRole("button", { name: "メロディックマイナー" }));

    expect(props.setScaleType).toHaveBeenCalledWith("melodic-minor");
    expect(screen.queryByRole("dialog", { name: "スケール一覧" })).toBeNull();
  });

  // ===== レイヤートグル =====
  it("スケールパネルをクリックすると setShowScale が呼ばれる", () => {
    const props = makeProps();
    render(<Controls {...props} />);
    // LayerRow の div をクリック（ラベル span の親）
    const label = screen.getByText("スケール");
    fireEvent.click(label.closest('div[class*="rounded-lg"]')!);
    expect(props.setShowScale).toHaveBeenCalled();
  });

  it("CAGEDパネルをクリックすると setShowCaged が呼ばれる", () => {
    const props = makeProps();
    render(<Controls {...props} />);
    const label = screen.getByText("CAGED");
    fireEvent.click(label.closest('div[class*="rounded-lg"]')!);
    expect(props.setShowCaged).toHaveBeenCalled();
  });

  it("コードパネルをクリックすると setShowChord が呼ばれる", () => {
    const props = makeProps();
    render(<Controls {...props} />);
    const labels = screen.getAllByText("コード");
    // LayerRow の span badge を探してその親パネルをクリック
    const badge = labels.find((el) => el.tagName === "SPAN");
    fireEvent.click(badge!.closest('div[class*="rounded-lg"]')!);
    expect(props.setShowChord).toHaveBeenCalled();
  });

  // ===== CAGEDフォームボタン =====
  it("CAGEDフォームのボタン C/A/G/E/D が表示される", () => {
    const props = makeProps({ showCaged: true });
    render(<Controls {...props} />);
    // C/A/G/E/D は丸ボタン（w-9 h-9）として存在する
    ["C", "A", "G", "E", "D"].forEach((key) => {
      expect(screen.getAllByText(key).length).toBeGreaterThan(0);
    });
  });

  it("CAGEDフォームボタンをクリックすると toggleCagedForm が呼ばれる", () => {
    const props = makeProps({ showCaged: true });
    render(<Controls {...props} />);
    // 丸ボタン（w-9 h-9）の C を探してクリック
    const allC = screen.getAllByText("C");
    const cagedBtn = allC.find((el) => el.tagName === "BUTTON" && el.className.includes("w-9"));
    fireEvent.click(cagedBtn!);
    expect(props.toggleCagedForm).toHaveBeenCalledWith("C");
  });

  it("開いているパネル本体をクリックするとトグルが呼ばれる", () => {
    const props = makeProps({ showScale: true });
    render(<Controls {...props} />);
    const label = screen.getByText("スケール");
    fireEvent.click(label.closest('div[class*="rounded-lg"]')!);
    expect(props.setShowScale).toHaveBeenCalledWith(false);
  });

  it("アクティブなコードパネル内のボタン操作ではパネルトグルしない", () => {
    const props = makeProps({ showChord: true });
    render(<Controls {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "コードフォーム" }));
    expect(props.setShowChord).not.toHaveBeenCalled();
  });

  it("ダイアトニックモードではキーと和音設定のドロップダウンが機能する", () => {
    const props = makeProps({ showChord: true, chordDisplayMode: "diatonic" as ChordDisplayMode });
    render(<Controls {...props} />);

    fireEvent.click(screen.getAllByRole("button", { name: "メジャー" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "マイナー" }));
    expect(props.setDiatonicKeyType).toHaveBeenCalledWith("natural-minor");

    fireEvent.click(screen.getByRole("button", { name: "3和音" }));
    fireEvent.click(screen.getByRole("button", { name: "4和音" }));
    expect(props.setDiatonicChordSize).toHaveBeenCalledWith("seventh");
  });

  it("プルダウン外クリックで閉じても親パネルは非活性化しない", () => {
    const props = makeProps({ showChord: true, chordDisplayMode: "diatonic" as ChordDisplayMode });
    render(<Controls {...props} />);

    fireEvent.click(screen.getAllByRole("button", { name: "メジャー" })[0]);
    fireEvent.click(document.querySelector(".fixed.inset-0.z-20")!);

    expect(props.setShowChord).not.toHaveBeenCalled();
  });

  it("トライアドモードでは弦と転回のドロップダウンが機能する", () => {
    const props = makeProps({ showChord: true, chordDisplayMode: "triad" as ChordDisplayMode });
    render(<Controls {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "1~3" }));
    fireEvent.click(screen.getByRole("button", { name: "2~4" }));
    expect(props.setTriadStringSet).toHaveBeenCalledWith("2-4");

    fireEvent.click(screen.getByRole("button", { name: "基本" }));
    fireEvent.click(screen.getByRole("button", { name: "第一転回" }));
    expect(props.setTriadInversion).toHaveBeenCalledWith("first");
  });
});

describe("DropdownSelect", () => {
  const options = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta" },
  ];

  it("開いて選択すると onChange が呼ばれて閉じる", () => {
    const onChange = vi.fn();
    render(<DropdownSelect theme="dark" value="a" onChange={onChange} options={options} />);

    fireEvent.click(screen.getByRole("button", { name: "Alpha" }));
    fireEvent.click(screen.getByRole("button", { name: "Beta" }));

    expect(onChange).toHaveBeenCalledWith("b");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("disabled のときは開かない", () => {
    const onChange = vi.fn();
    render(
      <DropdownSelect theme="light" value="a" onChange={onChange} options={options} disabled />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Alpha" }));

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("keepOpen のときは選択後も開いたまま", () => {
    const onChange = vi.fn();
    render(
      <DropdownSelect theme="light" value="a" onChange={onChange} options={options} keepOpen />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Alpha" }));
    fireEvent.click(screen.getByRole("button", { name: "Beta" }));

    expect(onChange).toHaveBeenCalledWith("b");
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  it("オーバーレイをクリックすると閉じる", () => {
    const onChange = vi.fn();
    render(<DropdownSelect theme="dark" value="a" onChange={onChange} options={options} />);

    fireEvent.click(screen.getByRole("button", { name: "Alpha" }));
    fireEvent.click(document.querySelector(".fixed.inset-0.z-20")!);

    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("value が options にない場合は先頭要素を表示する", () => {
    const onChange = vi.fn();
    render(<DropdownSelect theme="light" value="z" onChange={onChange} options={options} />);

    expect(screen.getByRole("button", { name: "Alpha" })).toBeTruthy();
  });
});
