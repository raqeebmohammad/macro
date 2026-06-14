import {useLoaderData, Link} from 'react-router';
import {getPaginationVariables, Analytics, Money} from '@shopify/hydrogen';
import {SearchForm} from '~/components/SearchForm';
import {SearchResults} from '~/components/SearchResults';
import {getEmptyPredictiveSearchResult} from '~/lib/search';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: `MAHROO | Search`}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({request, context}) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  const searchPromise = isPredictive
    ? predictiveSearch({request, context})
    : regularSearch({request, context});

  searchPromise.catch((error) => {
    console.error(error);
    return {term: '', result: null, error: error.message};
  });

  return await searchPromise;
}

/* ─── Small inline style objects (avoids adding a new CSS file) ─── */
const styles = {
  page: {
    background: 'var(--surface)',
    minHeight: '100vh',
  },
  hero: {
    paddingTop: 'var(--header-height)',
    background: '#FFFFFF',
    borderBottom: '1px solid var(--border-subtle)',
    textAlign: 'center',
    padding: 'calc(var(--header-height) + 3.5rem) 2rem 3.5rem',
  },
  eyebrow: {
    display: 'block',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    marginBottom: '0.75rem',
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
    fontWeight: 500,
    color: 'var(--black)',
    marginBottom: '0.5rem',
    lineHeight: 1.15,
  },
  heroSubtitle: {
    fontFamily: "'Playfair Display', serif",
    fontStyle: 'italic',
    fontSize: '1rem',
    color: 'var(--muted)',
    marginBottom: '2.5rem',
  },
  divider: {
    width: 40,
    height: 1,
    background: 'var(--gold)',
    margin: '0 auto 2.5rem',
  },
  formWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    maxWidth: 600,
    margin: '0 auto',
  },
  input: {
    flex: 1,
    background: '#FAFAFA',
    border: '1px solid var(--border-subtle)',
    color: 'var(--black)',
    padding: '0.85rem 1.25rem',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.9rem',
    outline: 'none',
    borderRadius: '2px',
    transition: 'border-color 0.2s ease',
  },
  submitBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'var(--gold)',
    color: 'var(--black)',
    border: 'none',
    padding: '0.85rem 1.75rem',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: '2px',
    transition: 'background 0.2s ease',
    whiteSpace: 'nowrap',
  },
  resultsWrap: {
    maxWidth: 'var(--container)',
    margin: '0 auto',
    padding: '4rem 2rem 6rem',
  },
  sectionLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    marginBottom: '1.5rem',
    display: 'block',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--border-subtle)',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginBottom: '4rem',
  },
  productCard: {
    position: 'relative',
    background: 'var(--surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '2px',
    overflow: 'hidden',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  productImageWrap: {
    position: 'relative',
    aspectRatio: '1 / 1.15',
    overflow: 'hidden',
    background: '#FAFAFA',
  },
  productImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease',
    display: 'block',
  },
  productBody: {
    padding: '1rem 1.1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    flex: 1,
  },
  productBrand: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
  },
  productTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '0.95rem',
    fontWeight: 500,
    color: 'var(--black)',
    lineHeight: 1.3,
    margin: 0,
  },
  productPrice: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'var(--gold)',
    marginTop: 'auto',
    paddingTop: '0.5rem',
  },
  listSection: {
    marginBottom: '3rem',
  },
  listItem: {
    borderBottom: '1px solid var(--border-subtle)',
  },
  listLink: {
    display: 'block',
    padding: '0.9rem 0',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.88rem',
    color: 'var(--black)',
    transition: 'color 0.2s ease, padding-left 0.2s ease',
    textDecoration: 'none',
  },
  emptyWrap: {
    textAlign: 'center',
    padding: '5rem 2rem',
  },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.5rem',
    color: 'var(--black)',
    marginBottom: '0.75rem',
  },
  emptyText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.88rem',
    color: 'var(--muted)',
    lineHeight: 1.7,
  },
  errorMsg: {
    background: '#FFF5F5',
    border: '1px solid #FFCCCC',
    borderRadius: '2px',
    color: '#C0392B',
    padding: '0.75rem 1rem',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.85rem',
    maxWidth: 600,
    margin: '1.5rem auto 0',
    textAlign: 'center',
  },
};

/**
 * Renders the /search route
 */
