export default function Modal({ title, onClose, children, wide }) {
  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-2 pt-6 sm:p-4 sm:pt-10">
      <div className={`modal-card w-full ${wide ? 'max-w-4xl' : 'max-w-lg'} rounded-lg bg-white shadow-xl`}>
        <div className="no-print flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="modal-body max-h-[85vh] overflow-y-auto p-3 sm:p-5">{children}</div>
      </div>
    </div>
  )
}
