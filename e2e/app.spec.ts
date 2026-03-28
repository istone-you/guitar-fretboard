import { expect, test, type Locator, type Page } from "@playwright/test";

async function click(locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
  await locator.click();
}

async function activateLayer(page: Page, label: string) {
  await click(page.getByText(label, { exact: true }).first());
}

async function selectFromDialog(
  page: Page,
  triggerName: string,
  dialogName: string,
  optionName: string,
) {
  await click(page.getByRole("button", { name: triggerName, exact: true }));
  await click(
    page
      .getByRole("dialog", { name: dialogName })
      .getByRole("button", { name: optionName, exact: true }),
  );
}

async function selectFromListbox(page: Page, triggerName: string, optionName: string) {
  await click(page.getByRole("button", { name: triggerName, exact: true }));
  await click(page.getByRole("listbox").getByRole("button", { name: optionName, exact: true }));
}

async function openQuizKindPanel(page: Page, currentLabel: string) {
  await click(page.getByRole("button", { name: currentLabel, exact: true }));
}

test("通常表示で主要 UI が表示される", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("button", { name: "通常", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("button", { name: "クイズ", exact: true })).toBeVisible();
  await expect(page.getByText("スケール", { exact: true })).toBeVisible();
  await expect(page.getByText("CAGED", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("コード", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "メジャースケール", exact: true })).toBeVisible();
});

test("設定から表示サイズと言語を切り替えられる", async ({ page }) => {
  await page.goto("/");

  await click(page.getByRole("button", { name: "設定", exact: true }));
  const displaySizeTrigger = page.locator("button[aria-haspopup='listbox']").filter({
    hasText: /標準|コンパクト|極小/,
  });
  await click(displaySizeTrigger);
  await click(page.getByRole("listbox").getByRole("button", { name: "コンパクト", exact: true }));
  await expect(page.getByRole("button", { name: "コンパクト", exact: true })).toBeVisible();

  await click(page.getByRole("button", { name: "EN", exact: true }));
  await expect(page.getByRole("button", { name: "Settings", exact: true })).toBeVisible();
  await expect(page.getByText("Display Size", { exact: true })).toBeVisible();

  await click(page.getByRole("button", { name: "JA", exact: true }));
  await expect(page.getByRole("button", { name: "設定", exact: true })).toBeVisible();
  await expect(page.getByText("表示サイズ", { exact: true })).toBeVisible();
});

test("度数表示で度数フィルターを操作できる", async ({ page }) => {
  await page.goto("/");

  await click(page.getByRole("button", { name: "度数", exact: true }));
  const degreeSection = page
    .getByRole("heading", { name: "度数", exact: true })
    .locator("xpath=../..");

  await expect(degreeSection.getByRole("button", { name: "絞り込む", exact: true })).toBeVisible();
  await click(degreeSection.getByText("P1", { exact: true }));
  await expect(degreeSection.getByRole("button", { name: "リセット", exact: true })).toBeVisible();
  await click(degreeSection.getByRole("button", { name: "リセット", exact: true }));
  await expect(degreeSection.getByRole("button", { name: "全非表示", exact: true })).toBeVisible();
});

test("スケールとコードの主要選択 UI を操作できる", async ({ page }) => {
  await page.goto("/");

  await activateLayer(page, "スケール");
  await selectFromDialog(page, "メジャースケール", "スケール一覧", "メロディックマイナー");
  await expect(
    page.getByRole("button", { name: "メロディックマイナー", exact: true }),
  ).toBeVisible();

  await activateLayer(page, "コード");
  await selectFromListbox(page, "コードフォーム", "トライアド");
  await selectFromListbox(page, "Major", "Augmented");
  await expect(page.getByRole("button", { name: "Augmented", exact: true })).toBeVisible();
});

test("スケールは全種類を選択できる", async ({ page }) => {
  await page.goto("/");
  await activateLayer(page, "スケール");

  const scaleNames = [
    "メジャースケール",
    "ナチュラルマイナー",
    "メジャーペンタ",
    "マイナーペンタ",
    "ブルーノート",
    "ハーモニックマイナー",
    "メロディックマイナー",
    "イオニアン",
    "ドリアン",
    "フリジアン",
    "リディアン",
    "ミクソリディアン",
    "エオリアン",
    "ロクリアン",
  ];

  let currentScale = "メジャースケール";
  for (const scaleName of scaleNames) {
    await selectFromDialog(page, currentScale, "スケール一覧", scaleName);
    await expect(page.getByRole("button", { name: scaleName, exact: true })).toBeVisible();
    currentScale = scaleName;
  }
});

