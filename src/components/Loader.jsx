export default function Loader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="inline-block">
          <div className="h-12 w-12 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin"></div>
        </div>
        <p className="mt-4 font-semibold text-slate-700">Generating document...</p>
      </div>
    </div>
  )
}
