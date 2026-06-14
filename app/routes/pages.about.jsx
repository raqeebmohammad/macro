import {Link} from 'react-router';

/**
 * Static About page for MAHROO — no Shopify data needed.
 * Accessible at /pages/about
 */
export const meta = () => {
  return [
    {title: 'MAHROO | Our Story — Premium Beauty Qatar'},
    {name: 'description', content: 'Discover the story behind Mahroo — Qatar\'s premier destination for authentic premium beauty, skincare, and wellness products.'},
  ];
};

export async function loader() {
  return {};
}

export default function AboutPage() {
  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: 'var(--header-height)',
      background: 'var(--surface)',
    }}>

      {/* Hero */}
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '5rem 2.5rem',
        background: 'linear-gradient(135deg, var(--black) 0%, var(--surface) 50%, var(--black) 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(201,169,110,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        <div style={{position: 'relative', zIndex: 1, maxWidth: '700px'}}>
          <span className="section-eyebrow" style={{display: 'block', marginBottom: '1.5rem'}}>Est. Qatar</span>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: '500',
            color: 'transparent',
            background: 'linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 40%, var(--gold-dark) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            letterSpacing: '0.3em',
            marginBottom: '1.5rem',
          }}>
            MAHROO
          </h1>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
            color: 'rgba(245,240,232,0.65)',
            lineHeight: '1.6',
          }}>
            "Curate Your Ritual"
          </p>
        </div>
      </div>

      {/* Brand Story */}
      <div style={{
        maxWidth: '820px',
        margin: '0 auto',
        padding: '6rem 2.5rem',
      }}>
        <div style={{display: 'grid', gap: '4rem'}}>

          {/* Section 1 */}
          <div style={{textAlign: 'center'}}>
            <span className="section-eyebrow" style={{display: 'block', marginBottom: '1rem'}}>Our Origin</span>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: 'var(--cream)',
              marginBottom: '1.5rem',
            }}>
              Born from a love of beautiful things
            </h2>
            <p style={{fontSize: '0.95rem', color: 'var(--muted)', lineHeight: '1.85', maxWidth: '600px', margin: '0 auto'}}>
              Mahroo was founded with a single belief: that the world's finest beauty rituals
              deserve to be experienced by everyone in Qatar and the region. We were tired of
              seeing premium products unavailable locally or sold through unreliable channels.
              So we built the store we always wanted to shop from.
            </p>
          </div>

          {/* Gold divider */}
          <div style={{
            width: '60px', height: '1px',
            background: 'var(--gold)',
            margin: '0 auto',
          }} />

          {/* Values Grid */}
          <div>
            <span className="section-eyebrow" style={{display: 'block', textAlign: 'center', marginBottom: '2.5rem'}}>What Sets Us Apart</span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
            }}>
              {[
                {title: '100% Authentic', desc: 'Every product is sourced directly from authorized distributors. Sealed, genuine, guaranteed.', icon: '✦'},
                {title: 'Curated Selection', desc: 'We don\'t stock everything. We stock the best — from Marvis to Aesop, Byredo to La Mer.', icon: '◈'},
                {title: 'Fast Delivery', desc: 'Same-day and next-day delivery across Doha, Lusail, Al Wakrah, and all of Qatar.', icon: '◎'},
                {title: 'Expert Guidance', desc: 'Our team are beauty enthusiasts first. We help you find products that genuinely work.', icon: '✧'},
              ].map((v) => (
                <div key={v.title} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '2rem',
                  textAlign: 'center',
                  transition: 'border-color 0.3s',
                }}>
                  <div style={{fontSize: '1.5rem', color: 'var(--gold)', marginBottom: '1rem'}}>{v.icon}</div>
                  <h3 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1rem',
                    color: 'var(--cream)',
                    marginBottom: '0.75rem',
                  }}>{v.title}</h3>
                  <p style={{fontSize: '0.8rem', color: 'var(--muted)', lineHeight: '1.7', margin: 0}}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div style={{textAlign: 'center'}}>
            <span className="section-eyebrow" style={{display: 'block', marginBottom: '1rem'}}>Featured Brands</span>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: 'var(--cream)',
              marginBottom: '2rem',
            }}>
              The world's finest, in one place
            </h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              justifyContent: 'center',
            }}>
              {['MARVIS', 'AESOP', 'BYREDO', 'LA MER', 'TATCHA', 'DRUNK ELEPHANT', 'KIEHL\'S', 'CHARLOTTE TILBURY', 'JO MALONE', 'NARS', 'GLOW RECIPE', 'PAULA\'S CHOICE', 'THE ORDINARY', 'FENTY BEAUTY', 'CHANTECAILLE'].map((brand) => (
                <span key={brand} style={{
                  padding: '0.4rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '100px',
                  fontSize: '0.65rem',
                  fontWeight: '600',
                  letterSpacing: '0.12em',
                  color: 'var(--muted)',
                }}>{brand}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
          }}>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.75rem',
              color: 'var(--cream)',
              marginBottom: '1rem',
            }}>
              Ready to curate your ritual?
            </h2>
            <p style={{fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '2rem'}}>
              Discover our full collection of premium beauty and wellness products.
            </p>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
              <Link to="/collections/all" className="btn-gold" id="about-shop-btn">
                Shop Now
              </Link>
              <a href="https://wa.me/97455555555" className="btn-outline" target="_blank" rel="noopener noreferrer" id="about-whatsapp-btn">
                Contact Us
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
