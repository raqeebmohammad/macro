import {useState, useEffect} from 'react';
import {Link, useParams, useNavigate, useSearchParams} from 'react-router';
import {PRODUCTS, CATEGORIES, getProductsByCategory} from '~/data/products';

export const meta = () => {
  return [
    {title: 'MAHROO | All Products — Premium Beauty & Wellness Qatar'},
    {name: 'description', content: 'Shop premium skincare, lip care, fragrance, haircare, body care, oral care & wellness. Authentic brands. Fast Qatar delivery.'},
  ];
};

export async function loader() {
  return {};
}

export default function AllProducts() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const currentCategory = handle && handle !== 'all' ? handle : 'all';
  const [activeCategory, setActiveCategory] = useState(currentCategory);
  const [cartNotification, setCartNotification] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);

  // Dynamic hero from real Niche Trading products
  const HERO_PRODUCTS = PRODUCTS
    .filter(p => p.image && !p.image.includes('placehold') && p.priceNum > 0)
    .slice(0, 4)
    .map(p => ({
      id: p.id,
      title: p.title,
      category: p.productType || 'All',
      image: p.image,
      eyebrow: p.brand,
      linkText: `Shop ${p.productType || 'Now'}`,
      url: `/products/${p.handle}`
    }));

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_PRODUCTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [HERO_PRODUCTS.length]);

  useEffect(() => {
    setActiveCategory(handle && handle !== 'all' ? handle : 'all');
  }, [handle]);

  const [searchParams] = useSearchParams();
  const brandParam = searchParams.get('brand');

  let filteredProducts = getProductsByCategory(activeCategory);
  if (brandParam) {
    filteredProducts = filteredProducts.filter(p => p.brand?.toLowerCase() === brandParam.toLowerCase());
  }

  const addToCart = (product) => {
    setCartNotification(product.title);
    setTimeout(() => setCartNotification(null), 2500);
  };

  return (
    <div className="collections-page">

      {/* Toast Notification */}
      {cartNotification && (
        <div style={{
          position: 'fixed', top: '90px', right: '2rem',
          background: 'var(--gold)', color: 'var(--black)',
          padding: '0.75rem 1.5rem', borderRadius: '4px',
          fontSize: '0.8rem', fontWeight: '600',
          zIndex: 1000, animation: 'fadeInUp 0.3s ease',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}>
          ✓ Added to Cart
        </div>
      )}

      {/* Hero */}
      {currentCategory === 'all' ? (
        <div className="collections-page-hero" style={{position: 'relative', overflow: 'hidden', minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {HERO_PRODUCTS.map((product, idx) => {
          const isActive = idx === heroIndex;
          return (
            <a
              key={product.id}
              href={product.url}
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                opacity: isActive ? 1 : 0,
                visibility: isActive ? 'visible' : 'hidden',
                transition: 'opacity 0.8s ease, transform 0.8s ease',
                transform: isActive ? 'scale(1)' : 'scale(1.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: isActive ? 10 : 1,
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              <img 
                src={product.image} 
                alt={product.title} 
                style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                  objectFit: 'cover', opacity: 0.15, zIndex: -1
                }} 
              />
              <span className="section-eyebrow" style={{color: 'var(--gold)', letterSpacing: '0.3em'}}>
                {product.eyebrow}
              </span>
              <h1 className="section-title" style={{fontSize: 'clamp(2rem,5vw,3.5rem)', color: 'var(--white)', margin: '0.5rem 0 1rem'}}>
                {product.title}
              </h1>
              <span className="btn-gold" style={{padding: '0.6rem 1.5rem', fontSize: '0.8rem', border: 'none'}}>
                {product.linkText}
              </span>
            </a>
          );
        })}
        </div>
      ) : (
        <div style={{
          padding: '6rem 2rem 4rem', 
          textAlign: 'center', 
          background: 'var(--white)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            color: 'var(--black)', 
            textTransform: 'uppercase', 
            fontFamily: '"Playfair Display", serif',
            letterSpacing: '0.1em',
            margin: '0'
          }}>
            {currentCategory.replace('-', ' ')}
          </h1>
          <p style={{
            marginTop: '1rem', 
            color: 'var(--black-soft)', 
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            letterSpacing: '0.05em'
          }}>
            Explore our curated selection of premium {currentCategory.replace('-', ' ')}
          </p>
        </div>
      )}

      {/* Category Tabs */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0',
        position: 'sticky',
        top: 'var(--header-height)',
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: 'var(--container)',
          margin: '0 auto',
          padding: '0 2.5rem',
          overflowX: 'auto',
          display: 'flex',
          gap: '0',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}>
          {[{id: 'all', title: 'All'}, ...CATEGORIES].map((cat) => (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => navigate(cat.id === 'all' ? '/collections/all' : `/collections/${cat.id}`)}
              style={{
                padding: '1rem 1.25rem',
                background: 'none',
                border: 'none',
                borderBottom: activeCategory === cat.id ? '2px solid var(--gold)' : '2px solid transparent',
                color: activeCategory === cat.id ? 'var(--gold)' : 'var(--muted)',
                fontSize: '0.65rem',
                fontWeight: '600',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Product Count */}
      <div style={{
        maxWidth: 'var(--container)', margin: '0 auto',
        padding: '2rem 2.5rem 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <p style={{fontSize: '0.75rem', color: 'var(--muted)'}}>
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          {activeCategory !== 'all' && ` in ${CATEGORIES.find(c => c.id === activeCategory)?.title || activeCategory.replace('-', ' ')}`}
        </p>
      </div>

      {/* Products Grid */}
      <div style={{
        maxWidth: 'var(--container)',
        margin: '0 auto',
        padding: '1.5rem 2.5rem 5rem',
      }}>
        <div className="recommended-products-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))'}}>
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} onAddToCart={addToCart} />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        textAlign: 'center', padding: '4rem 2rem',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <span className="section-eyebrow">Can&rsquo;t find what you need?</span>
        <h2 style={{fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', margin: '0.5rem 0 1.5rem', color: 'var(--cream)'}}>
          Chat with our beauty experts
        </h2>
        <a href="https://wa.me/97400000000" className="btn-gold" target="_blank" rel="noopener noreferrer" id="whatsapp-cta">
          💬 WhatsApp Us
        </a>
      </div>
    </div>
  );
}

function ProductCard({product, index, onAddToCart}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="product-card"
      id={`product-${product.id}`}
      style={{animationDelay: `${index * 0.05}s`}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Link to={`/products/${product.handle}`} className="product-card-image-wrap" prefetch="intent" style={{display: 'block'}}>
        <img
          src={product.image}
          alt={product.title}
          style={{
            width: '100%',
            aspectRatio: '1/1',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
          loading={index < 8 ? 'eager' : 'lazy'}
        />
        {product.badge && (
          <span style={{
            position: 'absolute', top: '0.75rem', left: '0.75rem',
            background: 'var(--gold)', color: 'var(--black)',
            padding: '0.25rem 0.65rem',
            fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.1em',
            textTransform: 'uppercase', borderRadius: '100px',
          }}>
            {product.badge}
          </span>
        )}
        <button
          className="product-card-quick-add"
          onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
          id={`quick-add-${product.id}`}
          aria-label={`Add ${product.title} to cart`}
        >
          + Quick Add
        </button>
      </Link>

      {/* Info */}
      <div className="product-card-body">
        <span className="product-card-brand">{product.brand}</span>
        <Link to={`/products/${product.handle}`} prefetch="intent">
          <h3 className="product-card-title">{product.title}</h3>
        </Link>
        <p style={{fontSize: '0.75rem', color: 'var(--muted)', lineHeight: '1.5', margin: '0.25rem 0'}}>
          {product.shortDescription}
        </p>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem'}}>
          <div className="product-card-price">{product.price}</div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
            <span style={{color: 'var(--gold)', fontSize: '0.7rem'}}>{'★'.repeat(Math.round(product.rating))}</span>
            <span style={{fontSize: '0.65rem', color: 'var(--muted)'}}>({product.reviews})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** @typedef {import('./+types/collections.all').Route} Route */
