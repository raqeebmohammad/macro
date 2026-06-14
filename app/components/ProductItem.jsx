import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

/**
 * Premium MAHROO ProductItem card used across collection & search pages.
 * @param {{
 *   product: CollectionItemFragment | ProductItemFragment | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  return (
    <Link
      className="product-card"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
      id={`product-item-${product.handle}`}
    >
      <div className="product-card-image-wrap">
        {image ? (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
          />
        ) : (
          <div style={{
            width: '100%',
            aspectRatio: '1/1',
            background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--surface-3) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '2.5rem',
              color: 'rgba(201,169,110,0.2)',
              letterSpacing: '0.2em',
            }}>M</span>
          </div>
        )}
        <div className="product-card-quick-add">+ Quick Add</div>
      </div>
      <div className="product-card-body">
        <span className="product-card-brand">Mahroo</span>
        <h3 className="product-card-title">{product.title}</h3>
        <div className="product-card-price">
          <Money data={product.priceRange.minVariantPrice} />
        </div>
      </div>
    </Link>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
