import { Fragment, useLayoutEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'

import { departments } from '../data/departments'

/* ============================================================
   Departments: a vertical tab rail with the selected department in a
   pane beside it on desktop, and an accordion on mobile, from one set
   of markup. Each department is a button followed by its own panel, so
   on a narrow screen the pairs simply stack; on a wide screen the grid
   places every button in the first column and the open panel in the
   second. One department is open at a time in both, the first by
   default, and the buttons carry the disclosure semantics that work in
   either layout.

   Incoming /about/departments#slug links open that department. The
   heading id matches the slug so the router can scroll to it instead
   of leaving the reader at the top of the page.
   ============================================================ */

function slugFromHash(hash: string) {
  return hash.replace('#', '')
}

export function Departments() {
  const hash = useRouterState({ select: (s) => slugFromHash(s.location.hash) })
  const fromHash = departments.findIndex((d) => d.slug === hash)
  const [open, setOpen] = useState(() => (fromHash >= 0 ? fromHash : 0))

  useLayoutEffect(() => {
    if (fromHash >= 0) setOpen(fromHash)
  }, [fromHash])

  return (
    <div
      className="dept"
      style={{ '--dept-count': departments.length } as React.CSSProperties}
    >
      {departments.map((d, i) => {
        const isOpen = open === i
        return (
          <Fragment key={d.slug}>
            <h3 className="dept-tab-h" id={d.slug}>
              <button
                type="button"
                className={isOpen ? 'dept-tab is-open' : 'dept-tab'}
                id={`dept-tab-${d.slug}`}
                aria-expanded={isOpen}
                aria-controls={`dept-panel-${d.slug}`}
                onClick={() => setOpen(i)}
              >
                <span className="dept-tab-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {d.tab}
                <span className="dept-tab-mark" aria-hidden="true" />
              </button>
            </h3>
            <div
              className="dept-panel"
              id={`dept-panel-${d.slug}`}
              role="region"
              aria-labelledby={`dept-tab-${d.slug}`}
              hidden={!isOpen}
            >
              <h4 className="dept-panel-h">{d.name}</h4>
              {d.motto ? <p className="motto">{d.motto}</p> : null}
              {d.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              <p className="dept-cap-h">Key capabilities include:</p>
              <ul className="dept-caps">
                {d.capabilities.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}
