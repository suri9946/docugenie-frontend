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
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">DocuGenie</h1>
        <p className="text-sm text-gray-600 mt-1">AI-Powered Document Generator</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-4">
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title (Optional)
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
            placeholder="Enter document title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        {/* Subject Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject (Optional)
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g., Machine Learning, History"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        {/* Style Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Writing Style
          </label>
          <select
            name="style"
            value={formData.style}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          >
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="academic">Academic</option>
          </select>
        </div>

        {/* Raw Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Raw Text <span className="text-red-500">*</span>
          </label>
          <textarea
            name="rawText"
            value={formData.rawText}
            onChange={handleChange}
            disabled={loading}
            placeholder="Paste your raw text here..."
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
          />
        </div>

        {/* Reference Document Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reference Document (Optional)
          </label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="flex-1 relative cursor-pointer">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleReferenceFileUpload}
                  disabled={loading}
                  className="sr-only"
                />
                <span className="inline-flex w-full items-center justify-center px-3 py-2 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Choose File (.txt)
                </span>
              </label>
            </div>
            {referenceFileName && (
              <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-sm text-blue-900">
                  ✓ {referenceFileName}
                </span>
                <button
                  type="button"
                  onClick={handleClearReference}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructions (Optional)
          </label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            disabled={loading}
            placeholder="Add any specific instructions..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mt-6"
        >
          {loading ? 'Generating...' : 'Generate Document'}
        </button>
      </form>
    </div>
  )
}
