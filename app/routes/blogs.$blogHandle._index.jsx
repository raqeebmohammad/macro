import {Link, useLoaderData} from 'react-router';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `MAHROO | ${data?.blog.title ?? 'Journal'}`}];
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
async function loadCriticalData({context, request, params}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  if (!params.blogHandle) {
    throw new Response(`blog not found`, {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        blogHandle: params.blogHandle,
        ...paginationVariables,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.blogHandle, data: blog});

  return {blog};
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

export default function Blog() {
  /** @type {LoaderReturnData} */
  const {blog} = useLoaderData();
  const {articles} = blog;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.backNav}>
          <Link to="/blogs" style={styles.backLink}>&larr; Back to Journal Categories</Link>
        </div>
        <h1 style={styles.title}>{blog.title}</h1>
        <div style={styles.grid}>
          <PaginatedResourceSection connection={articles}>
            {({node: article, index}) => (
              <ArticleItem
                article={article}
                key={article.id}
                loading={index < 2 ? 'eager' : 'lazy'}
              />
            )}
          </PaginatedResourceSection>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   article: ArticleItemFragment;
 *   loading?: HTMLImageElement['loading'];
 * }}
 */
function ArticleItem({article, loading}) {
  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));
  return (
    <Link to={`/blogs/${article.blog.handle}/${article.handle}`} style={styles.articleCard}>
      {article.image && (
        <div style={styles.imageWrapper}>
          <Image
            alt={article.image.altText || article.title}
            aspectRatio="3/2"
            data={article.image}
            loading={loading}
            sizes="(min-width: 768px) 50vw, 100vw"
            style={styles.image}
          />
        </div>
      )}
      <div style={styles.articleContent}>
        <h3 style={styles.articleTitle}>{article.title}</h3>
        <p style={styles.articleDate}>{publishedAt}</p>
        <span style={styles.readMore}>Read Article &rarr;</span>
      </div>
    </Link>
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
  backNav: {
    marginBottom: '2rem',
  },
  backLink: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.9rem',
    color: 'var(--muted)',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '3rem',
    fontWeight: '400',
    color: 'var(--black)',
    marginBottom: '3rem',
    borderBottom: '1px solid #E5E5E5',
    paddingBottom: '1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '3rem 2rem',
  },
  articleCard: {
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'none',
    transition: 'transform 0.3s ease',
  },
  imageWrapper: {
    width: '100%',
    overflow: 'hidden',
    marginBottom: '1.5rem',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  articleContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  articleTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.5rem',
    fontWeight: '400',
    color: 'var(--black)',
    marginBottom: '0.5rem',
  },
  articleDate: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.9rem',
    color: 'var(--muted)',
    marginBottom: '1rem',
  },
  readMore: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--gold)',
    fontWeight: '500',
    marginTop: 'auto',
  },
};

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      handle
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          hasNextPage
          endCursor
          startCursor
        }

      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
`;

/** @typedef {import('./+types/blogs.$blogHandle._index').Route} Route */
/** @typedef {import('storefrontapi.generated').ArticleItemFragment} ArticleItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
