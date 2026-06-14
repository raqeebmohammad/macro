import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer">
            <div className="footer-inner">
              {/* Brand column */}
              <div className="footer-brand">
                <h3>MAHROO</h3>
                <p>
                  A curated collection of the world's finest beauty, wellness
                  and personal care rituals — delivered to your door across Qatar
                  and beyond.
                </p>
                <div style={{marginTop: '1.5rem', display: 'flex', gap: '1rem'}}>
                  {['Instagram', 'TikTok', 'WhatsApp'].map((s) => (
                    <a
                      key={s}
                      href={s === 'WhatsApp' ? 'https://wa.me/97400000000' : `https://${s.toLowerCase()}.com/mahroo`}
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: '600',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--muted)',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.target.style.color = 'var(--gold)')}
                      onMouseLeave={(e) => (e.target.style.color = 'var(--muted)')}
                    >
                      {s}
                    </a>
                  ))}
                </div>
              </div>

              {/* Shop column */}
              <div className="footer-col">
                <h4>Shop</h4>
                <ul>
                  <li><NavLink to="/collections/all" style={footerLinkStyle}>All Products</NavLink></li>
                  <li><NavLink to="/collections" style={footerLinkStyle}>Collections</NavLink></li>
                  <li><NavLink to="/search" style={footerLinkStyle}>Search</NavLink></li>
                </ul>
              </div>

              {/* Info column */}
              <div className="footer-col">
                <h4>Info</h4>
                <ul>
                  <li><NavLink to="/pages/about" style={footerLinkStyle}>About Mahroo</NavLink></li>
                  <li><NavLink to="/blogs/journal" style={footerLinkStyle}>The Journal</NavLink></li>
                  <li><NavLink to="/pages/contact" style={footerLinkStyle}>Contact Us</NavLink></li>
                </ul>
              </div>

              {/* Policies column */}
              <div className="footer-col">
                <h4>Policies</h4>
                {footer?.menu && header.shop.primaryDomain?.url ? (
                  <FooterMenu
                    menu={footer.menu}
                    primaryDomainUrl={header.shop.primaryDomain.url}
                    publicStoreDomain={publicStoreDomain}
                  />
                ) : (
                  <ul>
                    {FALLBACK_FOOTER_MENU.items.map((item) => (
                      <li key={item.id}>
                        <NavLink to={item.url} style={footerLinkStyle}>{item.title}</NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Bottom bar */}
            <div className="footer-bottom">
              <p>© 2024 Mahroo. All rights reserved.</p>
              <p style={{color: 'var(--gold)', fontSize: '0.7rem', letterSpacing: '0.1em'}}>
                Curate Your Ritual
              </p>
              <p>Qatar 🇶🇦 — Authentic Products, Fast Delivery</p>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({menu, primaryDomainUrl, publicStoreDomain}) {
  return (
    <ul>
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return (
          <li key={item.id}>
            {isExternal ? (
              <a href={url} rel="noopener noreferrer" target="_blank" style={footerLinkStyle()}>
                {item.title}
              </a>
            ) : (
              <NavLink end prefetch="intent" style={footerLinkStyle} to={url}>
                {item.title}
              </NavLink>
            )}
          </li>
        );
      })}
    </ul>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function footerLinkStyle({isActive, isPending} = {}) {
  return {
    fontWeight: isActive ? '500' : undefined,
    color: isActive ? 'var(--gold)' : isPending ? 'grey' : 'var(--muted)',
    fontSize: '0.83rem',
    transition: 'color 0.2s',
  };
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
