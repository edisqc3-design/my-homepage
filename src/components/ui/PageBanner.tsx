'use client'

type Props = {
  title: string
  subtitle?: string
  breadcrumb?: { label: string; href?: string }[]
}

export default function PageBanner({ title, subtitle, breadcrumb }: Props) {
  return (
    <section style={{
      background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
      padding: '64px 24px 56px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 배경 장식 */}
      <div style={{
        position: 'absolute', right: '-60px', top: '-60px',
        width: '320px', height: '320px',
        border: '1px solid rgba(201,168,76,0.1)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: '40px', bottom: '-40px',
        width: '200px', height: '200px',
        border: '1px solid rgba(201,168,76,0.07)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* 브레드크럼 */}
        {breadcrumb && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
            {breadcrumb.map((item, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {i > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>›</span>}
                {item.href ? (
                  <a href={item.href} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                    {item.label}
                  </a>
                ) : (
                  <span style={{ color: 'var(--gold)', fontSize: '0.82rem', fontWeight: 600 }}>{item.label}</span>
                )}
              </span>
            ))}
          </div>
        )}

        <h1 style={{ color: 'var(--white)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, marginBottom: subtitle ? '12px' : '0' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.6 }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
