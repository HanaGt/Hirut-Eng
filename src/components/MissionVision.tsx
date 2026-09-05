import { useLayoutEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'

import { coreValues, mission, purpose, vision, type Statement } from '../data/about'

/* Interactive reading surfaces for mission / vision / values.
   One statement and one value are in focus at a time — the rest stay
   available as a map, the same pattern as departments. Incoming hashes
   (#our-mission, #value-integrity) open the matching item. */

const STATEMENTS: Statement[] = [vision, mission, purpose]

function slugFromHash(hash: string) {
  return hash.replace('#', '')
}

function statementSlug(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-')
}

function valueSlug(name: string) {
  return `value-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
}

export function StatementSwitcher() {
  const hash = useRouterState({ select: (s) => slugFromHash(s.location.hash) })
  const fromHash = STATEMENTS.findIndex((s) => statementSlug(s.title) === hash)
  const [open, setOpen] = useState(() => (fromHash >= 0 ? fromHash : 0))

  useLayoutEffect(() => {
    if (fromHash >= 0) setOpen(fromHash)
  }, [fromHash])

  return (
    <div className="found">
      <div className="found-tabs">
        {STATEMENTS.map((s, i) => {
          const slug = statementSlug(s.title)
          const isOpen = open === i
          return (
            <h3 className="found-tab-h" id={slug} key={slug}>
              <button
                type="button"
                className={isOpen ? 'found-tab is-open' : 'found-tab'}
                id={`found-tab-${slug}`}
                aria-expanded={isOpen}
                aria-controls={`found-panel-${slug}`}
                onClick={() => setOpen(i)}
              >
                <span className="found-tab-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {s.title}
              </button>
            </h3>
          )
        })}
      </div>
      {STATEMENTS.map((s, i) => {
        const slug = statementSlug(s.title)
        const isOpen = open === i
        const [lead, ...rest] = s.paragraphs
        return (
          <article
            key={slug}
            className="found-pane"
            id={`found-panel-${slug}`}
            role="region"
            aria-labelledby={`found-tab-${slug}`}
            hidden={!isOpen}
          >
            <p className="found-pane-num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </p>
            <p className="statement-p statement-p--lead">{lead}</p>
            {rest.map((p) => (
              <p className="statement-p" key={p.slice(0, 40)}>
                {p}
              </p>
            ))}
          </article>
        )
      })}
    </div>
  )
}

export function ValueBoard() {
  const hash = useRouterState({ select: (s) => slugFromHash(s.location.hash) })
  const fromHash = coreValues.findIndex((v) => valueSlug(v.name) === hash)
  const [open, setOpen] = useState(() => (fromHash >= 0 ? fromHash : 0))

  useLayoutEffect(() => {
    if (fromHash >= 0) setOpen(fromHash)
  }, [fromHash])

  return (
    <div className="value-board">
      <div className="value-index">
        {coreValues.map((v, i) => {
          const slug = valueSlug(v.name)
          const isOpen = open === i
          return (
            <div className="value-pick-h" id={slug} key={slug}>
              <button
                type="button"
                className={isOpen ? 'value-pick is-open' : 'value-pick'}
                id={`value-tab-${slug}`}
                aria-expanded={isOpen}
                aria-controls={`value-panel-${slug}`}
                onClick={() => setOpen(i)}
              >
                <span className="value-pick-num" aria-hidden="true">
                  {v.n}
                </span>
                {v.name}
              </button>
            </div>
          )
        })}
      </div>
      {coreValues.map((v, i) => {
        const slug = valueSlug(v.name)
        const isOpen = open === i
        const following = coreValues[(i + 1) % coreValues.length]
        return (
          <div
            key={slug}
            className="value-stage"
            id={`value-panel-${slug}`}
            role="region"
            aria-labelledby={`value-tab-${slug}`}
            hidden={!isOpen}
          >
            <p className="value-stage-num" aria-hidden="true">
              {v.n}
              <span> / {String(coreValues.length).padStart(2, '0')}</span>
            </p>
            <h3>{v.name}</h3>
            <p className="value-stage-body">{v.body}</p>
            <button
              type="button"
              className="value-stage-next"
              onClick={() => setOpen((i + 1) % coreValues.length)}
            >
              Next, {following.name} <span className="arrow" aria-hidden="true">→</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
