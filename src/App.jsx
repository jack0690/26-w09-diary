import React, { useState, useEffect } from 'react'
import { fetchDiaries, createDiary, deleteDiary } from './api/diaries'

const EMOTIONS = [
  { key: 'joy', label: '기쁨', emoji: '😊', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { key: 'calm', label: '평온', emoji: '😌', color: 'bg-green-100 text-green-800 border-green-300' },
  { key: 'sad', label: '슬픔', emoji: '😢', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { key: 'angry', label: '분노', emoji: '😠', color: 'bg-red-100 text-red-800 border-red-300' },
  { key: 'anxious', label: '불안', emoji: '😰', color: 'bg-purple-100 text-purple-800 border-purple-300' },
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
      console.error('일기를 불러오는 중 오류 발생:', err.message)
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
      console.error('일기 저장 실패:', err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    try {
      await deleteDiary(id)
      setDiaries(diaries.filter((d) => d.id !== id))
    } catch (err) {
      console.error('일기 삭제 실패:', err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">✨ 감정 일기</h1>
          <p className="mt-2 text-sm text-gray-600">오늘 하루 나의 감정을 기록해 보세요.</p>
        </header>

        {/* 작성 영역 */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">오늘의 감정</label>
            <div className="grid grid-cols-5 gap-2">
              {EMOTIONS.map((emo) => (
                <button
                  type="button"
                  key={emo.key}
                  onClick={() => setSelectedEmotion(emo.key)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-sm transition-all ${
                    selectedEmotion === emo.key ? `${emo.color} ring-2 ring-offset-2 ring-indigo-500 font-bold` : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl mb-1">{emo.emoji}</span>
                  <span>{emo.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">일기 내용</label>
            <textarea
              id="content"
              rows="3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="오늘 어떤 일이 있었나요?"
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {submitting ? '저장 중...' : '기록하기'}
          </button>
        </form>

        {/* 필터 탭 */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            전체 보기
          </button>
          {EMOTIONS.map((emo) => (
            <button
              key={emo.key}
              onClick={() => setFilter(emo.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === emo.key ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {emo.emoji} {emo.label}
            </button>
          ))}
        </div>

        {/* 목록 영역 */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-gray-500">불러오는 중...</div>
          ) : diaries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
              작성된 감정 일기가 없습니다. 첫 기록을 남겨보세요!
            </div>
          ) : (
            diaries.map((diary) => {
              const emoMeta = EMOTIONS.find((e) => e.key === diary.emotion) || EMOTIONS[0]
              return (
                <div key={diary.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl p-2 bg-gray-50 rounded-lg">{emoMeta.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${emoMeta.color}`}>
                          {emoMeta.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(diary.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-800 text-sm whitespace-pre-wrap">{diary.content}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(diary.id)}
                    className="text-gray-400 hover:text-red-500 text-sm font-medium px-2 py-1 transition-colors"
                  >
                    삭제
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