import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Controls from './Controls'

function makeProps(overrides = {}) {
  return {
    theme: 'dark',
    rootNote: 'C',
    setRootNote: vi.fn(),
    accidental: 'flat',
    onAccidentalChange: vi.fn(),
    baseLabelMode: 'note',
    setBaseLabelMode: vi.fn(),
    showChord: false,
    setShowChord: vi.fn(),
    chordDisplayMode: 'form',
    setChordDisplayMode: vi.fn(),
    showScale: false,
    setShowScale: vi.fn(),
    scaleType: 'major',
    setScaleType: vi.fn(),
    showCaged: false,
    setShowCaged: vi.fn(),
    cagedForms: new Set(['E']),
    toggleCagedForm: vi.fn(),
    chordType: 'Major',
    setChordType: vi.fn(),
    triadStringSet: '1-3',
    setTriadStringSet: vi.fn(),
    triadInversion: 'root',
    setTriadInversion: vi.fn(),
    diatonicKeyType: 'major',
    setDiatonicKeyType: vi.fn(),
    diatonicChordSize: 'triad',
    setDiatonicChordSize: vi.fn(),
    diatonicDegree: 'I',
    setDiatonicDegree: vi.fn(),
    ...overrides,
  }
}

describe('Controls', () => {
  // ===== レンダリング =====
  it('ルートラベルが表示される', () => {
    render(<Controls {...makeProps()} />)
    expect(screen.getByText('ルート')).toBeTruthy()
  })

  it('♯/♭トグルが表示される', () => {
    render(<Controls {...makeProps()} />)
    expect(screen.getByText('♯')).toBeTruthy()
    expect(screen.getByText('♭')).toBeTruthy()
  })

  it('音名/度数トグルが表示される', () => {
    render(<Controls {...makeProps()} />)
    expect(screen.getByText('音名')).toBeTruthy()
    expect(screen.getByText('度数')).toBeTruthy()
  })

  it('スケール・CAGED・コードのトグルボタンが表示される', () => {
    render(<Controls {...makeProps()} />)
    expect(screen.getByText('スケール')).toBeTruthy()
    expect(screen.getByText('CAGED')).toBeTruthy()
    // 「コード」はボタンとラベルで複数存在する
    expect(screen.getAllByText('コード').length).toBeGreaterThan(0)
  })

  // ===== ♯/♭切り替え =====
  it('♯ボタンをクリックすると onAccidentalChange("sharp") が呼ばれる', () => {
    const props = makeProps()
    render(<Controls {...props} />)
    fireEvent.click(screen.getByText('♯'))
    expect(props.onAccidentalChange).toHaveBeenCalledWith('sharp')
  })

  it('♭ボタンをクリックすると onAccidentalChange("flat") が呼ばれる', () => {
    const props = makeProps({ accidental: 'sharp' })
    render(<Controls {...props} />)
    fireEvent.click(screen.getByText('♭'))
    expect(props.onAccidentalChange).toHaveBeenCalledWith('flat')
  })

  // ===== 表示切り替え =====
  it('度数ボタンをクリックすると setBaseLabelMode("degree") が呼ばれる', () => {
    const props = makeProps()
    render(<Controls {...props} />)
    fireEvent.click(screen.getByText('度数'))
    expect(props.setBaseLabelMode).toHaveBeenCalledWith('degree')
  })

  it('音名ボタンをクリックすると setBaseLabelMode("note") が呼ばれる', () => {
    const props = makeProps({ baseLabelMode: 'degree' })
    render(<Controls {...props} />)
    fireEvent.click(screen.getByText('音名'))
    expect(props.setBaseLabelMode).toHaveBeenCalledWith('note')
  })

  // ===== レイヤートグル =====
  it('スケールトグルをクリックすると setShowScale が呼ばれる', () => {
    const props = makeProps()
    render(<Controls {...props} />)
    fireEvent.click(screen.getByText('スケール'))
    expect(props.setShowScale).toHaveBeenCalled()
  })

  it('CAGEDトグルをクリックすると setShowCaged が呼ばれる', () => {
    const props = makeProps()
    render(<Controls {...props} />)
    fireEvent.click(screen.getByText('CAGED'))
    expect(props.setShowCaged).toHaveBeenCalled()
  })

  it('コードトグルをクリックすると setShowChord が呼ばれる', () => {
    const props = makeProps()
    render(<Controls {...props} />)
    // 「コード」ボタンは button 要素の最初のもの
    const buttons = screen.getAllByText('コード')
    const btn = buttons.find((el) => el.tagName === 'BUTTON')
    fireEvent.click(btn)
    expect(props.setShowChord).toHaveBeenCalled()
  })

  // ===== CAGEDフォームボタン =====
  it('CAGEDフォームのボタン C/A/G/E/D が表示される', () => {
    const props = makeProps({ showCaged: true })
    render(<Controls {...props} />)
    // C/A/G/E/D は丸ボタン（w-9 h-9）として存在する
    ;['C', 'A', 'G', 'E', 'D'].forEach((key) => {
      expect(screen.getAllByText(key).length).toBeGreaterThan(0)
    })
  })

  it('CAGEDフォームボタンをクリックすると toggleCagedForm が呼ばれる', () => {
    const props = makeProps({ showCaged: true })
    render(<Controls {...props} />)
    // 丸ボタン（w-9 h-9）の C を探してクリック
    const allC = screen.getAllByText('C')
    const cagedBtn = allC.find((el) => el.tagName === 'BUTTON' && el.className.includes('w-9'))
    fireEvent.click(cagedBtn)
    expect(props.toggleCagedForm).toHaveBeenCalledWith('C')
  })

  // ===== ♯モードでの音名表示 =====
  it('♯モードのとき♯表記の音名がドロップダウンに表示される', () => {
    const props = makeProps({ accidental: 'sharp', rootNote: 'C♯' })
    render(<Controls {...props} />)
    expect(screen.getByText('C♯')).toBeTruthy()
  })

  it('♭モードのとき♭表記の音名がドロップダウンに表示される', () => {
    const props = makeProps({ accidental: 'flat', rootNote: 'D♭' })
    render(<Controls {...props} />)
    expect(screen.getByText('D♭')).toBeTruthy()
  })
})
