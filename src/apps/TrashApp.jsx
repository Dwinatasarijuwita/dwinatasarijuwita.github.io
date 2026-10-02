import { useEffect, useId, useRef, useState } from 'react'
import AppIcon from '../components/AppIcon'
import { dreams } from '../data/dreams'

const GROUPS = [
  { status: 'not-yet', heading: 'Not Yet' },
  { status: 'no-longer-possible', heading: 'No Longer Possible' },
]

const BADGES = {
  'not-yet': { label: 'Not yet', className: 'bg-amber-100 text-amber-800' },
  'no-longer-possible': { label: 'No longer possible', className: 'bg-gray-200 text-gray-700' },
}

export default function TrashApp() {
  const [selectedId, setSelectedId] = useState(dreams[0].id)
  // Only matters below 520px, where the list and the detail take turns; wider windows show both.
  const [view, setView] = useState('list')
  const [putBack, setPutBack] = useState(false)
  const [confirmingEmpty, setConfirmingEmpty] = useState(false)
  const emptyRef = useRef(null)
  const rootRef = useRef(null)
  const previousViewRef = useRef(view)
  const selected = dreams.find((dream) => dream.id === selectedId)

  useEffect(() => {
    if (previousViewRef.current === view) return
    previousViewRef.current = view
    // The control that switched views is now hidden on narrow layouts, so move focus to its counterpart.
    if (view === 'detail') rootRef.current.querySelector('[data-back]')?.focus()
    else rootRef.current.querySelector(`[data-dream-id="${selectedId}"]`)?.focus()
  }, [view, selectedId])

  function pick(id) {
    setSelectedId(id)
    setView('detail')
    setPutBack(false)
  }

  function closeEmptyAlert() {
    setConfirmingEmpty(false)
    emptyRef.current.focus()
  }

  return (
    <div
      ref={rootRef}
      data-testid="trash"
      data-view={view}
      className="group/trash @container relative flex h-full flex-col bg-white text-gray-900"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-2">
        <p className="text-sm font-medium text-gray-600">Trash — {dreams.length} dreams</p>
        <button
          ref={emptyRef}
          type="button"
          onClick={() => setConfirmingEmpty(true)}
          className="rounded-md border border-gray-300 bg-white px-3 py-0.5 text-sm shadow-sm hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-blue-500"
        >
          Empty
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        <nav
          aria-label="Dreams"
          className="hidden w-full shrink-0 flex-col gap-4 overflow-y-auto bg-gray-50 p-3 group-data-[view=list]/trash:flex @min-[520px]:flex @min-[520px]:w-52 @min-[520px]:border-r @min-[520px]:border-gray-200"
        >
          {GROUPS.map((group) => (
            <section key={group.status}>
              <h3 className="px-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">{group.heading}</h3>
              <ul className="mt-1">
                {dreams
                  .filter((dream) => dream.status === group.status)
                  .map((dream) => (
                    <li key={dream.id}>
                      <button
                        type="button"
                        data-dream-id={dream.id}
                        aria-current={dream.id === selectedId ? 'true' : undefined}
                        onClick={() => pick(dream.id)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-gray-200/70 focus-visible:outline-2 focus-visible:outline-blue-500 aria-[current=true]:bg-gray-200"
                      >
                        <DocumentGlyph className="size-4 shrink-0" />
                        <span className="truncate">{dream.title}</span>
                      </button>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </nav>

        <article className="hidden min-w-0 flex-1 flex-col overflow-y-auto p-6 group-data-[view=detail]/trash:flex @min-[520px]:flex">
          <button
            type="button"
            data-back
            onClick={() => setView('list')}
            className="mb-4 self-start text-sm text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-500 @min-[520px]:hidden"
          >
            ‹ Trash
          </button>

          <header className="flex items-center gap-3">
            <DocumentGlyph className="size-12 shrink-0" />
            <div className="min-w-0">
              <h2 className="text-xl font-semibold leading-snug">{selected.title}</h2>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${BADGES[selected.status].className}`}>
                {BADGES[selected.status].label}
              </span>
            </div>
          </header>

          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-y border-gray-200 py-3 text-sm">
            <dt className="text-gray-500">Where</dt>
            <dd>Dreams › {selected.category}</dd>
            <dt className="text-gray-500">Date Added</dt>
            <dd>{selected.added}</dd>
            <dt className="text-gray-500">Date Deleted</dt>
            <dd>{selected.deleted ?? '—'}</dd>
          </dl>

          <p className="mt-4 leading-relaxed text-gray-700">{selected.story}</p>

          {selected.instead && (
            <section className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">What came instead</h3>
              <p className="mt-1 leading-relaxed text-gray-700">{selected.instead}</p>
            </section>
          )}

          <div className="mt-auto flex flex-col items-end gap-1 pt-6">
            <div className="flex items-center gap-3">
              {selected.status === 'no-longer-possible' && (
                <span className="text-xs text-gray-500">The original location no longer exists.</span>
              )}
              <button
                type="button"
                disabled={selected.status === 'no-longer-possible'}
                onClick={() => setPutBack(true)}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
              >
                Put Back
              </button>
            </div>
            <p aria-live="polite" className="text-xs text-gray-500">
              {putBack ? 'Still on the list — working on it.' : ''}
            </p>
          </div>
        </article>
      </div>

      {confirmingEmpty && <EmptyAlert onClose={closeEmptyAlert} />}
    </div>
  )
}

// A macOS-style confirmation whose only answer is to keep everything: the Trash is never emptied.
function EmptyAlert({ onClose }) {
  const id = useId()
  const keepRef = useRef(null)

  useEffect(() => {
    keepRef.current.focus()
  }, [])

  function onKeyDown(event) {
    if (event.key === 'Escape') onClose()
    // "Keep Them" is the only control, so Tab has nowhere else to go.
    if (event.key === 'Tab') event.preventDefault()
  }

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-body`}
        onKeyDown={onKeyDown}
        className="w-full max-w-xs rounded-xl bg-gray-50 p-5 text-center shadow-2xl ring-1 ring-black/10"
      >
        <AppIcon id="trash" className="mx-auto size-12" />
        <h3 id={`${id}-title`} className="mt-3 text-sm font-semibold">
          Are you sure you want to permanently erase these dreams?
        </h3>
        <p id={`${id}-body`} className="mt-2 text-xs text-gray-600">
          Some dreams are worth keeping, even the ones that didn't happen.
        </p>
        <button
          ref={keepRef}
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          Keep Them
        </button>
      </div>
    </div>
  )
}

function DocumentGlyph({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" strokeLinejoin="round">
      <path d="M6 2.5h8l4.5 4.5v14.5H6z" fill="white" stroke="#9ca3af" />
      <path d="M14 2.5V7h4.5" stroke="#9ca3af" />
      <path d="M8.5 11h7M8.5 14h7M8.5 17h4.5" stroke="#d1d5db" strokeLinecap="round" />
    </svg>
  )
}
