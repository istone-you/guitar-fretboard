import { NOTES, CAGED_FORMS, CAGED_ORDER } from '../logic/fretboard'

const CHORD_TYPES = ['Major', 'Minor', '7th', 'maj7', 'm7', 'm7(b5)', 'dim7', 'm(maj7)']

export default function Controls({
  rootNote,
  setRootNote,
  capo,
  setCapo,
  showDegree,
  setShowDegree,
  showChord,
  setShowChord,
  showScale,
  setShowScale,
  showPowerChord,
  setShowPowerChord,
  showPenta,
  setShowPenta,
  pentaType,
  setPentaType,
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
      <div className="text-center pb-2 border-b border-gray-700">
        {/* ギター弦を模したデコレーションライン */}
        <div className="flex justify-center gap-px mb-3" aria-hidden="true">
          {[
            'bg-amber-300',
            'bg-amber-400',
            'bg-gray-300',
            'bg-gray-300',
            'bg-gray-400',
            'bg-gray-500',
          ].map((color, i) => (
            <div
              key={i}
              className={`${color} rounded-full`}
              style={{
                width: `${1.5 + i * 0.5}px`,
                height: '28px',
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        {/* メインタイトル */}
        <h1
          className="text-2xl font-black tracking-widest uppercase"
          style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 30%, #e2e8f0 55%, #fbbf24 80%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.12em',
            textShadow: 'none',
            filter: 'drop-shadow(0 2px 6px rgba(251,191,36,0.3))',
          }}
        >
          Guitar Fretboard
        </h1>

        {/* サブタイトル */}
        <p className="text-xs tracking-[0.35em] uppercase text-gray-400 mt-1 font-semibold">
          Interactive Layer
        </p>
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
      </div>

      {/* レイヤー切り替え */}
      <div className="flex flex-wrap gap-3 justify-center">
        <LayerToggle
          label="メジャースケール"
          color="bg-emerald-600"
          active={showScale}
          onToggle={() => setShowScale(!showScale)}
        />
        <LayerToggle
          label="ペンタトニック"
          color="bg-orange-500"
          active={showPenta}
          onToggle={() => setShowPenta(!showPenta)}
        />
        <LayerToggle
          label="CAGED"
          color="bg-teal-600"
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
        <LayerToggle
          label="度数"
          color="bg-indigo-600"
          active={showDegree}
          onToggle={() => setShowDegree(!showDegree)}
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

      {/* ペンタトニック設定 */}
      {showPenta && (
        <div className="flex gap-2 items-center justify-center bg-gray-800 rounded-lg p-3">
          <span className="text-sm text-gray-300">種類</span>
          {[
            { value: 'minor', label: 'マイナーペンタ' },
            { value: 'major', label: 'メジャーペンタ' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPentaType(value)}
              className={`px-3 py-1 rounded text-sm font-semibold transition-all
                ${pentaType === value
                  ? 'bg-orange-500 text-white'
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