export default function SearchPage() {
  /** @type {LoaderReturnData} */
  const {type, term, result, error} = useLoaderData();
  if (type === 'predictive') return null;

  const hasResults = term && result?.total > 0;
  const products = result?.items?.products?.nodes ?? [];
  const pages    = result?.items?.pages?.nodes    ?? [];
  const articles = result?.items?.articles?.nodes ?? [];

  return (
    <div style={styles.page}>
      {/* ── Hero Header ── */}
      <section style={styles.hero}>
        <span style={styles.eyebrow}>Discover</span>
        <h1 style={styles.heroTitle}>Search</h1>
        <p style={styles.heroSubtitle}>Find your perfect ritual</p>
        <div style={styles.divider} />

        {/* Search Form */}
        <SearchForm>
          {({inputRef}) => (
            <div style={styles.formWrap}>
              <input
                defaultValue={term}
                name="q"
                placeholder="Search products, collections, articles…"
                ref={inputRef}
                type="search"
                style={styles.input}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              />
              <button
                type="submit"
                style={styles.submitBtn}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold-light)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--gold)'; }}
              >
                Search
              </button>
            </div>
          )}
        </SearchForm>

        {error && <p style={styles.errorMsg}>{error}</p>}
      </section>

      {/* ── Results ── */}
      <div style={styles.resultsWrap}>
        {!hasResults ? (
          /* ── Empty State ── */
          <div style={styles.emptyWrap}>
            <div style={{...styles.divider, marginBottom: '2rem'}} />
            {term ? (
              <>
                <p style={styles.emptyTitle}>No results for &ldquo;{term}&rdquo;</p>
                <p style={styles.emptyText}>
                  Try different keywords, or explore our collections.
                </p>
              </>
            ) : (
              <>
                <p style={styles.emptyTitle}>Begin your search</p>
                <p style={styles.emptyText}>
                  Enter a keyword above to discover products, articles, and more.
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            {/* ── Products ── */}
            {products.length > 0 && (
              <section style={{marginBottom: '4rem'}}>
                <span style={styles.sectionLabel}>
                  Products &mdash; {products.length} result{products.length !== 1 ? 's' : ''}
                </span>
                <div style={styles.productsGrid}>
                  {products.map((product) => {
                    const variant = product.selectedOrFirstAvailableVariant;
                    const img     = variant?.image;
                    return (
                      <Link
                        key={product.id}
                        to={`/products/${product.handle}`}
                        style={styles.productCard}
                        className="search-product-card"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.07)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={styles.productImageWrap}>
                          {img ? (
                            <img
                              src={img.url}
                              alt={img.altText ?? product.title}
                              width={img.width ?? 400}
                              height={img.height ?? 400}
                              style={styles.productImg}
                            />
                          ) : (
                            <div style={{...styles.productImg, background: '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                              <span style={{fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase'}}>No Image</span>
                            </div>
                          )}
                        </div>
                        <div style={styles.productBody}>
                          {product.vendor && (
                            <span style={styles.productBrand}>{product.vendor}</span>
                          )}
                          <p style={styles.productTitle}>{product.title}</p>
                          {variant?.price && (
                            <div style={styles.productPrice}>
                              <Money data={variant.price} />
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── Pages ── */}
            {pages.length > 0 && (
              <section style={styles.listSection}>
                <span style={styles.sectionLabel}>
                  Pages &mdash; {pages.length} result{pages.length !== 1 ? 's' : ''}
                </span>
                <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                  {pages.map((page) => (
                    <li key={page.id} style={styles.listItem}>
                      <Link
                        to={`/pages/${page.handle}`}
                        style={styles.listLink}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.paddingLeft = '0.5rem'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--black)'; e.currentTarget.style.paddingLeft = '0'; }}
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ── Articles ── */}
            {articles.length > 0 && (
              <section style={styles.listSection}>
                <span style={styles.sectionLabel}>
                  Journal &mdash; {articles.length} result{articles.length !== 1 ? 's' : ''}
                </span>
                <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                  {articles.map((article) => (
                    <li key={article.id} style={styles.listItem}>
                      <Link
                        to={`/blogs/journal/${article.handle}`}
                        style={styles.listLink}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.paddingLeft = '0.5rem'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--black)'; e.currentTarget.style.paddingLeft = '0'; }}
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>

      <Analytics.SearchView data={{searchTerm: term, searchResults: result}} />
    </div>
  );
}

/**
 * Regular search query and fragments
 * (adjust as needed)
 */
const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
      product {
        handle
        title
      }
    }
  }
`;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
`;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
`;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/search
export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    articles: search(
      query: $term,
      types: [ARTICLE],
      first: $first,
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
    pages: search(
      query: $term,
      types: [PAGE],
      first: $first,
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      sortKey: RELEVANCE,
      types: [PRODUCT],
      unavailableProducts: HIDE,
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

/**
 * Regular search fetcher
 * @param {Pick<
 *   Route.LoaderArgs,
 *   'request' | 'context'
 * >}
 * @return {Promise<RegularSearchReturn>}
 */
async function regularSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, {pageBy: 8});
  const term = String(url.searchParams.get('q') || '');

  // Search articles, pages, and products for the `q` term
  const {errors, ...items} = await storefront.query(SEARCH_QUERY, {
    variables: {...variables, term},
  });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc, {nodes}) => acc + nodes.length,
    0,
  );

  const error = errors
    ? errors.map(({message}) => message).join(', ')
    : undefined;

  return {type: 'regular', term, error, result: {total, items}};
}

/**
 * Predictive search query and fragments
 * (adjust as needed)
 */
const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    blog {
      handle
    }
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    trackingParameters
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
    }
  }
`;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/predictiveSearch
const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      articles {
        ...PredictiveArticle
      }
      collections {
        ...PredictiveCollection
      }
      pages {
        ...PredictivePage
      }
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
`;

/**
 * Predictive search fetcher
 * @param {Pick<
 *   Route.ActionArgs,
 *   'request' | 'context'
 * >}
 * @return {Promise<PredictiveSearchReturn>}
 */
async function predictiveSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term) return {type, term, result: getEmptyPredictiveSearchResult()};

  // Predictively search articles, collections, pages, products, and queries (suggestions)
  const {predictiveSearch: items, errors} = await storefront.query(
    PREDICTIVE_SEARCH_QUERY,
    {
      variables: {
        // customize search options as needed
        limit,
        limitScope: 'EACH',
        term,
      },
    },
  );

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors.map(({message}) => message).join(', ')}`,
    );
  }

  if (!items) {
    throw new Error('No predictive search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc, item) => acc + item.length,
    0,
  );

  return {type, term, result: {items, total}};
}

/** @typedef {import('./+types/search').Route} Route */
/** @typedef {import('~/lib/search').RegularSearchReturn} RegularSearchReturn */
/** @typedef {import('~/lib/search').PredictiveSearchReturn} PredictiveSearchReturn */
/** @typedef {import('storefrontapi.generated').RegularSearchQuery} RegularSearchQuery */
/** @typedef {import('storefrontapi.generated').PredictiveSearchQuery} PredictiveSearchQuery */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
