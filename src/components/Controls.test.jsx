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
  it('設定ボタンをクリックすると♯/♭トグルが表示される', () => {
    render(<Controls {...makeProps()} />)
    fireEvent.click(screen.getByTitle('設定'))
    expect(screen.getByText('♯')).toBeTruthy()
    expect(screen.getByText('♭')).toBeTruthy()
  })

  it('スケール・CAGED・コードのラベルが表示される', () => {
    render(<Controls {...makeProps()} />)
    expect(screen.getByText('スケール')).toBeTruthy()
    expect(screen.getByText('CAGED')).toBeTruthy()
    expect(screen.getAllByText('コード').length).toBeGreaterThan(0)
  })

  // ===== ♯/♭切り替え =====
  it('♯ボタンをクリックすると onAccidentalChange("sharp") が呼ばれる', () => {
    const props = makeProps()
    render(<Controls {...props} />)
    fireEvent.click(screen.getByTitle('設定'))
    fireEvent.click(screen.getByText('♯'))
    expect(props.onAccidentalChange).toHaveBeenCalledWith('sharp')
  })

  it('♭ボタンをクリックすると onAccidentalChange("flat") が呼ばれる', () => {
    const props = makeProps({ accidental: 'sharp' })
    render(<Controls {...props} />)
    fireEvent.click(screen.getByTitle('設定'))
    fireEvent.click(screen.getByText('♭'))
    expect(props.onAccidentalChange).toHaveBeenCalledWith('flat')
  })

  // ===== レイヤートグル =====
  it('スケールパネルをクリックすると setShowScale が呼ばれる', () => {
    const props = makeProps()
    render(<Controls {...props} />)
    // LayerRow の div をクリック（ラベル span の親）
    const label = screen.getByText('スケール')
    fireEvent.click(label.closest('div[class*="rounded-lg"]'))
    expect(props.setShowScale).toHaveBeenCalled()
  })

  it('CAGEDパネルをクリックすると setShowCaged が呼ばれる', () => {
    const props = makeProps()
    render(<Controls {...props} />)
    const label = screen.getByText('CAGED')
    fireEvent.click(label.closest('div[class*="rounded-lg"]'))
    expect(props.setShowCaged).toHaveBeenCalled()
  })

  it('コードパネルをクリックすると setShowChord が呼ばれる', () => {
    const props = makeProps()
    render(<Controls {...props} />)
    const labels = screen.getAllByText('コード')
    // LayerRow の span badge を探してその親パネルをクリック
    const badge = labels.find((el) => el.tagName === 'SPAN')
    fireEvent.click(badge.closest('div[class*="rounded-lg"]'))
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

})
