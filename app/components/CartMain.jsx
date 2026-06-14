import {useCart} from '~/context/CartContext';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {useAside} from '~/components/Aside';

export function CartMain({layout}) {
  const {cartItems, cartCount} = useCart();
  const className = `cart-main`;
  const cartHasItems = cartCount > 0;

  return (
    <section
      className={className}
      aria-label={layout === 'page' ? 'Cart page' : 'Cart drawer'}
    >
      <CartEmpty hidden={cartHasItems} layout={layout} />
      <div className="cart-details">
        <p id="cart-lines" className="sr-only">
          Line items
        </p>
        <div>
          <ul aria-labelledby="cart-lines" style={{listStyle: 'none', padding: 0, margin: 0}}>
            {cartItems.map((item) => (
              <CartLineItem
                key={item.id}
                item={item}
                layout={layout}
              />
            ))}
          </ul>
        </div>
        {cartHasItems && <CartSummary layout={layout} />}
      </div>
    </section>
  );
}

function CartEmpty({hidden = false, layout}) {
  const {close} = useAside();
  return (
    <div hidden={hidden} style={{textAlign: 'center', padding: '3rem 1rem'}}>
      <div style={{
        width: '64px', height: '64px',
        border: '1px solid var(--border)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 1.5rem',
        color: 'var(--gold)',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      </div>
      <h2 style={{fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', margin: '0 0 0.5rem'}}>Your cart is empty</h2>
      <p style={{color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '2rem'}}>
        Discover our curated selection of premium beauty.
      </p>
      <a
        href="/collections/all"
        onClick={() => {
          if (layout === 'aside') close();
        }}
        className="btn-gold"
        style={{textDecoration: 'none', display: 'inline-block'}}
      >
        Explore Collection
      </a>
    </div>
  );
}
