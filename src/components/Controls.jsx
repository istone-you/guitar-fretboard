import { useEffect, useRef, useState } from 'react'
import { NOTES, CAGED_FORMS, CAGED_ORDER, DIATONIC_CHORDS, getDiatonicChord } from '../logic/fretboard'

const CHORD_TYPES = ['Major', 'Minor', '7th', 'maj7', 'm7', 'm7(b5)', 'dim7', 'm(maj7)']
const CAPO_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i,
  label: i === 0 ? 'なし' : `${i}フレット`,
}))
const CHORD_DISPLAY_OPTIONS = [
  { value: 'form', label: 'コードフォーム' },
  { value: 'power', label: 'パワーコード' },
  { value: 'diatonic', label: 'ダイアトニック' },
]
const DIATONIC_KEY_OPTIONS = [
  { value: 'major-triad', label: 'メジャー（3和音）' },
  { value: 'major-seventh', label: 'メジャー（4和音）' },
  { value: 'natural-minor-triad', label: 'マイナー（3和音）' },
  { value: 'natural-minor-seventh', label: 'マイナー（4和音）' },
]
const SCALE_OPTIONS = [
  { value: 'major', label: 'メジャースケール' },
  { value: 'natural-minor', label: 'ナチュラルマイナー' },
  { value: 'minor-penta', label: 'マイナーペンタ' },
  { value: 'major-penta', label: 'メジャーペンタ' },
]

