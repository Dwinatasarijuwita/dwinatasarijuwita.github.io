import { useEffect, useRef, useState } from 'react'
import AppIcon from '../AppIcon'
import { TrafficLight } from './Window'

const TITLE = 'Force Quit Applications'

export default function ForceQuitDialog({ apps, onQuit, onQuitAll, onClose }) {
  // Remembering the row as well as the app lets the selection settle on its neighbour once the app quits.
  const [choice, setChoice] = useState({ id: apps[0]?.id, index: 0 })
  const listRef = useRef(null)
  const refocusList = useRef(true)
  const keptIndex = apps.findIndex((app) => app.id === choice.id)
  const index = keptIndex === -1 ? Math.min(choice.index, apps.length - 1) : keptIndex
  const current = apps[index]
  const openIds = apps.map((app) => app.id).join(' ')

  // Quitting the front app hands it to the next window, which takes focus; this runs after that and wins it back.
  useEffect(() => {
    if (!refocusList.current) return
    refocusList.current = false
    listRef.current?.focus()
  }, [openIds])

  function select(next) {
    if (apps[next]) setChoice({ id: apps[next].id, index: next })
  }

  function quit() {
    if (!current) return
    refocusList.current = true
    onQuit(current.id)
  }

  function onListKeyDown(event) {
    if (event.key === 'ArrowDown') select(index + 1)
    else if (event.key === 'ArrowUp') select(index - 1)
    else if (event.key === 'Enter') quit()
    else return
    event.preventDefault()
  }

  return (
    <section
      role="dialog"
      aria-label={TITLE}
      onKeyDown={(event) => event.key === 'Escape' && onClose()}
      className="absolute left-1/2 top-[18%] z-[900] flex w-[340px] max-w-[calc(100%-32px)] -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl dark:border-white/15 dark:bg-neutral-900"
    >
      <div className="flex h-10 shrink-0 select-none items-center bg-gray-100 px-3 shadow-[inset_0_-1px_0_rgb(0_0_0/0.05)] dark:bg-neutral-800 dark:shadow-[inset_0_-1px_0_rgb(0_0_0/0.4)]">
        <div className="group flex w-[52px]">
          <TrafficLight className="bg-[#ff5f57]" label={`Close ${TITLE}`} symbol="close" onClick={onClose} />
        </div>
        <h2 className="flex-1 truncate text-center text-sm font-medium text-gray-700 dark:text-neutral-300">{TITLE}</h2>
        <div className="w-[52px]" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-3 p-4 text-[13px] text-gray-900 dark:text-neutral-100">
        <p>If an app doesn’t respond for a while, select its name and click Force Quit.</p>
        <ul
          ref={listRef}
          role="listbox"
          aria-label="Open apps"
          tabIndex={0}
          aria-activedescendant={current ? `force-quit-${current.id}` : undefined}
          onKeyDown={onListKeyDown}
          className="group/list h-44 overflow-auto rounded-md border border-black/10 bg-white py-1 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/15 dark:bg-neutral-950"
        >
          {apps.map((app, i) => (
            <li
              key={app.id}
              id={`force-quit-${app.id}`}
              role="option"
              aria-selected={i === index}
              onClick={() => select(i)}
              className="mx-1 flex cursor-default items-center gap-2 rounded px-2 py-1 aria-selected:bg-gray-200 group-focus/list:aria-selected:bg-blue-500 group-focus/list:aria-selected:text-white dark:aria-selected:bg-neutral-700 dark:group-focus/list:aria-selected:bg-blue-600"
            >
              <AppIcon id={app.id} tiled className="size-5 shrink-0" />
              {app.title}
            </li>
          ))}
        </ul>
        {apps.length === 0 && <p className="-mt-1 text-gray-500 dark:text-neutral-400">No apps are open.</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={apps.length === 0}
            onClick={() => {
              refocusList.current = true
              onQuitAll()
            }}
            className="rounded-md border border-black/10 bg-white px-3 py-1 shadow-sm disabled:opacity-50 dark:border-white/15 dark:bg-neutral-700"
          >
            Quit All
          </button>
          <button
            type="button"
            disabled={!current}
            onClick={quit}
            className="rounded-md bg-blue-500 px-3 py-1 text-white shadow-sm disabled:opacity-50 dark:bg-blue-600"
          >
            Force Quit
          </button>
        </div>
      </div>
    </section>
  )
}
