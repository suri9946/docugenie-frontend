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
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl flex-col">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              Academic workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              DocuGenie
            </h1>
          </div>
          <div className="rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            Draft, preview, and export from one clean desk
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex min-h-0 flex-col">
            <Form onSubmit={handleGenerateDocument} loading={loading} />
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}
          </div>

          <div className="flex min-h-[34rem] flex-col lg:min-h-0">
            <Preview
              preview={preview}
              locked={locked}
              loading={loading}
              documentId={documentId}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