test("コード表示形式と主要コード種別を切り替えられる", async ({ page }) => {
  await page.goto("/");
  await activateLayer(page, "コード");

  let currentDisplayMode = "コードフォーム";
  for (const displayMode of ["パワーコード", "トライアド", "ダイアトニック", "コードフォーム"]) {
    await selectFromListbox(page, currentDisplayMode, displayMode);
    await expect(page.getByRole("button", { name: displayMode, exact: true })).toBeVisible();
    currentDisplayMode = displayMode;
  }

  await selectFromListbox(page, currentDisplayMode, "ダイアトニック");
  currentDisplayMode = "ダイアトニック";
  await selectFromListbox(page, "メジャー", "マイナー");
  await selectFromListbox(page, "3和音", "4和音");

  await selectFromListbox(page, currentDisplayMode, "コードフォーム");
  currentDisplayMode = "コードフォーム";
  let currentChordType = "Major";
  for (const chordName of ["Minor", "7th", "maj7", "m7", "sus4", "6"]) {
    await selectFromDialog(page, currentChordType, "和音", chordName);
    await expect(page.getByRole("button", { name: chordName, exact: true })).toBeVisible();
    currentChordType = chordName;
  }

  await selectFromListbox(page, currentDisplayMode, "トライアド");
  currentDisplayMode = "トライアド";
  await selectFromListbox(page, "Major", "Minor");
  currentChordType = "Minor";

  let currentStrings = "1~3";
  for (const stringSet of ["2~4", "3~5", "4~6", "1~3"]) {
    await selectFromListbox(page, currentStrings, stringSet);
    await expect(page.getByRole("button", { name: stringSet, exact: true })).toBeVisible();
    currentStrings = stringSet;
  }

  let currentInversion = "基本";
  for (const inversion of ["第一転回", "第二転回", "基本"]) {
    await selectFromListbox(page, currentInversion, inversion);
    await expect(page.getByRole("button", { name: inversion, exact: true })).toBeVisible();
    currentInversion = inversion;
  }
});

test("CAGED フォームを切り替えられる", async ({ page }) => {
  await page.goto("/");
  await activateLayer(page, "CAGED");

  for (const form of ["C", "A", "G", "E", "D"]) {
    await click(page.getByRole("button", { name: form, exact: true }));
    await expect(page.getByRole("button", { name: form, exact: true })).toBeVisible();
  }
});

test("クイズ種類を切り替えて問題文が欠けない", async ({ page }) => {
  await page.goto("/");
  await click(page.getByRole("button", { name: "クイズ", exact: true }));

  const cases = [
    { kind: "音名・4択", pattern: /弦.*フレット.*音は/ },
    { kind: "音名・指板", pattern: /弦の .* はどこ/ },
    { kind: "度数・4択", pattern: /度数は/ },
    { kind: "度数・指板", pattern: /弦の .* はどこ/ },
    { kind: "ルート度数・4択", pattern: /.+の.+は？/ },
    { kind: "ルート度数・指板", pattern: /.+の.+はどこ？/ },
  ];

  let currentKind = "音名・4択";
  for (const quizCase of cases) {
    await openQuizKindPanel(page, currentKind);
    await click(
      page
        .getByRole("dialog", { name: "quiz-kind-select" })
        .getByRole("button", { name: quizCase.kind, exact: true }),
    );
    await expect(page.getByText(quizCase.pattern)).toBeVisible();
    currentKind = quizCase.kind;
  }
});

test("クイズの 4択 は回答して次の問題へ進める", async ({ page }) => {
  await page.goto("/");
  await click(page.getByRole("button", { name: "クイズ", exact: true }));

  const questionBefore =
    (await page.locator("p.text-center.text-base.font-semibold").textContent()) ?? "";
  const answerButtons = page.locator("div.grid.grid-cols-2.gap-2 button");
  await click(answerButtons.first());
  await expect(page.getByText(/正解！|不正解/)).toBeVisible();
  await expect
    .poll(async () => await page.locator("p.text-center.text-base.font-semibold").textContent())
    .not.toBe(questionBefore);
});
