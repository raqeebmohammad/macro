import {Link} from 'react-router';
import {useCart} from '~/context/CartContext';
import {useAside} from '~/components/Aside';

export function CartLineItem({item, layout}) {
  const {updateQuantity, removeFromCart} = useCart();
  const {close} = useAside();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <li className="cart-line-item" style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)'}}>
      {item.image && (
        <Link to={`/products/${item.handle}`} onClick={() => layout === 'aside' && close()}>
          <img
            src={item.image}
            alt={item.title}
            width={100}
            height={100}
            style={{objectFit: 'cover', borderRadius: '4px'}}
          />
        </Link>
      )}

      <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div>
            <span style={{fontSize: '0.65rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)'}}>
              {item.brand}
            </span>
            <h3 style={{fontSize: '1rem', margin: '0.25rem 0 0'}}>
              <Link to={`/products/${item.handle}`} onClick={() => layout === 'aside' && close()} style={{textDecoration: 'none', color: 'var(--black)'}}>
                {item.title}
              </Link>
            </h3>
          </div>
          <button 
            onClick={handleRemove}
            style={{background: 'none', border: 'none', fontSize: '1rem', color: 'var(--muted)', cursor: 'pointer'}}
            aria-label="Remove item"
          >
            ✕
          </button>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0', border: '1px solid var(--border)', borderRadius: '4px'}}>
            <button
              onClick={handleDecrease}
              style={{width: '32px', height: '32px', background: 'none', border: 'none', color: 'var(--black)', cursor: 'pointer'}}
            >−</button>
            <span style={{width: '32px', textAlign: 'center', fontSize: '0.85rem', fontWeight: '500'}}>{item.quantity}</span>
            <button
              onClick={handleIncrease}
              style={{width: '32px', height: '32px', background: 'none', border: 'none', color: 'var(--black)', cursor: 'pointer'}}
            >+</button>
          </div>
          
          <div style={{fontWeight: '500', fontSize: '0.95rem'}}>
            QAR {(item.priceNum * item.quantity).toFixed(2)}
          </div>
        </div>
      </div>
    </li>
  );
}
