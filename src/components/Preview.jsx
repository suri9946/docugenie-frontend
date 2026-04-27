import { useState } from 'react'
import { downloadDocument, initiateUPIPayment, verifyPayment } from '../services/api'

export default function Preview({ preview, locked, loading, documentId }) {
  const [paymentStatus, setPaymentStatus] = useState('idle') // idle, loading, processing, success, error
  const [paymentError, setPaymentError] = useState('')
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [transactionRef, setTransactionRef] = useState(null)

  const wordCount = preview.split(/\s+/).filter(Boolean).length

  const upiProviders = [
    { id: 'google_pay', name: 'Google Pay', icon: '🔵' },
    { id: 'phonepe', name: 'PhonePe', icon: '💜' },
    { id: 'paytm', name: 'Paytm', icon: '🔵' },
    { id: 'generic', name: 'Generic UPI', icon: '↔️' },
  ]

  const handleInitiatePayment = async (provider) => {
    try {
      setPaymentStatus('loading')
      setPaymentError('')
      setSelectedProvider(provider)

      const response = await initiateUPIPayment({
        documentId,
        provider,
        amount: 20,
      })

      if (!response.success) {
        throw new Error(response.message || 'Failed to initiate payment')
      }

      setTransactionRef(response.data.transactionRef)
      setPaymentStatus('processing')

      // Open the UPI deep link
      if (response.data.deepLink) {
        window.location.href = response.data.deepLink

        // Poll for payment verification after a delay
        setTimeout(() => verifyPaymentAfterReturn(), 2000)
      }
    } catch (err) {
      console.error('Payment initiation error:', err)
      setPaymentError(err.message || 'Failed to initiate payment')
      setPaymentStatus('error')
      setSelectedProvider(null)
    }
  }

  const verifyPaymentAfterReturn = async () => {
    if (!transactionRef) return

    try {
      setPaymentStatus('loading')
      const response = await verifyPayment({
        transactionRef,
        documentId,
      })

      if (response.success && response.data.verified) {
        setPaymentStatus('success')
        // Trigger parent component to refresh or unlock
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setPaymentStatus('idle')
      }
    } catch (err) {
      console.error('Payment verification error:', err)
      setPaymentStatus('idle')
    }
  }

  const handleManualVerify = async () => {
    if (!transactionRef) {
      setPaymentError('No transaction reference available')
      return
    }
    await verifyPaymentAfterReturn()
  }

  return (
    <section className="app-panel flex h-full flex-col overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
            Live preview
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">Final draft</h2>
        </div>

        {locked ? (
          paymentStatus === 'success' ? (
            <button
              onClick={() => downloadDocument(documentId)}
              disabled={loading}
              className="primary-button bg-green-600 hover:bg-green-700"
            >
              ✓ Download Unlocked
            </button>
          ) : (
            <button
              onClick={() => setPaymentStatus(paymentStatus === 'idle' ? 'processing' : 'idle')}
              disabled={loading || paymentStatus === 'loading'}
              className="primary-button bg-gradient-to-r from-slate-950 via-teal-800 to-sky-700 shadow-sky-100 hover:from-slate-900 hover:via-teal-700 hover:to-sky-600"
            >
              {paymentStatus === 'loading' ? 'Processing...' : paymentStatus === 'processing' ? 'Verify Payment' : 'Unlock with UPI'}
            </button>
          )
        ) : (
          <button
            onClick={() => downloadDocument(documentId)}
            disabled={loading || !documentId}
            className={loading || !documentId ? 'secondary-button' : 'primary-button'}
          >
            {loading ? 'Downloading...' : 'Download'}
          </button>
        )}
      </div>

      {/* Payment UI */}
      {locked && paymentStatus !== 'success' && (
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          {paymentStatus === 'idle' && (
            <div>
              <p className="text-sm font-bold text-slate-900 mb-3">
                Full document access: ₹20
              </p>
              <p className="text-xs text-slate-600 mb-4">
                Choose your UPI app to complete payment securely
              </p>
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {upiProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleInitiatePayment(provider.id)}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition ${selectedProvider === provider.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-300 hover:border-blue-400'
                      }`}
                  >
                    <span className="text-lg">{provider.icon}</span>
                    <span className="text-xs font-medium">{provider.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={handleManualVerify}
                className="text-xs text-slate-600 hover:text-slate-900 underline"
              >
                Already paid? Verify manually
              </button>
            </div>
          )}

          {paymentError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <p className="text-sm text-red-700">{paymentError}</p>
              <button
                onClick={() => setPaymentStatus('idle')}
                className="text-xs text-red-600 hover:text-red-800 mt-1 underline"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-slate-50/70 to-white">
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-11 w-11 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin"></div>
              <p className="mt-4 text-sm font-semibold text-slate-700">
                Preparing your preview...
              </p>
            </div>
          </div>
        ) : preview ? (
          <div className="relative flex-1 overflow-auto p-5 sm:p-7">
            <article
              className={`mx-auto min-h-full max-w-3xl rounded-xl border border-slate-200 bg-white px-6 py-7 text-sm leading-7 text-slate-700 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:px-9 ${locked && paymentStatus !== 'success' ? 'blur-sm' : ''
                }`}
            >
              <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
              </div>
              <div className="whitespace-pre-wrap">{preview}</div>
            </article>

            {locked && paymentStatus !== 'success' && (
              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-b from-transparent via-white/10 to-white px-5 pb-8">
                <div className="max-w-sm rounded-2xl border border-white bg-white/95 px-6 py-5 text-center shadow-2xl shadow-slate-200 backdrop-blur">
                  <p className="text-sm font-bold text-slate-950">Locked Preview</p>
                  <p className="mt-2 text-sm text-slate-500">Full document unlocks after payment (₹20)</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6 text-center">
            <div className="max-w-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-teal-700 shadow-lg shadow-teal-100">
                D
              </div>
              <p className="text-lg font-bold text-slate-900">Your document preview appears here</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Fill in the form and generate a draft to review formatting, flow, and word count.
              </p>
            </div>
          </div>
        )}
      </div>

      {preview && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-white px-6 py-3 text-xs font-semibold text-slate-500">
          <span>Words: {wordCount}</span>
          <span className={locked && paymentStatus !== 'success' ? 'text-amber-700' : 'text-emerald-700'}>
            Status: {paymentStatus === 'success' ? 'Unlocked ✓' : locked ? 'Locked' : 'Unlocked'}
          </span>
        </div>
      )}
    </section>
  )
}
