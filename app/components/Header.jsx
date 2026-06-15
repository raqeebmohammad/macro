import {PRODUCTS} from '~/data/products';
import {Suspense, useEffect, useState, useRef} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {useCart} from '~/context/CartContext';
import {SearchFormPredictive} from '~/components/SearchFormPredictive';
import {useFetcher, useNavigate} from 'react-router';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;

  // Scroll effect: add 'scrolled' class to header when user scrolls down
  useEffect(() => {
    const headerEl = document.querySelector('.header');
    const handleScroll = () => {
      if (window.scrollY > 60) {
        headerEl?.classList.add('scrolled');
      } else {
        headerEl?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-top-row">
        <div className="header-left-ctas">
          <button 
            className="header-icon-btn reset" 
            onClick={() => setIsSearchOpen(!isSearchOpen)} 
            aria-label="Search"
            style={{color: isSearchOpen ? 'var(--gold)' : 'inherit'}}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <HeaderMenuMobileToggle />
        </div>
        <NavLink prefetch="intent" to="/" className="header-logo" end style={{display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.1, gap: '4px'}}>
          <span style={{letterSpacing: '0.15em', fontSize: '1.2rem', fontWeight: 600}}>NICHE TRADING</span>
          <span style={{fontSize: '0.85rem', fontWeight: 400, letterSpacing: '0.05em'}}>نيش للتجارة</span>
        </NavLink>
        <div className="header-right-ctas">
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </div>
      </div>
      
      <div className="header-bottom-row">
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </div>

      {isSearchOpen && <HeaderSearchDropdown close={() => setIsSearchOpen(false)} />}
    </header>
  );
}

function HeaderSearchDropdown({close}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input immediately when the dropdown opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputRef.current?.value) {
      navigate(`/search?q=${inputRef.current.value}`);
      close();
    }
  };

  return (
    <div className="header-search-dropdown" style={{
      position: 'absolute', top: 'var(--header-height)', left: '0', 
      width: '100%', background: '#FFFFFF', padding: '2.5rem 2rem',
      borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.08)', zIndex: 1000
    }}>
      <div style={{maxWidth: '800px', margin: '0 auto', position: 'relative'}}>
        <form onSubmit={handleSearch} style={{display: 'flex', alignItems: 'center'}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" style={{position: 'absolute', left: '1rem'}}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            ref={inputRef}
            type="search" 
            placeholder="Search for premium skincare, brands, or rituals..."
            style={{
              width: '100%', padding: '1rem 1rem 1rem 3.5rem', 
              fontSize: '1.2rem', fontFamily: 'Playfair Display, serif',
              color: 'var(--black)', border: 'none', background: '#FAFAFA',
              borderRadius: '4px', outline: 'none'
            }}
          />
          <button type="submit" className="btn-gold" style={{marginLeft: '1rem', padding: '1rem 2.5rem'}}>
            Search
          </button>
        </form>
        <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem', marginLeft: '3.5rem'}}>
          <span style={{fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em'}}>Trending:</span>
          {['Tsubaki', 'Face Cleanser', 'Body Scrub', 'Melano CC'].map(term => (
            <button key={term} onClick={() => { if(inputRef.current) inputRef.current.value = term; handleSearch({preventDefault: () => {}}); }} style={{
              background: 'none', border: 'none', padding: 0, 
              fontSize: '0.8rem', color: 'var(--black)', cursor: 'pointer',
              textDecoration: 'underline', textDecorationColor: 'var(--gold)'
            }}>
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Mega Menu Data Mapping
const getMenuImg = (keyword) => {
  const p = PRODUCTS.find(p => p.collections.includes(keyword) && p.image && !p.image.includes('placehold'));
  return p ? p.image : (PRODUCTS.find(p => !p.image.includes('placehold'))?.image || 'https://placehold.co/600x600');
};

const MEGAMENU_DATA = {
  'BRANDS': {
    promoImage: getMenuImg('skincare'), promoTitle: 'Discover Tsubaki', promoLink: '/collections/all?brand=Tsubaki',
    links: [ { title: 'FWEE', url: '/collections/all?brand=FWEE' }, { title: 'Tsubaki', url: '/collections/all?brand=Tsubaki' }, { title: 'Marvis', url: '/collections/all?brand=Marvis' }, { title: 'Milba Lab', url: '/collections/all?brand=Milba Lab' }, { title: 'Melano CC', url: '/collections/all?brand=Melano CC' }, { title: 'Sakura', url: '/collections/all?brand=Sakura' } ]
  },
  'SKINCARE': {
    promoImage: getMenuImg('skincare'), promoTitle: 'Korean Rituals', promoLink: '/collections/skincare',
    links: [ { title: 'Cleansers & Toners', url: '/collections/face-cleanser' }, { title: 'Moisturizers & Creams', url: '/collections/cream' }, { title: 'Sheet Masks', url: '/collections/face-mask' }, { title: 'All Skincare', url: '/collections/skincare' } ]
  },
  'HAIR CARE': {
    promoImage: getMenuImg('hair-care'), promoTitle: 'Premium Haircare', promoLink: '/collections/hair-care',
    links: [ { title: 'Shampoos', url: '/collections/shampoo' }, { title: 'Hair Color', url: '/collections/hair-color' }, { title: 'All Haircare', url: '/collections/hair-care' } ]
  },
  'BATH & BODY': {
    promoImage: getMenuImg('bath-body'), promoTitle: 'Body Rituals', promoLink: '/collections/bath-body',
    links: [ { title: 'Body Care', url: '/collections/body-care' }, { title: 'Bath & Body', url: '/collections/bath-body' }, { title: 'Deodorants', url: '/collections/deodorant' }, { title: 'Body Spray', url: '/collections/body-spray' }, { title: 'Foot Care', url: '/collections/foot-care' } ]
  },
  'MAKEUP': {
    promoImage: getMenuImg('makeup'), promoTitle: 'Flawless Finish', promoLink: '/collections/makeup',
    links: [ { title: 'Face & Eyes', url: '/collections/makeup' }, { title: 'Lip Products', url: '/collections/lip-product' }, { title: 'Beauty Tools', url: '/collections/beauty-tools' } ]
  },
  'FRAGRANCE': {
    promoImage: getMenuImg('fragrance'), promoTitle: 'Signature Scents', promoLink: '/collections/fragrance',
    links: [ { title: 'Perfumes & Fragrance', url: '/collections/fragrance' }, { title: 'Body Spray', url: '/collections/body-spray' } ]
  },
  'MEN': {
    promoImage: getMenuImg('hair-care'), promoTitle: 'Men\'s Grooming', promoLink: '/collections/deodorant-body-spray-for-men',
    links: [ { title: 'Deodorant Body Spray', url: '/collections/deodorant-body-spray-for-men' } ]
  },
  'GIFTS': {
    promoImage: getMenuImg('bath-body'), promoTitle: 'The Perfect Gift', promoLink: '/collections/oral-care',
    links: [ { title: 'Oral Care Gifts', url: '/collections/oral-care' }, { title: 'Baby Care', url: '/collections/baby-care' }, { title: 'Home Care', url: '/collections/home-care' }, { title: 'Pet Care', url: '/collections/pet-care' } ]
  }
};

/**
 * @param {{
 *   header: HeaderProps['header'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({menu, viewport, publicStoreDomain, primaryDomainUrl}) {
  const [activeMenu, setActiveMenu] = useState(null);

  const className = `header-menu-${viewport}`;
  const isDesktop = viewport === 'desktop';

  // Desktop Mega Menu logic
  const handleMouseEnter = (title) => {
    if (isDesktop) setActiveMenu(title);
  };
  const handleMouseLeave = () => {
    if (isDesktop) setActiveMenu(null);
  };

  const navItems = [
    { title: 'BRANDS', url: '/collections/all' },
    { title: 'SKINCARE', url: '/collections/skincare' },
    { title: 'HAIR CARE', url: '/collections/hair-care' },
    { title: 'BATH & BODY', url: '/collections/bath-body' },
    { title: 'MAKEUP', url: '/collections/makeup' },
    { title: 'FRAGRANCE', url: '/collections/fragrance' },
    { title: 'MEN', url: '/collections/all' },
    { title: 'GIFTS', url: '/collections/all' }
  ];

  return (
    <nav className={className} role="navigation" onMouseLeave={handleMouseLeave}>
      {navItems.map((item) => (
        <MegaMenuNode 
          key={item.title} 
          item={item}
          isOpen={activeMenu === item.title}
          onMouseEnter={() => handleMouseEnter(item.title)}
          onFocus={() => handleMouseEnter(item.title)}
          megaData={MEGAMENU_DATA[item.title]}
        />
      ))}
    </nav>
  );
}

function MegaMenuNode({item, url, megaData, closeAside}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const timerRef = useRef(null);

  // Outside click detection
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // slight delay to prevent snapping
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    closeAside();
    // Blur active element for accessibility focus reset
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div 
      className="nav-mega-wrapper" 
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={(e) => {
        if (!wrapperRef.current.contains(e.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <NavLink
        className="header-menu-item"
        end
        onClick={handleLinkClick}
        prefetch="intent"
        style={activeLinkStyle}
        to={item.url}
        aria-expanded={isOpen}
      >
        {item.title}
      </NavLink>
      <div className={`nav-mega-menu ${isOpen ? 'is-active' : ''}`} aria-hidden={!isOpen}>
        <div className="nav-mega-grid">
          <div className="nav-mega-links-col">
            <span className="nav-mega-heading">Categories</span>
            {megaData.links.map((link, idx) => (
              <NavLink key={idx} to={link.url} className="nav-mega-link" onClick={handleLinkClick}>
                {link.title}
              </NavLink>
            ))}
          </div>
          <div className="nav-mega-links-col">
            <span className="nav-mega-heading">Featured</span>
            <NavLink to="/collections/all" className="nav-mega-link" onClick={handleLinkClick}>New Arrivals</NavLink>
            <NavLink to="/collections/all" className="nav-mega-link" onClick={handleLinkClick}>Bestsellers</NavLink>
          </div>
                  <div className="nav-mega-promo-col">
          <img 
            src={megaData.promoImage.includes('holler') ? 'https://cdn.shopify.com/s/files/1/0581/7889/5936/files/8680690707445.png' : megaData.promoImage} 
            alt={megaData.promoTitle} 
            className="nav-mega-promo-img"
            loading="lazy"
          />
            <div className="nav-mega-promo-overlay">
              <span className="section-eyebrow" style={{color: 'var(--gold)', marginBottom: '0.25rem'}}>Discover</span>
              <h4 className="nav-mega-promo-title">{megaData.promoTitle}</h4>
              <NavLink to="/collections/all" className="btn-gold" style={{alignSelf: 'flex-start', marginTop: '1rem', padding: '0.5rem 1rem'}} onClick={handleLinkClick}>
                Shop Collection
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="header-ctas" role="navigation">
      <NavLink
        prefetch="intent"
        to="/account"
        className="header-icon-btn"
        style={activeLinkStyle}
      >
        <Suspense fallback="Account">
          <Await resolve={isLoggedIn} errorElement="Account">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign In')}
          </Await>
        </Suspense>
      </NavLink>
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      aria-label="Open menu"
      onClick={() => open('mobile')}
    >
      <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
        <line x1="0" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="4" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="8" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    </button>
  );
}

// SearchToggle removed in favor of inline header search

/**
 * @param {{count: number}}
 */
function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      className="header-icon-btn"
      style={{display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none'}}
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      {count > 0 && (
        <span className="cart-count-badge" aria-label={`${count} items in cart`}>
          {count}
        </span>
      )}
    </a>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  const {cartCount} = useCart();
  return <CartBadge count={cartCount} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/1',
      resourceId: null,
      tags: [],
      title: 'CATEGORIES',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/2',
      resourceId: null,
      tags: [],
      title: 'COLLECTIONS',
      type: 'HTTP',
      url: '/collections/all',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/3',
      resourceId: null,
      tags: [],
      title: 'ABOUT US',
      type: 'HTTP',
      url: '/pages/about',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/4',
      resourceId: null,
      tags: [],
      title: 'CONTACT US',
      type: 'HTTP',
      url: '/pages/contact',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/5',
      resourceId: null,
      tags: [],
      title: 'JOIN THE COMMUNITY',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? '800' : '700',
    color: 'var(--black)',
    borderBottom: isActive ? '2px solid var(--black)' : '2px solid transparent',
    paddingBottom: '4px',
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
