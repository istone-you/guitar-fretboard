import { NOTES, CAGED_FORMS, CAGED_ORDER } from '../logic/fretboard'

const CHORD_TYPES = ['Major', 'Minor', '7th', 'maj7', 'm7', 'm7(b5)', 'dim7', 'm(maj7)']

export default function Controls({
  theme,
  setTheme,
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
  chordRootString,
  setChordRootString,
  layerOpacity,
  setLayerOpacity,
}) {
  const isDark = theme === 'dark'

  return (
    <div className={`p-4 rounded-xl space-y-4 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-white text-stone-900 border border-stone-300 shadow-sm'
    }`}>
      {/* タイトル */}
      <div className={`text-center pb-3 border-b ${isDark ? 'border-gray-800' : 'border-stone-200'}`}>
        <h1 className={`text-3xl font-semibold tracking-[0.08em] ${isDark ? 'text-slate-100' : 'text-stone-900'}`}>
          Guitar Fretboard
        </h1>
        <div className="mt-3 flex justify-center" aria-hidden="true">
          <div className={`h-px w-28 bg-gradient-to-r from-transparent ${isDark ? 'via-slate-500' : 'via-stone-400'} to-transparent`} />
        </div>
      </div>

      {/* ルート音 & カポ */}
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <label className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>Root</span>
          <select
            value={rootNote}
            onChange={(e) => setRootNote(e.target.value)}
            className={`rounded px-2 py-1 text-sm border ${
              isDark ? 'bg-gray-700 text-white border-gray-500' : 'bg-stone-50 text-stone-900 border-stone-300'
            }`}
          >
            {NOTES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>Capo</span>
          <select
            value={capo}
            onChange={(e) => setCapo(Number(e.target.value))}
            className={`rounded px-2 py-1 text-sm border ${
              isDark ? 'bg-gray-700 text-white border-gray-500' : 'bg-stone-50 text-stone-900 border-stone-300'
            }`}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>{i === 0 ? 'なし' : `${i}フレット`}</option>
            ))}
          </select>
        </label>

        <div className={`flex items-center gap-2 rounded-lg p-1 ${isDark ? 'bg-gray-800' : 'bg-stone-100'}`}>
          <span className={`text-sm font-semibold px-2 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>表示</span>
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
                  : isDark ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-white text-stone-600 hover:bg-stone-200'
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
          theme={theme}
          onToggle={() => setShowScale(!showScale)}
        />
        <LayerToggle
          label="CAGED"
          color="bg-indigo-500"
          active={showCaged}
          theme={theme}
          onToggle={() => setShowCaged(!showCaged)}
        />
        <LayerToggle
          label="コード"
          color="bg-amber-500"
          active={showChord}
          theme={theme}
          onToggle={() => setShowChord(!showChord)}
        />
      </div>

      {/* コード設定 */}
      {showChord && (
        <div className={`flex flex-wrap gap-3 items-center justify-center rounded-lg p-3 ${isDark ? 'bg-gray-800' : 'bg-stone-100'}`}>
          <label className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>表示方式</span>
            <select
              value={chordDisplayMode}
              onChange={(e) => setChordDisplayMode(e.target.value)}
              className={`rounded px-2 py-1 text-sm border ${
                isDark ? 'bg-gray-700 text-white border-gray-500' : 'bg-white text-stone-900 border-stone-300'
              }`}
            >
              <option value="barre">バレーコード</option>
              <option value="power">パワーコード</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>コード</span>
            <select
              value={chordDisplayMode === 'barre' ? chordType : ''}
              onChange={(e) => setChordType(e.target.value)}
              disabled={chordDisplayMode !== 'barre'}
              className={`rounded px-2 py-1 text-sm border ${
                chordDisplayMode !== 'barre'
                  ? isDark
                    ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                    : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                  : isDark
                    ? 'bg-gray-700 text-white border-gray-500'
                    : 'bg-white text-stone-900 border-stone-300'
              }`}
            >
              {chordDisplayMode !== 'barre' && (
                <option value="">--</option>
              )}
              {CHORD_TYPES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>ルート弦</span>
            <select
              value={chordRootString}
              onChange={(e) => setChordRootString(Number(e.target.value))}
              className={`rounded px-2 py-1 text-sm border ${
                isDark ? 'bg-gray-700 text-white border-gray-500' : 'bg-white text-stone-900 border-stone-300'
              }`}
            >
              <option value={0}>6弦ルート</option>
              <option value={1}>5弦ルート</option>
            </select>
          </label>
        </div>
      )}

      {/* スケール設定 */}
      {showScale && (
        <div className={`flex gap-2 items-center justify-center rounded-lg p-3 ${isDark ? 'bg-gray-800' : 'bg-stone-100'}`}>
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>種類</span>
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
                  : isDark ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-white text-stone-600 hover:bg-stone-200'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* CAGED設定 */}
      {showCaged && (
        <div className={`flex flex-wrap gap-2 items-center justify-center rounded-lg p-3 ${isDark ? 'bg-gray-800' : 'bg-stone-100'}`}>
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
      )}

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

      <div className="flex justify-center">
        <div className={`inline-flex items-center justify-center gap-2 rounded-lg p-1 ${isDark ? 'bg-gray-800' : 'bg-stone-100'}`}>
        <span className={`text-sm font-semibold px-2 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>Theme</span>
        {[
          { value: 'dark', label: 'Dark' },
          { value: 'light', label: 'Light' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
              theme === value
                ? 'bg-amber-500 text-stone-950'
                : isDark ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-white text-stone-600 hover:bg-stone-200'
            }`}
          >
            {label}
          </button>
        ))}
        </div>
      </div>
    </div>
  )
}

function LayerToggle({ label, color, active, onToggle, theme }) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1 rounded-full text-sm font-semibold transition-all border-2
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
