import {Link} from 'react-router';
import {CartMain} from '~/components/CartMain';

export const meta = () => {
  return [{title: 'MAHROO | Your Cart'}];
};

export default function Cart() {
  return (
    <div className="cart-page">
      <div className="cart-page-inner">
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <span className="section-eyebrow">Mahroo</span>
          <h1 className="cart-page-title" style={{margin: '0.5rem 0 0'}}>Your Cart</h1>
        </div>

        <CartMain layout="page" />

        {/* Continue Shopping link */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <Link
            to="/collections/all"
            style={{
              fontSize: '0.7rem',
              fontWeight: '600',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
