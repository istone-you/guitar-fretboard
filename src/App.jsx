import React, { useState } from 'react'
import Controls from './components/Controls'
import Fretboard from './components/Fretboard'

export default function App() {
  // ルート音
  const [rootNote, setRootNote] = useState('C')
  // カポ（0=なし）
  const [capo, setCapo] = useState(0)
  const [theme, setTheme] = useState('dark')
  // ベースレイヤー表示
  const [baseLabelMode, setBaseLabelMode] = useState('note')

  // レイヤー表示フラグ
  const [showChord, setShowChord] = useState(false)
  const [showScale, setShowScale] = useState(false)
  const [showPowerChord, setShowPowerChord] = useState(false)
  const [showCaged, setShowCaged] = useState(false)

  // コードフォーム設定
  const [chordType, setChordType] = useState('Major')
  const [chordRootString, setChordRootString] = useState(0)

  // スケール設定
  const [scaleType, setScaleType] = useState('major')

  // CAGED設定（複数選択可）
  const [cagedForms, setCagedForms] = useState(new Set(['E']))

  const toggleCagedForm = (key) => {
    setCagedForms((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  // レイヤー透過度（%）
  const [layerOpacity, setLayerOpacity] = useState(85)

  // 指板の音をクリックしてルートを設定
  const handleNoteClick = (noteName) => {
    setRootNote(noteName)
  }

  return (
    <div className={`min-h-screen p-4 flex flex-col gap-4 ${
      theme === 'dark' ? 'bg-gray-950' : 'bg-stone-100'
    }`}>
      <Controls
        theme={theme}
        setTheme={setTheme}
        rootNote={rootNote}
        setRootNote={setRootNote}
        capo={capo}
        setCapo={setCapo}
        baseLabelMode={baseLabelMode}
        setBaseLabelMode={setBaseLabelMode}
        showChord={showChord}
        setShowChord={setShowChord}
        showScale={showScale}
        setShowScale={setShowScale}
        scaleType={scaleType}
        setScaleType={setScaleType}
        showPowerChord={showPowerChord}
        setShowPowerChord={setShowPowerChord}
        showCaged={showCaged}
        setShowCaged={setShowCaged}
        cagedForms={cagedForms}
        toggleCagedForm={toggleCagedForm}
        chordType={chordType}
        setChordType={setChordType}
        chordRootString={chordRootString}
        setChordRootString={setChordRootString}
        layerOpacity={layerOpacity}
        setLayerOpacity={setLayerOpacity}
      />

      <div className={`rounded-xl p-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white border border-stone-300 shadow-sm'
      }`}>
        <div className="mb-2 flex items-center gap-3">
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-stone-600'}`}>
            Root: <span className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{rootNote}</span>
          </span>
          {capo > 0 && (
            <span className="text-yellow-400 text-sm">
              Capo {capo}フレット
            </span>
          )}
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-stone-500'}`}>
            （指板の音をクリックしてルートを変更）
          </span>
        </div>
        <Fretboard
          theme={theme}
          rootNote={rootNote}
          capo={capo}
          baseLabelMode={baseLabelMode}
          showChord={showChord}
          showScale={showScale}
          scaleType={scaleType}
          showPowerChord={showPowerChord}
          showCaged={showCaged}
          cagedForms={cagedForms}
          chordType={chordType}
          chordRootString={chordRootString}
          layerOpacity={layerOpacity}
          onNoteClick={handleNoteClick}
        />
      </div>

      {/* 凡例 */}
      {baseLabelMode === 'degree' && (
        <div className={`rounded-xl p-4 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white border border-stone-300 shadow-sm'
        }`}>
          <h3 className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-stone-600'}`}>度数の凡例</h3>
          <div className="flex flex-wrap gap-2">
            {[
              ['P1', '#ef4444'],
              ['m2', '#ec4899'],
              ['M2', '#84cc16'],
              ['m3', '#a855f7'],
              ['M3', '#22c55e'],
              ['P4', '#06b6d4'],
              ['b5', '#6b7280'],
              ['P5', '#3b82f6'],
              ['m6', '#8b5cf6'],
              ['M6', '#10b981'],
              ['m7', '#f97316'],
              ['M7', '#f59e0b'],
            ].map(([name, color]) => (
              <div key={name} className="flex items-center gap-1">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: color }}
                >
                  <span className="text-white text-xs font-bold">{name === 'P1' ? 'P1' : ''}</span>
                </div>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-stone-700'}`}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
