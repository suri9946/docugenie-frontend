import { useState } from 'react'
import { downloadDocument } from '../services/api'

const PAYMENT_LAUNCH_MESSAGE = 'Downloads will be enabled when payments launch.'

export default function Preview({ preview, locked, loading, documentId }) {
  const [paymentNotice, setPaymentNotice] = useState('')

  const handlePaymentsComingSoon = () => {
    setPaymentNotice(PAYMENT_LAUNCH_MESSAGE)
  }

  // TODO: Re-enable Razorpay by restoring the checkout flow here when payments launch.

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
        {locked ? (
          <button
            onClick={handlePaymentsComingSoon}
            disabled={loading}
            className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-slate-900 via-purple-700 to-blue-700 shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.01] disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
          >
            Payments Coming Soon
          </button>
        ) : (
          <button
            onClick={() => downloadDocument(documentId)}
            disabled={loading || !documentId}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              loading || !documentId
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Downloading...' : 'Download'}
          </button>
        )}
      </div>

      {/* Payment Notice */}
      {paymentNotice && (
        <div className="p-4 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-amber-900">Payments Coming Soon</p>
              <p className="text-sm text-amber-800">{paymentNotice}</p>
            </div>
            <button
              type="button"
              onClick={() => setPaymentNotice('')}
              className="text-sm font-medium text-amber-700 hover:text-amber-900"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <p className="mt-3 text-gray-600 text-sm">Generating preview...</p>
            </div>
          </div>
        ) : preview ? (
          <div className="flex-1 overflow-auto relative">
            {/* Preview Content */}
            <div
              className={`p-6 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap ${
                locked ? 'blur-sm' : ''
              }`}
            >
              {preview}
            </div>

            {/* Lock Overlay */}
            {locked && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white flex items-end justify-center pb-8">
                <div className="text-center bg-white px-6 py-4 rounded-lg shadow-lg border border-gray-200">
                  <p className="text-gray-600 font-medium text-sm mb-3">Locked Preview</p>
                  <p className="text-xs text-gray-500">{PAYMENT_LAUNCH_MESSAGE}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-lg">Document Preview</p>
              <p className="mt-2 text-sm">Generate a document to see preview</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      {preview && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-600">
          Words: {preview.split(/\s+/).filter(Boolean).length} | Status:{' '}
          {locked ? 'Locked' : 'Unlocked'}
        </div>
      )}
    </div>
  )
}
