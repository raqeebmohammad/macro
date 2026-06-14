import {useId} from 'react';
import {useCart} from '~/context/CartContext';
import {Link} from 'react-router';

export function CartSummary({layout}) {
  const {cartSubtotal} = useCart();
  const className = layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';
  const summaryId = useId();

  return (
    <div aria-labelledby={summaryId} className={className}>
      <h4 id={summaryId} style={{fontSize: '0.65rem', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', margin: '0 0 1rem'}}>Order Summary</h4>
      
      <dl role="group" className="cart-subtotal" style={{marginBottom: '0.75rem'}}>
        <dt className="cart-subtotal-label">Subtotal</dt>
        <dd className="cart-subtotal-amount">
          QAR {cartSubtotal.toFixed(2)}
        </dd>
      </dl>

      <p style={{fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '1.25rem'}}>
        Shipping and taxes calculated at checkout.
      </p>

      <div style={{marginTop: '1.25rem'}}>
        <Link
          to="/checkout"
          className="btn-gold"
          style={{width: '100%', display: 'flex', justifyContent: 'center', textDecoration: 'none', padding: '1rem'}}
          id="checkout-btn"
          onClick={(e) => {
            e.preventDefault();
            alert('This is a prototype. Checkout is disabled.');
          }}
        >
          Proceed to Checkout →
        </Link>
      </div>
    </div>
  );
}
