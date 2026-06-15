import {useState} from 'react';
import {Link, useParams} from 'react-router';
import {getProductByHandle, getRelatedProducts, CATEGORIES} from '~/data/products';
import {useCart} from '~/context/CartContext';
import {useAside} from '~/components/Aside';

export const meta = ({data}) => {
  const p = data?.product;
  if (!p) return [{title: 'MAHROO | Product'}];
  return [
    {title: `MAHROO | ${p.title} — ${p.brand}`},
    {name: 'description', content: p.description?.substring(0, 160) || ''},
    {rel: 'canonical', href: `/products/${p.handle}`},
  ];
};

export async function loader({params}) {
  const product = getProductByHandle(params.handle);
  if (!product) {
    throw new Response('Product not found', {status: 404});
  }
  const related = getRelatedProducts(params.handle, 4);
  return {product, related};
}

export default function ProductPage() {
  const {handle} = useParams();
  const product = getProductByHandle(handle);
  const related = getRelatedProducts(handle, 4);

  if (!product) {
    return (
      <div style={{minHeight: '100vh', paddingTop: 'var(--header-height)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <h1 style={{fontFamily: 'Playfair Display, serif', color: 'var(--black)'}}>Product not found</h1>
          <Link to="/collections/all" className="btn-gold" style={{marginTop: '1.5rem', display: 'inline-flex'}}>Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', paddingTop: 'var(--header-height)', background: 'var(--surface)'}}>
      <ProductDetailView product={product} related={related} />
    </div>
  );
}

function ProductDetailView({product, related}) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants ? product.variants[0] : null);
  const [activeTab, setActiveTab] = useState('description');
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [mainImage, setMainImage] = useState(product.image);

  const {addToCart} = useCart();
  const {open} = useAside();

  const handleAddToCart = () => {
    addToCart(product, qty);
    open('cart');
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const lastCategory = product.collections && product.collections.length > 0 ? product.collections[product.collections.length - 1] : 'all';
  const categoryLabel = CATEGORIES.find(c => c.id === lastCategory)?.title || lastCategory.replace(/-/g, ' ').toUpperCase();

  return (
    <>
      {/* Toast */}
      {addedToCart && (
        <div style={{
          position: 'fixed', top: '90px', right: '2rem',
          background: 'var(--gold)', color: 'var(--black)',
          padding: '0.85rem 1.75rem', borderRadius: '4px',
          fontSize: '0.8rem', fontWeight: '700',
          zIndex: 1000, animation: 'fadeInUp 0.3s ease',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          ✓ Added to cart!
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{
        maxWidth: 'var(--container)', margin: '0 auto',
        padding: '1.5rem 2.5rem 0',
        display: 'flex', gap: '0.5rem', alignItems: 'center',
        fontSize: '0.7rem', color: 'var(--muted)',
      }}>
        <Link to="/" style={{color: 'var(--muted)', transition: 'color 0.2s'}} onMouseEnter={(e)=>e.target.style.color='var(--gold)'} onMouseLeave={(e)=>e.target.style.color='var(--muted)'}>Home</Link>
        <span>/</span>
        <Link to="/collections/all" style={{color: 'var(--muted)', transition: 'color 0.2s'}} onMouseEnter={(e)=>e.target.style.color='var(--gold)'} onMouseLeave={(e)=>e.target.style.color='var(--muted)'}>All Products</Link>
        <span>/</span>
        <span style={{color: 'var(--gold)'}}>{product.title}</span>
      </div>

      {/* Main Product Section */}
      <div style={{
        maxWidth: 'var(--container)', margin: '0 auto',
        padding: '2.5rem 2.5rem',
      }}
      className="product-grid-wrap"
      >

        {/* Left: Image Gallery */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {/* Main Image */}
          <div style={{
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            background: 'var(--surface-2)',
            aspectRatio: '1/1',
            maxHeight: '600px',
          }}>
            <img
              src={mainImage}
              alt={product.title}
              style={{width: '100%', height: '100%', objectFit: 'cover'}}
              id="product-main-image"
            />
            {product.badge && (
              <span style={{
                position: 'absolute', top: '1.25rem', left: '1.25rem',
                background: 'var(--gold)', color: 'var(--black)',
                padding: '0.35rem 0.85rem',
                fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.1em',
                textTransform: 'uppercase', borderRadius: '100px',
              }}>{product.badge}</span>
            )}
          </div>
          {/* Thumbnails */}
          {product.galleryImages && product.galleryImages.length > 1 && (
            <div style={{display: 'flex', gap: '0.75rem'}}>
              {product.galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  id={`thumb-${i}`}
                  style={{
                    width: '72px', height: '72px',
                    border: mainImage === img ? '2px solid var(--gold)' : '1px solid var(--border-subtle)',
                    borderRadius: '4px', overflow: 'hidden',
                    padding: 0, cursor: 'pointer', background: 'none',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <img src={img} alt={`${product.title} view ${i + 1}`} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
          position: 'sticky', top: 'calc(var(--header-height) + 2rem)', height: 'max-content'
        }}>

          {/* Brand + Category */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span className="product-brand-badge" style={{fontSize: '0.7rem'}}>{product.brand}</span>
            <Link
              to="/collections/all"
              style={{fontSize: '0.6rem', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', border: '1px solid var(--border-subtle)', padding: '0.3rem 0.75rem', borderRadius: '100px', transition: 'all 0.2s'}}
              id={`category-link-${product.category}`}
              onMouseEnter={(e)=>{e.currentTarget.style.color='var(--gold)';e.currentTarget.style.borderColor='var(--gold)'}}
              onMouseLeave={(e)=>{e.currentTarget.style.color='var(--muted)';e.currentTarget.style.borderColor='var(--border-subtle)'}}
            >
              {categoryLabel}
            </Link>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            color: 'var(--black)',
            lineHeight: '1.15',
            margin: 0,
          }}>{product.title}</h1>

          {/* Rating */}
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span style={{color: 'var(--gold)', fontSize: '0.85rem', letterSpacing: '0.1em'}}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span style={{fontSize: '0.75rem', color: 'var(--muted)'}}>{product.rating} ({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.75rem',
            color: 'var(--gold)',
          }}>{product.price}</div>

          {/* Short Description */}
          {product.description && (
            <p style={{fontSize: '0.875rem', color: 'var(--muted)', lineHeight: '1.75', margin: 0}}>
              {product.description.substring(0, 200)}{product.description.length > 200 ? '...' : ''}
            </p>
          )}

          {/* Divider */}
          <div style={{height: '1px', background: 'var(--border-subtle)'}} />

          {/* Variant Selector */}
          {product.variants && product.variants.length > 1 && (
            <div>
              <p style={{fontSize: '0.65rem', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.75rem'}}>
                Select: <span style={{color: 'var(--black)'}}>{selectedVariant}</span>
              </p>
              <div className="product-options-grid">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    id={`variant-${v.toLowerCase().replace(/\s+/g, '-')}`}
                    className="product-options-item"
                    onClick={() => setSelectedVariant(v)}
                    style={{
                      border: selectedVariant === v ? '1px solid var(--gold)' : '1px solid var(--border)',
                      color: selectedVariant === v ? 'var(--gold)' : 'var(--black)',
                      background: selectedVariant === v ? 'rgba(201,169,110,0.08)' : 'transparent',
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p style={{fontSize: '0.65rem', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.75rem'}}>Quantity</p>
            <div style={{display: 'flex', alignItems: 'center', gap: '0', border: '1px solid var(--border)', borderRadius: '4px', width: 'fit-content'}}>
              <button
                id="qty-decrease"
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{width: '40px', height: '40px', background: 'none', border: 'none', color: 'var(--black)', fontSize: '1.25rem', cursor: 'pointer', transition: 'color 0.2s'}}
                onMouseEnter={(e)=>e.target.style.color='var(--gold)'}
                onMouseLeave={(e)=>e.target.style.color='var(--black)'}
              >−</button>
              <span style={{width: '40px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--black)', fontWeight: '500'}}>{qty}</span>
              <button
                id="qty-increase"
                onClick={() => setQty(qty + 1)}
                style={{width: '40px', height: '40px', background: 'none', border: 'none', color: 'var(--black)', fontSize: '1.25rem', cursor: 'pointer', transition: 'color 0.2s'}}
                onMouseEnter={(e)=>e.target.style.color='var(--gold)'}
                onMouseLeave={(e)=>e.target.style.color='var(--black)'}
              >+</button>
            </div>
          </div>

          {/* Add to Cart + Wishlist */}
          <div style={{display: 'flex', gap: '0.75rem'}}>
            <button
              id="add-to-cart-btn"
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              style={{flex: 1}}
            >
              {addedToCart ? '✓ Added to Cart!' : `Add to Cart — ${product.price}`}
            </button>
            <button
              id="wishlist-btn"
              title="Add to Wishlist"
              style={{
                width: '52px', height: '52px', background: 'none',
                border: '1px solid var(--border)', borderRadius: '4px',
                color: 'var(--muted)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', transition: 'all 0.2s',
              }}
              onMouseEnter={(e)=>{e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.color='var(--gold)'}}
              onMouseLeave={(e)=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--muted)'}}
            >
              ♡
            </button>
          </div>

          {/* Trust Badges */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem', padding: '1.25rem',
            background: 'var(--surface)', border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
          }}>
            {[
              {icon: '✓', text: 'Authentic\nProduct'},
              {icon: '🚚', text: 'Fast Qatar\nDelivery'},
              {icon: '📦', text: 'Sealed\nPackaging'},
            ].map((b, i) => (
              <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', textAlign: 'center'}}>
                <span style={{fontSize: '1rem'}}>{b.icon}</span>
                <span style={{fontSize: '0.65rem', color: 'var(--muted)', lineHeight: '1.4', whiteSpace: 'pre-line'}}>{b.text}</span>
              </div>
            ))}
          </div>

          {/* Product Type */}
          {product.productType && (
            <p style={{fontSize: '0.75rem', color: 'var(--muted)'}}>
              Type: <span style={{color: 'var(--black)', fontWeight: '500'}}>{product.productType}</span>
            </p>
          )}
        </div>
      </div>

      {/* Product Detail Accordion — 100% Niche Trading Data */}
      <div style={{maxWidth: '800px', margin: '0 auto', padding: '0 2.5rem 5rem'}}>
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {[
            product.description && { id: 'description', label: 'Description', content: (
              <p style={{fontSize: '0.9rem', color: 'var(--muted)', paddingBottom: '1.5rem', lineHeight: '1.8', whiteSpace: 'pre-line'}}>{product.description}</p>
            )},
            product.ingredients && { id: 'ingredients', label: 'Key Ingredients & Features', content: (
              <div style={{paddingBottom: '1.5rem'}}>
                <p style={{fontSize: '0.85rem', color: 'var(--black-soft)', lineHeight: '2', whiteSpace: 'pre-line'}}>{product.ingredients}</p>
              </div>
            )},
            product.whoFor && { id: 'who-for', label: 'Who It\'s For', content: (
              <p style={{fontSize: '0.9rem', color: 'var(--muted)', paddingBottom: '1.5rem', lineHeight: '1.8', whiteSpace: 'pre-line'}}>{product.whoFor}</p>
            )},
            product.howToUse && { id: 'how-to-use', label: 'How To Use', content: (
              <p style={{fontSize: '0.9rem', color: 'var(--muted)', paddingBottom: '1.5rem', lineHeight: '1.8', whiteSpace: 'pre-line'}}>{product.howToUse}</p>
            )},
          ].filter(Boolean).map((accordion) => (
            <details key={accordion.id} open={accordion.id === 'description'} style={{ borderBottom: '1px solid var(--border)', padding: '1rem 0', cursor: 'pointer' }}>
              <summary style={{ fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--black)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                {accordion.label}
                <span style={{ color: 'var(--gold)' }}>+</span>
              </summary>
              {accordion.content}
            </details>
          ))}
        </div>
      </div>



      {/* Related Products */}
      {related.length > 0 && (
        <div style={{
          background: 'var(--surface)', borderTop: '1px solid var(--border-subtle)',
          padding: '5rem 2.5rem',
        }}>
          <div style={{maxWidth: 'var(--container)', margin: '0 auto'}}>
            <div className="section-header">
              <span className="section-eyebrow">You May Also Like</span>
              <h2 className="section-title" style={{fontSize: '1.75rem'}}>Related Products</h2>
            </div>
            <div className="recommended-products-grid">
              {related.map((p, i) => (
                <Link
                  key={p.id}
                  to={`/products/${p.handle}`}
                  className="product-card"
                  id={`related-${p.id}`}
                  prefetch="intent"
                >
                  <div className="product-card-image-wrap">
                    <img
                      src={p.image}
                      alt={p.title}
                      style={{width: '100%', aspectRatio: '1/1', objectFit: 'cover', transition: 'transform 0.6s ease'}}
                      loading="lazy"
                    />
                    <div className="product-card-quick-add">+ Quick Add</div>
                  </div>
                  <div className="product-card-body">
                    <span className="product-card-brand">{p.brand}</span>
                    <h3 className="product-card-title">{p.title}</h3>
                    <div className="product-card-price">{p.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
