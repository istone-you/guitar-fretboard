import React, { useState } from 'react'
import Controls from './components/Controls'
import Fretboard from './components/Fretboard'

export default function App() {
  // ルート音
  const [rootNote, setRootNote] = useState('C')
  // カポ（0=なし）
  const [capo, setCapo] = useState(0)

  // レイヤー表示フラグ
  const [showDegree, setShowDegree] = useState(false)
  const [showChord, setShowChord] = useState(false)
  const [showScale, setShowScale] = useState(false)
  const [showPowerChord, setShowPowerChord] = useState(false)
  const [showPenta, setShowPenta] = useState(false)
  const [showCaged, setShowCaged] = useState(false)

  // コードフォーム設定
  const [chordType, setChordType] = useState('Major')
  const [chordRootString, setChordRootString] = useState(0)

  // ペンタトニック設定
  const [pentaType, setPentaType] = useState('minor')

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
    <div className="min-h-screen bg-gray-950 p-4 flex flex-col gap-4">
      <Controls
        rootNote={rootNote}
        setRootNote={setRootNote}
        capo={capo}
        setCapo={setCapo}
        showDegree={showDegree}
        setShowDegree={setShowDegree}
        showChord={showChord}
        setShowChord={setShowChord}
        showScale={showScale}
        setShowScale={setShowScale}
        showPowerChord={showPowerChord}
        setShowPowerChord={setShowPowerChord}
        showPenta={showPenta}
        setShowPenta={setShowPenta}
        pentaType={pentaType}
        setPentaType={setPentaType}
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

      <div className="bg-gray-900 rounded-xl p-4">
        <div className="mb-2 flex items-center gap-3">
          <span className="text-gray-400 text-sm">
            Root: <span className="text-white font-bold text-base">{rootNote}</span>
          </span>
          {capo > 0 && (
            <span className="text-yellow-400 text-sm">
              Capo {capo}フレット
            </span>
          )}
          <span className="text-gray-600 text-xs">
            （指板の音をクリックしてルートを変更）
          </span>
        </div>
        <Fretboard
          rootNote={rootNote}
          capo={capo}
          showDegree={showDegree}
          showChord={showChord}
          showScale={showScale}
          showPowerChord={showPowerChord}
          showPenta={showPenta}
          pentaType={pentaType}
          showCaged={showCaged}
          cagedForms={cagedForms}
          chordType={chordType}
          chordRootString={chordRootString}
          layerOpacity={layerOpacity}
          onNoteClick={handleNoteClick}
        />
      </div>

      {/* 凡例 */}
      {showDegree && (
        <div className="bg-gray-900 rounded-xl p-4">
          <h3 className="text-gray-400 text-sm mb-3">度数の凡例</h3>
          <div className="flex flex-wrap gap-2">
            {[
              ['R', '#ef4444'],
              ['m2', '#ec4899'],
              ['M2', '#84cc16'],
              ['m3', '#a855f7'],
              ['M3', '#22c55e'],
              ['P4', '#06b6d4'],
              ['#4', '#6b7280'],
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
                  <span className="text-white text-xs font-bold">{name === 'R' ? 'R' : ''}</span>
                </div>
                <span className="text-gray-300 text-xs">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
