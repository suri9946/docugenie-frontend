import { useState } from 'react'
import Form from './components/Form'
import Preview from './components/Preview'
import { generateDocument } from './services/api'

function App() {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState('')
  const [locked, setLocked] = useState(false)
  const [documentId, setDocumentId] = useState(null)
  const [error, setError] = useState('')

  const handleGenerateDocument = async (formData) => {
    try {
      setLoading(true)
      setError('')

      const response = await generateDocument(formData)

      if (!response.success) {
        throw new Error(response.message || 'Failed to generate document')
      }

      setPreview(response.data.preview)
      setLocked(response.data.locked)
      setDocumentId(response.data.metadata.documentId)
    } catch (err) {
      console.error(err)
      setError(err.message || err.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto h-screen md:h-[calc(100vh-3rem)]">
        {/* Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {/* Left: Form */}
          <div className="flex flex-col min-h-0">
            <Form onSubmit={handleGenerateDocument} loading={loading} />
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Right: Preview */}
          <div className="flex flex-col min-h-0">
            <Preview
              preview={preview}
              locked={locked}
              loading={loading}
              documentId={documentId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
