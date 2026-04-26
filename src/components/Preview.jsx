import { useState } from 'react'
import { downloadDocument } from '../services/api'

const PAYMENT_LAUNCH_MESSAGE = 'Downloads will be enabled when payments launch.'

export default function Preview({ preview, locked, loading, documentId }) {
  const [paymentNotice, setPaymentNotice] = useState('')
  const wordCount = preview.split(/\s+/).filter(Boolean).length

  const handlePaymentsComingSoon = () => {
    setPaymentNotice(PAYMENT_LAUNCH_MESSAGE)
  }

  // TODO: Re-enable Razorpay by restoring the checkout flow here when payments launch.

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
          <button
            onClick={handlePaymentsComingSoon}
            disabled={loading}
            className="primary-button bg-gradient-to-r from-slate-950 via-teal-800 to-sky-700 shadow-sky-100 hover:from-slate-900 hover:via-teal-700 hover:to-sky-600"
          >
            Payments Coming Soon
          </button>
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

      {paymentNotice && (
        <div className="border-b border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-amber-950">Payments Coming Soon</p>
              <p className="mt-1 text-sm text-amber-800">{paymentNotice}</p>
            </div>
            <button
              type="button"
              onClick={() => setPaymentNotice('')}
              className="text-sm font-semibold text-amber-700 hover:text-amber-950"
            >
              Close
            </button>
          </div>
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
              className={`mx-auto min-h-full max-w-3xl rounded-xl border border-slate-200 bg-white px-6 py-7 text-sm leading-7 text-slate-700 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:px-9 ${
                locked ? 'blur-sm' : ''
              }`}
            >
              <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
              </div>
              <div className="whitespace-pre-wrap">{preview}</div>
            </article>

            {locked && (
              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-b from-transparent via-white/10 to-white px-5 pb-8">
                <div className="max-w-sm rounded-2xl border border-white bg-white/95 px-6 py-5 text-center shadow-2xl shadow-slate-200 backdrop-blur">
                  <p className="text-sm font-bold text-slate-950">Locked Preview</p>
                  <p className="mt-2 text-sm text-slate-500">{PAYMENT_LAUNCH_MESSAGE}</p>
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
          <span className={locked ? 'text-amber-700' : 'text-emerald-700'}>
            Status: {locked ? 'Locked' : 'Unlocked'}
          </span>
        </div>
      )}
    </section>
  )
}
