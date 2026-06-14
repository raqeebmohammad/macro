import {PRODUCTS} from '~/data/products';
import {Suspense, useEffect, useState, useRef} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {useCart} from '~/context/CartContext';

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

  return (
    <header className="header">
      {/* Desktop Nav (Left) */}
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />

      {/* Centered Logo */}
      <NavLink prefetch="intent" to="/" className="header-logo" style={{textAlign: 'center'}} end>
        MAHROO
      </NavLink>

      {/* CTAs (Right) */}
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  );
}

// Mega Menu Data Mapping
const getMenuImg = (keyword) => {
  const p = PRODUCTS.find(p => p.collections.includes(keyword) && p.image && !p.image.includes('placehold'));
  return p ? p.image : (PRODUCTS.find(p => !p.image.includes('placehold'))?.image || 'https://placehold.co/600x600');
};

const MEGAMENU_DATA = {
  'SKINCARE': {
    promoImage: getMenuImg('skincare'),
    promoTitle: 'Complete Skincare',
    promoLink: '/collections/skincare',
    links: [
      { title: 'Cleansers & Toners', url: '/collections/skincare' },
      { title: 'Serums & Treatments', url: '/collections/skincare' },
      { title: 'Moisturizers', url: '/collections/skincare' },
      { title: 'Sunscreens', url: '/collections/skincare' }
    ]
  },
  'HAIR CARE': {
    promoImage: getMenuImg('hair-care'),
    promoTitle: 'Advanced Hair Care',
    promoLink: '/collections/hair-care',
    links: [
      { title: 'Shampoos & Conditioners', url: '/collections/hair-care' },
      { title: 'Hair Masks', url: '/collections/hair-care' },
      { title: 'Oils & Serums', url: '/collections/hair-care' },
      { title: 'Styling Products', url: '/collections/hair-care' }
    ]
  },
  'BATH & BODY': {
    promoImage: getMenuImg('bath-body'),
    promoTitle: 'Body Rituals',
    promoLink: '/collections/bath-body',
    links: [
      { title: 'Body Wash', url: '/collections/bath-body' },
      { title: 'Lotions & Creams', url: '/collections/bath-body' },
      { title: 'Scrubs & Exfoliants', url: '/collections/bath-body' },
      { title: 'Deodorants', url: '/collections/bath-body' }
    ]
  },
  'MAKEUP': {
    promoImage: getMenuImg('makeup'),
    promoTitle: 'Flawless Finish',
    promoLink: '/collections/makeup',
    links: [
      { title: 'Face Makeup', url: '/collections/makeup' },
      { title: 'Eye Makeup', url: '/collections/makeup' },
      { title: 'Lip Products', url: '/collections/makeup' },
      { title: 'Tools & Brushes', url: '/collections/makeup' }
    ]
  },
  'MORE': {
    promoImage: getMenuImg('fragrance'),
    promoTitle: 'Discover More',
    promoLink: '/collections/all',
    links: [
      { title: 'Food & Beverage', url: '/collections/food-beverage' },
      { title: 'Feminine Care', url: '/collections/feminine-care' },
      { title: 'Fragrance', url: '/collections/fragrance' },
      { title: 'Baby Care', url: '/collections/baby-care' }
    ]
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

  const navItems = ['SKINCARE', 'HAIR CARE', 'BATH & BODY', 'MAKEUP', 'MORE'];

  return (
    <nav className={className} role="navigation" onMouseLeave={handleMouseLeave}>
      {navItems.map((item) => (
        <MegaMenuNode 
          key={item} 
          item={{title: item, url: `/collections/${item.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}}
          isOpen={activeMenu === item}
          onMouseEnter={() => handleMouseEnter(item)}
          onFocus={() => handleMouseEnter(item)}
          megaData={MEGAMENU_DATA[item]}
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
        to={url}
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
      <SearchToggle />
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
      <HeaderMenuMobileToggle />
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

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="header-icon-btn reset" onClick={() => open('search')} aria-label="Search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    </button>
  );
}

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