export default function Controls({
  theme,
  rootNote,
  setRootNote,
  capo,
  setCapo,
  baseLabelMode,
  setBaseLabelMode,
  showChord,
  setShowChord,
  chordDisplayMode,
  setChordDisplayMode,
  showScale,
  setShowScale,
  scaleType,
  setScaleType,
  showCaged,
  setShowCaged,
  cagedForms,
  toggleCagedForm,
  chordType,
  setChordType,
  diatonicScaleType,
  setDiatonicScaleType,
  diatonicDegree,
  setDiatonicDegree,
  layerOpacity,
  setLayerOpacity,
}) {
  const isDark = theme === 'dark'
  const rootIndex = NOTES.indexOf(rootNote)
  const diatonicCodeOptions = DIATONIC_CHORDS[diatonicScaleType].map(({ value }) => {
    const chord = getDiatonicChord(rootIndex, diatonicScaleType, value)
    const suffixMap = {
      Major: '',
      Minor: 'm',
      '7th': '7',
      maj7: 'maj7',
      m7: 'm7',
      'm7(b5)': 'm7(b5)',
      dim7: 'dim',
      'm(maj7)': 'm(maj7)',
    }
    return { value, label: `${value} (${NOTES[chord.rootIndex]}${suffixMap[chord.chordType] ?? chord.chordType})` }
  })

  return (
    <div className={`space-y-4 pt-4 ${isDark ? 'text-white' : 'text-stone-900'}`}>
      {/* ルート音 & カポ */}
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:flex-wrap lg:justify-center">
        <label className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>ルート</span>
          <DropdownSelect
            theme={theme}
            value={rootNote}
            onChange={setRootNote}
            options={NOTES.map((note) => ({ value: note, label: note }))}
            widthClass="w-24"
          />
        </label>

        <label className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>カポ</span>
          <DropdownSelect
            theme={theme}
            value={capo}
            onChange={setCapo}
            options={CAPO_OPTIONS}
            widthClass="w-28"
          />
        </label>

        <div className={`inline-flex items-center justify-between gap-2 rounded-lg p-1 ${isDark ? 'bg-gray-800' : 'bg-stone-100'}`}>
          <span className={`w-12 px-2 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>表示</span>
          {[
            { value: 'note', label: '音名' },
            { value: 'degree', label: '度数' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setBaseLabelMode(value)}
              className={`w-[4.5rem] whitespace-nowrap px-3 py-1 rounded text-sm font-semibold transition-all
                ${baseLabelMode === value
                  ? 'bg-indigo-600 text-white'
                  : isDark ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-white text-stone-600 hover:bg-stone-200'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

      </div>

      <div className="space-y-3">
        <LayerRow
          label="スケール"
          color="bg-emerald-600"
          active={showScale}
          theme={theme}
          onToggle={() => setShowScale(!showScale)}
        >
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>種類</span>
            <DropdownSelect
              theme={theme}
              value={scaleType}
              onChange={setScaleType}
              options={SCALE_OPTIONS}
              widthClass="w-44"
            />
          </div>
        </LayerRow>

        <LayerRow
          label="CAGED"
          color="bg-indigo-500"
          active={showCaged}
          theme={theme}
          onToggle={() => setShowCaged(!showCaged)}
        >
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>フォーム</span>
            {CAGED_ORDER.map((key) => {
              const active = cagedForms.has(key)
              return (
                <button
                  key={key}
                  onClick={() => toggleCagedForm(key)}
                  className={`w-9 h-9 rounded-full text-sm font-bold transition-all border-2
                    ${active
                      ? 'text-white border-transparent scale-110 shadow-lg'
                      : isDark ? 'bg-gray-700 text-gray-400 border-gray-600 hover:border-gray-400' : 'bg-white text-stone-600 border-stone-300 hover:border-stone-500'
                    }`}
                  style={active ? { backgroundColor: CAGED_FORMS[key].color } : {}}
                >
                  {key}
                </button>
              )
            })}
          </div>
        </LayerRow>

        <LayerRow
          label="コード"
          color="bg-amber-500"
          active={showChord}
          theme={theme}
          onToggle={() => setShowChord(!showChord)}
        >
          <div className="flex flex-wrap gap-3 items-center">
            <label className="flex items-center gap-2">
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>表示方式</span>
              <DropdownSelect
                theme={theme}
                value={chordDisplayMode}
                onChange={setChordDisplayMode}
                options={CHORD_DISPLAY_OPTIONS}
                widthClass="w-44"
              />
            </label>

            <label className="flex items-center gap-2">
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>コード</span>
              <DropdownSelect
                theme={theme}
                value={
                  chordDisplayMode === 'form'
                    ? chordType
                    : chordDisplayMode === 'diatonic'
                      ? diatonicDegree
                      : ''
                }
                onChange={chordDisplayMode === 'diatonic' ? setDiatonicDegree : setChordType}
                options={
                  chordDisplayMode === 'form'
                    ? CHORD_TYPES.map((chord) => ({ value: chord, label: chord }))
                    : chordDisplayMode === 'diatonic'
                      ? diatonicCodeOptions
                    : [{ value: '', label: '--' }]
                }
                disabled={chordDisplayMode === 'power'}
                widthClass="w-44"
              />
            </label>

            <label className="flex items-center gap-2">
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>キー</span>
              <DropdownSelect
                theme={theme}
                value={chordDisplayMode === 'diatonic' ? diatonicScaleType : ''}
                onChange={setDiatonicScaleType}
                options={chordDisplayMode === 'diatonic' ? DIATONIC_KEY_OPTIONS : [{ value: '', label: '--' }]}
                disabled={chordDisplayMode !== 'diatonic'}
                widthClass="w-44"
              />
            </label>
          </div>
        </LayerRow>
      </div>

      {/* Opacity スライダー */}
      <div className="flex items-center gap-3 justify-center">
        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>レイヤー透過</span>
        <input
          type="range"
          min={20}
          max={100}
          value={layerOpacity}
          onChange={(e) => setLayerOpacity(Number(e.target.value))}
          className="w-32 accent-indigo-400"
        />
        <span className={`text-sm w-10 text-right ${isDark ? 'text-gray-400' : 'text-stone-500'}`}>{layerOpacity}%</span>
      </div>

    </div>
  )
}

function LayerToggle({ label, color, active, onToggle, theme }) {
  return (
    <button
      onClick={onToggle}
      className={`w-28 px-3 py-1 rounded-full text-sm font-semibold transition-all border-2
        ${active
          ? `${color} text-white border-transparent shadow-lg scale-105`
          : theme === 'dark'
            ? 'bg-gray-700 text-gray-400 border-gray-600 hover:border-gray-400'
            : 'bg-white text-stone-600 border-stone-300 hover:border-stone-500'
        }`}
    >
      {label}
    </button>
  )
}

function LayerRow({ label, color, active, onToggle, theme, children }) {
  const isDark = theme === 'dark'

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-3 sm:items-start sm:flex-row">
      <div className="shrink-0 sm:pt-1">
        <LayerToggle
          label={label}
          color={color}
          active={active}
          onToggle={onToggle}
          theme={theme}
        />
      </div>
      <div
        className={`w-full max-w-2xl rounded-lg p-3 transition-opacity sm:max-w-none sm:flex-1 ${
          isDark ? 'bg-gray-800' : 'bg-stone-100'
        } ${active ? 'opacity-100' : 'opacity-45 pointer-events-none'}`}
        aria-disabled={!active}
      >
        <div className="flex justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}

function DropdownSelect({ theme, value, onChange, options, disabled = false, widthClass = 'w-32' }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const isDark = theme === 'dark'
  const selected = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const buttonClass = disabled
    ? isDark
      ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
      : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
    : isDark
      ? 'bg-gray-700/90 text-white border-gray-600 hover:border-gray-500'
      : 'bg-white/95 text-stone-900 border-stone-300 hover:border-stone-400'

  return (
    <div ref={rootRef} className={`relative ${widthClass}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-2.5 py-1.5 text-left text-sm font-medium shadow-sm transition-all ${
          open && !disabled
            ? isDark
              ? 'border-gray-500 bg-gray-700'
              : 'border-stone-400 bg-white'
            : buttonClass
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selected?.label}</span>
        <span
          className={`text-xs transition-transform ${open ? 'rotate-180' : ''} ${
            isDark ? 'text-gray-400' : 'text-stone-500'
          }`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {open && !disabled && (
        <div
          className={`absolute left-0 top-[calc(100%+0.5rem)] z-30 w-full overflow-hidden rounded-2xl border p-1.5 shadow-2xl backdrop-blur ${
            isDark
              ? 'border-gray-700 bg-gray-900/95'
              : 'border-stone-200 bg-white/95'
          }`}
        >
          <div role="listbox" className="space-y-1">
            {options.map((option) => {
              const active = option.value === value
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                    active
                      ? isDark
                        ? 'bg-gray-800 text-white'
                        : 'bg-stone-100 text-stone-900'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-800/80'
                        : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{option.label}</span>
                  <span
                    className={`text-xs ${
                      active
                        ? isDark ? 'text-sky-300' : 'text-sky-600'
                        : 'opacity-0'
                    }`}
                    aria-hidden="true"
                  >
                    ●
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
