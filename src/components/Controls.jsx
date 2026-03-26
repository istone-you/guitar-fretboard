import { NOTES, CAGED_FORMS, CAGED_ORDER } from '../logic/fretboard'

const CHORD_TYPES = ['Major', 'Minor', '7th', 'maj7', 'm7', 'm7(b5)', 'dim7', 'm(maj7)']

export default function Controls({
  rootNote,
  setRootNote,
  capo,
  setCapo,
  baseLabelMode,
  setBaseLabelMode,
  showChord,
  setShowChord,
  showScale,
  setShowScale,
  scaleType,
  setScaleType,
  showPowerChord,
  setShowPowerChord,
  showCaged,
  setShowCaged,
  cagedForms,
  toggleCagedForm,
  chordType,
  setChordType,
  chordRootString,
  setChordRootString,
  layerOpacity,
  setLayerOpacity,
}) {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-xl space-y-4">
      {/* タイトル */}
      <div className="text-center pb-3 border-b border-gray-800">
        <h1 className="text-3xl font-semibold tracking-[0.08em] text-slate-100">
          Guitar Fretboard
        </h1>
        <div className="mt-3 flex justify-center" aria-hidden="true">
          <div className="h-px w-28 bg-gradient-to-r from-transparent via-slate-500 to-transparent" />
        </div>
      </div>

      {/* ルート音 & カポ */}
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <label className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-300">Root</span>
          <select
            value={rootNote}
            onChange={(e) => setRootNote(e.target.value)}
            className="bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-500"
          >
            {NOTES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-300">Capo</span>
          <select
            value={capo}
            onChange={(e) => setCapo(Number(e.target.value))}
            className="bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-500"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>{i === 0 ? 'なし' : `${i}フレット`}</option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
          <span className="text-sm font-semibold text-gray-300 px-2">表示</span>
          {[
            { value: 'note', label: '音名' },
            { value: 'degree', label: '度数' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setBaseLabelMode(value)}
              className={`px-3 py-1 rounded text-sm font-semibold transition-all
                ${baseLabelMode === value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* レイヤー切り替え */}
      <div className="flex flex-wrap gap-3 justify-center">
        <LayerToggle
          label="スケール"
          color="bg-emerald-600"
          active={showScale}
          onToggle={() => setShowScale(!showScale)}
        />
        <LayerToggle
          label="CAGED"
          color="bg-violet-600"
          active={showCaged}
          onToggle={() => setShowCaged(!showCaged)}
        />
        <LayerToggle
          label="コードフォーム"
          color="bg-rose-600"
          active={showChord}
          onToggle={() => setShowChord(!showChord)}
        />
        <LayerToggle
          label="パワーコード"
          color="bg-sky-600"
          active={showPowerChord}
          onToggle={() => setShowPowerChord(!showPowerChord)}
        />
      </div>

      {/* コードフォーム設定 */}
      {showChord && (
        <div className="flex flex-wrap gap-3 items-center justify-center bg-gray-800 rounded-lg p-3">
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-300">コード</span>
            <select
              value={chordType}
              onChange={(e) => setChordType(e.target.value)}
              className="bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-500"
            >
              {CHORD_TYPES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-300">ルート弦</span>
            <select
              value={chordRootString}
              onChange={(e) => setChordRootString(Number(e.target.value))}
              className="bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-500"
            >
              <option value={0}>6弦ルート</option>
              <option value={1}>5弦ルート</option>
            </select>
          </label>
        </div>
      )}

      {/* スケール設定 */}
      {showScale && (
        <div className="flex gap-2 items-center justify-center bg-gray-800 rounded-lg p-3">
          <span className="text-sm text-gray-300">種類</span>
          {[
            { value: 'major', label: 'メジャースケール' },
            { value: 'natural-minor', label: 'ナチュラルマイナー' },
            { value: 'minor-penta', label: 'マイナーペンタ' },
            { value: 'major-penta', label: 'メジャーペンタ' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setScaleType(value)}
              className={`px-3 py-1 rounded text-sm font-semibold transition-all
                ${scaleType === value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* CAGED設定 */}
      {showCaged && (
        <div className="flex flex-wrap gap-2 items-center justify-center bg-gray-800 rounded-lg p-3">
          <span className="text-sm text-gray-300">フォーム</span>
          {CAGED_ORDER.map((key) => {
            const active = cagedForms.has(key)
            return (
              <button
                key={key}
                onClick={() => toggleCagedForm(key)}
                className={`w-9 h-9 rounded-full text-sm font-bold transition-all border-2
                  ${active
                    ? 'text-white border-transparent scale-110 shadow-lg'
                    : 'bg-gray-700 text-gray-400 border-gray-600 hover:border-gray-400'
                  }`}
                style={active ? { backgroundColor: CAGED_FORMS[key].color } : {}}
              >
                {key}
              </button>
            )
          })}
        </div>
      )}

      {/* Opacity スライダー */}
      <div className="flex items-center gap-3 justify-center">
        <span className="text-sm text-gray-300">レイヤー透過</span>
        <input
          type="range"
          min={20}
          max={100}
          value={layerOpacity}
          onChange={(e) => setLayerOpacity(Number(e.target.value))}
          className="w-32 accent-indigo-400"
        />
        <span className="text-sm text-gray-400 w-10 text-right">{layerOpacity}%</span>
      </div>
    </div>
  )
}

function LayerToggle({ label, color, active, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1 rounded-full text-sm font-semibold transition-all border-2
        ${active
          ? `${color} text-white border-transparent shadow-lg scale-105`
          : 'bg-gray-700 text-gray-400 border-gray-600 hover:border-gray-400'
        }`}
    >
      {label}
    </button>
  )
}
