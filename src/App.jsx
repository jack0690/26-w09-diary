import React, { useState, useEffect } from 'react'
import { fetchDiaries, createDiary, deleteDiary } from './api/diaries'

const EMOTIONS = [
  { key: 'joy', label: 'Vibing', emoji: '✨', color: 'from-amber-400 to-orange-500 shadow-orange-500/20' },
  { key: 'calm', label: 'Chill', emoji: '🌿', color: 'from-emerald-400 to-teal-500 shadow-teal-500/20' },
  { key: 'sad', label: 'Blue', emoji: '💧', color: 'from-blue-400 to-indigo-500 shadow-indigo-500/20' },
  { key: 'angry', label: 'Fire', emoji: '🔥', color: 'from-rose-500 to-red-600 shadow-red-500/20' },
  { key: 'anxious', label: 'Foggy', emoji: '🌀', color: 'from-purple-400 to-fuchsia-500 shadow-fuchsia-500/20' },
]

export default function App() {
  const [diaries, setDiaries] = useState([])
  const [content, setContent] = useState('')
  const [selectedEmotion, setSelectedEmotion] = useState('joy')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const loadDiaries = async () => {
    try {
      setLoading(true)
      const data = await fetchDiaries(filter)
      setDiaries(data)
    } catch (err) {
      console.error('Error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDiaries()
  }, [filter])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() || submitting) return

    try {
      setSubmitting(true)
      await createDiary({ content, emotion: selectedEmotion })
      setContent('')
      await loadDiaries()
    } catch (err) {
      console.error('Error:', err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('이 기록을 지울까요?')) return
    try {
      await deleteDiary(id)
      setDiaries(diaries.filter((d) => d.id !== id))
    } catch (err) {
      console.error('Error:', err.message)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0f12] text-zinc-100 font-sans selection:bg-purple-500 selection:text-white pb-20">
      {/* 배경 블러 효과 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-xl mx-auto pt-16 px-4 sm:px-6 space-y-8">
        {/* 헤더 */}
        <header className="space-y-2">
          <span className="text-xs font-mono tracking-widest text-purple-400 uppercase">Mood Archive</span>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
            How's your vibe today?
          </h1>
        </header>

        {/* 작성 카드 */}
        <form onSubmit={handleSubmit} className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 p-6 rounded-2xl shadow-2xl space-y-5">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider">Select Vibe</label>
            <div className="grid grid-cols-5 gap-2">
              {EMOTIONS.map((emo) => (
                <button
                  type="button"
                  key={emo.key}
                  onClick={() => setSelectedEmotion(emo.key)}
                  className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all duration-300 ${
                    selectedEmotion === emo.key
                      ? `bg-gradient-to-b ${emo.color} text-white border-transparent shadow-lg scale-105`
                      : 'bg-zinc-800/40 text-zinc-400 border-zinc-700/50 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <span className="text-xl mb-1">{emo.emoji}</span>
                  <span className="text-[11px] font-medium">{emo.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              rows="3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="무슨 생각을 하고 있나요..."
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-white text-zinc-950 font-semibold py-3 px-4 rounded-xl hover:bg-zinc-200 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 text-sm shadow-lg shadow-white/5"
          >
            {submitting ? 'Recording...' : 'Record Vibe'}
          </button>
        </form>

        {/* 필터 탭 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
            }`}
          >
            All Vibes
          </button>
          {EMOTIONS.map((emo) => (
            <button
              key={emo.key}
              onClick={() => setFilter(emo.key)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                filter === emo.key
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              <span>{emo.emoji}</span>
              <span>{emo.label}</span>
            </button>
          ))}
        </div>

        {/* 목록 영역 */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-zinc-600 text-sm font-mono">Loading vibes...</div>
          ) : diaries.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl text-zinc-500 text-sm">
              아직 기록된 바이브가 없어요. 첫 번째 이야기를 남겨보세요.
            </div>
          ) : (
            diaries.map((diary) => {
              const emoMeta = EMOTIONS.find((e) => e.key === diary.emotion) || EMOTIONS[0]
              return (
                <div
                  key={diary.id}
                  className="group bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-5 rounded-2xl hover:border-zinc-700 transition-all duration-300 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl p-2.5 bg-zinc-800/50 rounded-xl border border-zinc-700/50">{emoMeta.emoji}</span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                          {emoMeta.label}
                        </span>
                        <span className="text-[10px] text-zinc-600">•</span>
                        <span className="text-[11px] text-zinc-500 font-mono">
                          {new Date(diary.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-zinc-200 text-sm whitespace-pre-wrap leading-relaxed">{diary.content}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(diary.id)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 text-xs font-mono transition-opacity py-1 px-2"
                  >
                    DELETE
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}