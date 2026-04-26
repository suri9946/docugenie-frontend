import { useState } from 'react'

export default function Form({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    rawText: '',
    referenceText: '',
    referenceFile: null,
    instructions: '',
    style: 'formal',
  })

  const [error, setError] = useState('')
  const [referenceFileName, setReferenceFileName] = useState('')
  const inputClass = 'field-control'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleReferenceFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setFormData((prev) => ({
      ...prev,
      referenceText: '',
      referenceFile: file,
    }))
    setReferenceFileName(file.name)
  }

  const handleClearReference = () => {
    setFormData((prev) => ({
      ...prev,
      referenceText: '',
      referenceFile: null,
    }))
    setReferenceFileName('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.rawText.trim()) {
      setError('Raw text is required')
      return
    }

    onSubmit(formData)
  }

  return (
    <section className="app-panel flex h-full flex-col overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Create document</h2>
            <p className="mt-1 text-sm text-slate-500">
              Shape rough notes into a polished assignment draft.
            </p>
          </div>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-700">
            New draft
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 space-y-5 overflow-auto p-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        <div>
          <label className="field-label">Title (Optional)</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
            placeholder="Enter document title"
            className={inputClass}
          />
        </div>

        <div>
          <label className="field-label">Subject (Optional)</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g., Machine Learning, History"
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-[0.9fr_1.1fr]">
          <div>
            <label className="field-label">Writing Style</label>
            <select
              name="style"
              value={formData.style}
              onChange={handleChange}
              disabled={loading}
              className={inputClass}
            >
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="academic">Academic</option>
            </select>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
              Ready for class
            </p>
            <p className="mt-1 text-sm text-emerald-900">
              Add your core material below and tune the tone before generating.
            </p>
          </div>
        </div>

        <div>
          <label className="field-label">
            Raw Text <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="rawText"
            value={formData.rawText}
            onChange={handleChange}
            disabled={loading}
            placeholder="Paste your raw text here..."
            rows={5}
            className={`${inputClass} min-h-36 resize-none leading-6`}
          />
        </div>

        <div>
          <label className="field-label">Reference Document (Optional)</label>
          <div className="space-y-2">
            <label className="relative block cursor-pointer">
              <input
                type="file"
                accept=".txt"
                onChange={handleReferenceFileUpload}
                disabled={loading}
                className="sr-only"
              />
              <span className="inline-flex w-full items-center justify-center rounded-xl border border-dashed border-teal-300 bg-teal-50/70 px-4 py-3 text-sm font-semibold text-teal-800 transition hover:border-teal-500 hover:bg-teal-100">
                Upload .txt reference
              </span>
            </label>
            {referenceFileName && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2">
                <span className="truncate text-sm font-medium text-teal-950">
                  Selected: {referenceFileName}
                </span>
                <button
                  type="button"
                  onClick={handleClearReference}
                  disabled={loading}
                  className="text-sm font-semibold text-teal-700 hover:text-teal-950 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="field-label">Instructions (Optional)</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            disabled={loading}
            placeholder="Add any specific instructions..."
            rows={3}
            className={`${inputClass} resize-none leading-6`}
          />
        </div>

        <button type="submit" disabled={loading} className="primary-button mt-2 w-full">
          {loading ? 'Generating...' : 'Generate Document'}
        </button>
      </form>
    </section>
  )
}
