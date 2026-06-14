import {Link, useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: `MAHROO | Journal`}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, request}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const [{blogs}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        ...paginationVariables,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {blogs};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Blogs() {
  /** @type {LoaderReturnData} */
  const {blogs} = useLoaderData();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>The Journal</h1>
        <p style={styles.subtitle}>Insights, wellness tips, and brand stories.</p>
        <div style={styles.grid}>
          <PaginatedResourceSection connection={blogs}>
            {({node: blog}) => (
              <Link
                key={blog.handle}
                prefetch="intent"
                to={`/blogs/${blog.handle}`}
                style={styles.card}
              >
                <div style={styles.cardContent}>
                  <h2 style={styles.cardTitle}>{blog.title}</h2>
                  <span style={styles.cardLink}>Explore Category &rarr;</span>
                </div>
              </Link>
            )}
          </PaginatedResourceSection>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: 'calc(var(--header-height) + 4rem) 2rem 6rem',
    background: 'var(--surface)',
    minHeight: '80vh',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '3rem',
    fontWeight: '400',
    color: 'var(--black)',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '1rem',
    color: 'var(--muted)',
    textAlign: 'center',
    marginBottom: '4rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
  },
  card: {
    display: 'block',
    background: 'var(--white)',
    border: '1px solid #E5E5E5',
    textDecoration: 'none',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  cardContent: {
    padding: '2.5rem 2rem',
    textAlign: 'center',
  },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.5rem',
    fontWeight: '400',
    color: 'var(--black)',
    marginBottom: '1rem',
  },
  cardLink: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--gold)',
    fontWeight: '500',
  },
};

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blogs(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    blogs(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        title
        handle
        seo {
          title
          description
        }
      }
    }
  }
`;

/** @typedef {BlogsQuery['blogs']['nodes'][0]} BlogNode */

/** @typedef {import('./+types/blogs._index').Route} Route */
/** @typedef {import('storefrontapi.generated').BlogsQuery} BlogsQuery */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
