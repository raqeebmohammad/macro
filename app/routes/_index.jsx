import {useLoaderData, Link, NavLink} from 'react-router';
import {useState, useEffect, useRef} from 'react';
import {PRODUCTS} from '~/data/products';

function useScrollAnimation() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export const meta = () => {
  return [
    {title: 'MAHROO — Curate Your Ritual'},
    {name: 'description', content: 'Premium beauty, wellness & personal care. Authentic global brands delivered across Qatar. Discover your ritual at Mahroo.'},
  ];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);
  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    featuredCollection: collections.nodes[0],
  };
}

function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });
  return {recommendedProducts};
}

export default function Homepage() {
  const data = useLoaderData();

  return (
    <div className="home" style={{paddingTop: '0'}}>
      {/* Hero Section */}
      <HeroSection />

      {/* Marquee Translation Strip */}
      <MarqueeBanner />

      {/* Collections Grid — Shows right below the 60vh banner */}
      <CollectionsSection collection={data.featuredCollection} />

      {/* Bestsellers — Ready to Shop */}
      <BestsellersSection />

      {/* Featured Product Spotlight */}
      <FeaturedSpotlight />

      {/* Editorial Brand Story */}
      <EditorialSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────── */
function HeroSection() {
  const bannerImg = "/korean_beauty_banner.png";

  return (
    <div
      style={{
        position: 'relative', width: '100%', height: '85vh',
        overflow: 'hidden', background: '#000', cursor: 'pointer', zIndex: 200,
        display: 'block'
      }}
      onClick={() => { window.location.href = '/collections/all'; }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') window.location.href = '/collections/all'; }}
      aria-label="Shop K-Beauty Collection"
    >
      <img
        src={bannerImg}
        alt="Premium K-Beauty"
        style={{ width: '100%', height: '85vh', objectFit: 'cover', display: 'block', objectPosition: 'center 15%' }}
        loading="eager"
      />
    </div>
  );
}

/* ── Marquee Translation Strip ───────────────────────────── */
function MarqueeBanner() {
  return (
    <div style={{ background: '#fcfcfc', color: '#333', padding: '12px 20px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 400, borderBottom: '1px solid #eee' }} dir="rtl">
      🌿 تبدأ البشرة الصحية من هنا. • مكونات ممتازة للعناية بشعرك وجسمك • موثوق بها من قبل خبراء التجميل • منتجات العافية والجمال المفضلة لديك تصلك مباشرة إلى باب منزلك • 🌿 تبدأ البشرة الصحية من هنا.
    </div>
  );
}

/* ── Collections Grid ──────────────────────────────────── */
// Dynamically get an image for each category

// Dynamically get an image for each category
const getCatImg = (cat) => PRODUCTS.find(p => p.collections.includes(cat) && p.image && !p.image.includes('placehold'))?.image || PRODUCTS.find(p => !p.image.includes('placehold'))?.image || 'https://placehold.co/600x600/f5f5f5/a3a3a3';

const COLLECTION_CATEGORIES = [
  {title: 'SKINCARE', image: getCatImg('skincare'), url: '/collections/skincare', bg: '#FAFAFA', catId: 'skincare'},
  {title: 'HAIR CARE', image: getCatImg('hair-care'), url: '/collections/hair-care', bg: '#FAFAFA', catId: 'hair-care'},
  {title: 'BATH & BODY', image: getCatImg('bath-body'), url: '/collections/bath-body', bg: '#FAFAFA', catId: 'bath-body'},
  {title: 'MAKEUP', image: getCatImg('makeup'), url: '/collections/makeup', bg: '#FAFAFA', catId: 'makeup'},
  {title: 'FOOD & BEVERAGE', image: getCatImg('food-beverage'), url: '/collections/food-beverage', bg: '#FAFAFA', catId: 'food-beverage'},
];

function CollectionsSection({collection}) {
  return (
    <section className="home-collections" aria-labelledby="collections-heading">
      <div className="section-header">
        <span className="section-eyebrow">Explore</span>
        <h2 className="section-title" id="collections-heading">Shop by Category</h2>
        <p className="section-subtitle">
          Curated selections of the world&rsquo;s most coveted beauty rituals
        </p>
      </div>

      <div className="collections-quad-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', display: 'grid', gap: '1.5rem'}}>
        {COLLECTION_CATEGORIES.map((cat, i) => (
          <Link
            key={i}
            to={cat.url}
            className="collection-card"
            id={`collection-card-${i}`}
            onClick={() => window.scrollTo({top: 0})}
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="collection-card-img"
              loading="lazy"
            />
            <div className="collection-card-overlay">
              <span className="collection-card-label">Curated Collection</span>
              <h3 className="collection-card-title">{cat.title}</h3>
              <div className="collection-card-link">
                Explore Now <span style={{fontSize: '1rem'}}>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── Featured Product Spotlight ─────────────────────────── */
function FeaturedSpotlight() {
  const scrollRef = useScrollAnimation();
  // Pick a real Niche Trading product with a good image and description
  const featured = PRODUCTS.find(p => p.image && !p.image.includes('placehold') && p.description && p.description.length > 100 && p.priceNum > 0) || PRODUCTS[0];
  return (
    <section className="featured-product-section" aria-labelledby="featured-heading">
      <div className="featured-product-inner" style={{opacity: 0}} ref={scrollRef}>
        <div className="featured-product-image-wrap">
          <img
            src={featured.image}
            alt={featured.title}
            style={{width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '8px'}}
            id="featured-product-image"
          />
          <div className="featured-product-badge">Editor&rsquo;s Pick</div>
        </div>
        <div className="featured-product-content">
          <span className="featured-product-eyebrow">Featured — {featured.brand}</span>
          <h2 className="featured-product-title" id="featured-heading">
            {featured.title}
          </h2>
          <div className="featured-product-price">{featured.price}</div>
          <p className="featured-product-description">
            {featured.description?.substring(0, 250)}{featured.description?.length > 250 ? '...' : ''}
          </p>
          {featured.ingredients && (
            <div className="featured-product-features">
              <div className="featured-feature">
                <span className="featured-feature-dot" />
                <span>{featured.ingredients.substring(0, 80)}...</span>
              </div>
            </div>
          )}
          <Link to={`/products/${featured.handle}`} className="btn-gold" id="featured-shop-btn" style={{alignSelf: 'flex-start'}}>
            Shop Now — {featured.price}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Bestsellers ────────────────────────────────────────── */
function BestsellersSection() {
  const bestsellers = PRODUCTS.filter(p => 
    (p.badge === 'Bestseller' || p.rating >= 4.8) && 
    p.image && 
    p.image.trim() !== '' &&
    !p.image.includes('placehold') &&
    !p.image.toLowerCase().includes('no-image') &&
    !p.image.toLowerCase().includes('no+image')
  ).slice(0, 8);

  const scrollRef = useScrollAnimation();

  return (
    <section className="bestsellers-section" aria-labelledby="bestsellers-heading" ref={scrollRef}>
      <div className="section-header" style={{opacity: 0}} ref={useScrollAnimation()}>
        <span className="section-eyebrow">Curated Selection</span>
        <h2 className="section-title" id="bestsellers-heading">Bestsellers</h2>
        <p className="section-subtitle">
          Our most-loved products, chosen by the Mahroo community
        </p>
      </div>

      <div className="recommended-products-grid">
        {bestsellers.map((product, i) => (
          <MahrooProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <div style={{textAlign: 'center', marginTop: '3rem'}}>
        <Link to="/collections/all" className="btn-outline" id="view-all-btn">
          View All Products
        </Link>
      </div>
    </section>
  );
}

function MahrooProductCard({product, index}) {
  return (
    <Link
      to={`/products/${product.handle}`}
      className="product-card"
      id={`product-card-${index}`}
      prefetch="intent"
    >
      <div className="product-card-image-wrap">
        <img
          src={product.image}
          alt={product.title}
          style={{width: '100%', aspectRatio: '1/1', objectFit: 'cover'}}
          loading="lazy"
        />
        {product.badge && (
          <span style={{
            position: 'absolute', top: '0.75rem', left: '0.75rem',
            background: 'var(--gold)', color: 'var(--black)',
            padding: '0.25rem 0.65rem',
            fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.1em',
            textTransform: 'uppercase', borderRadius: '100px',
            zIndex: 5
          }}>
            {product.badge}
          </span>
        )}
        <span className="product-card-quick-add" aria-label={`Quick add ${product.title}`}>
          + Explore Product
        </span>
      </div>
      <div className="product-card-body">
        <span className="product-card-brand">{product.brand}</span>
        <h3 className="product-card-title">{product.title}</h3>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem'}}>
          <div className="product-card-price">{product.price}</div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
            <span style={{color: 'var(--gold)', fontSize: '0.7rem'}}>{'★'.repeat(Math.round(product.rating))}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ProductsSkeleton() {
  return (
    <div className="recommended-products-grid">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="product-card"
          style={{
            aspectRatio: '1/1.4',
            background: 'var(--surface)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  );
}

/* ── Editorial ──────────────────────────────────────────── */
function EditorialSection() {
  return (
    <section className="editorial-section" aria-labelledby="editorial-heading">
      <div className="editorial-inner">
        <span className="section-eyebrow">Our Philosophy</span>
        <div className="gold-divider" />
        <blockquote className="editorial-quote" id="editorial-heading">
          "We believe that every morning routine, every evening ritual, every
          quiet moment of self-care deserves to be elevated into something
          <em> extraordinary</em>."
        </blockquote>
        <div className="gold-divider" />
        <p style={{fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'center', maxWidth: '480px', lineHeight: '1.8'}}>
          Mahroo was born from a love of beautifully crafted products and the
          belief that the world's best beauty rituals should be accessible to
          everyone in Qatar and the region.
        </p>
        <Link to="/pages/about" className="btn-outline" id="editorial-about-btn">
          Discover Our Story
        </Link>
      </div>
    </section>
  );
}

/* ── Testimonials ───────────────────────────────────────── */
const TESTIMONIALS = [
  {
    stars: '★★★★★',
    text: '"Finally a store in Qatar that stocks Marvis. The packaging arrived perfect and delivery was incredibly fast. This is my new go-to for premium beauty."',
    author: 'Fatima A. — Doha',
  },
  {
    stars: '★★★★★',
    text: '"The curation here is unmatched. I discovered brands I had only seen abroad. Mahroo genuinely understands the luxury beauty market."',
    author: 'Sara M. — Lusail',
  },
  {
    stars: '★★★★★',
    text: '"Authentic products, stunning presentation, and a website experience that feels as premium as the products themselves. Truly impressed."',
    author: 'Noor K. — Al Wakrah',
  },
];

function TestimonialsSection() {
  return (
    <section className="testimonials-section" aria-labelledby="testimonials-heading">
      <div className="section-header">
        <span className="section-eyebrow">Community</span>
        <h2 className="section-title" id="testimonials-heading">What Our Clients Say</h2>
      </div>
      <div className="testimonials-grid" style={{maxWidth: 'var(--container)', margin: '0 auto'}}>
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="testimonial-card" id={`testimonial-${i}`}>
            <div className="testimonial-stars">{t.stars}</div>
            <p className="testimonial-text">{t.text}</p>
            <span className="testimonial-author">{t.author}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Newsletter ─────────────────────────────────────────── */
function NewsletterSection() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <section className="newsletter-section" aria-labelledby="newsletter-heading">
      <div className="newsletter-inner">
        <span className="section-eyebrow">Stay Connected</span>
        <h2 className="section-title" id="newsletter-heading" style={{fontSize: '2rem'}}>
          Join the Mahroo Circle
        </h2>
        <p className="section-subtitle" style={{fontSize: '0.85rem'}}>
          Be first to discover new arrivals, exclusive offers, and beauty
          rituals curated just for you.
        </p>
        <form className="newsletter-form" onSubmit={handleSubmit} id="newsletter-form">
          <input
            type="email"
            className="newsletter-input"
            placeholder="Your email address"
            aria-label="Email address"
            id="newsletter-email"
            required
          />
          <button type="submit" className="newsletter-btn" id="newsletter-submit" style={{backgroundColor: subscribed ? 'var(--gold)' : ''}}>
            {subscribed ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>
        <p style={{fontSize: '0.72rem', color: 'var(--muted)'}}>
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

/* ── GraphQL ────────────────────────────────────────────── */
const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
