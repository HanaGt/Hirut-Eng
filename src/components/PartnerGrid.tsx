import type { Partner } from '../data/site'

export function PartnerGrid({
  partners,
  label,
  compact,
}: {
  partners: readonly Partner[]
  label: string
  compact?: boolean
}) {
  return (
    <ul className={compact ? 'partner-grid partner-grid--compact' : 'partner-grid'} aria-label={label}>
      {partners.map((partner) => (
        <li key={partner.name}>
          <figure className={partner.logo ? 'partner-card' : 'partner-card partner-card--text'}>
            {partner.logo ? (
              <img
                src={partner.logo}
                alt=""
                width={720}
                height={720}
                loading="eager"
                decoding="async"
              />
            ) : null}
            <figcaption>{partner.name}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}
