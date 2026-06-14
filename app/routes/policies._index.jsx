import {useLoaderData, Link} from 'react-router';

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const data = await context.storefront.query(POLICIES_QUERY);

  const shopPolicies = data.shop;
  const policies = [
    shopPolicies?.privacyPolicy,
    shopPolicies?.shippingPolicy,
    shopPolicies?.termsOfService,
    shopPolicies?.refundPolicy,
    shopPolicies?.subscriptionPolicy,
  ].filter((policy) => policy != null);

  if (!policies.length) {
    throw new Response('No policies found', {status: 404});
  }

  return {policies};
}

export const meta = () => {
  return [{title: `MAHROO | Legal & Policies`}];
};

export default function Policies() {
  /** @type {LoaderReturnData} */
  const {policies} = useLoaderData();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Legal & Policies</h1>
        <p style={styles.subtitle}>
          Please read our policies carefully.
        </p>
        
        <div style={styles.grid}>
          {policies.map((policy) => (
            <Link to={`/policies/${policy.handle}`} key={policy.id} style={styles.card}>
              <h2 style={styles.cardTitle}>{policy.title}</h2>
              <span style={styles.cardLink}>Read Policy &rarr;</span>
            </Link>
          ))}
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
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.5rem',
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
    marginBottom: '3rem',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    background: 'var(--white)',
    border: '1px solid #E5E5E5',
    textDecoration: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  cardTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '1.1rem',
    fontWeight: '400',
    color: 'var(--black)',
    margin: 0,
  },
  cardLink: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.9rem',
    color: 'var(--gold)',
    fontWeight: '500',
  },
};

const POLICIES_QUERY = `#graphql
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        id
        title
        handle
      }
      shippingPolicy {
        id
        title
        handle
      }
      termsOfService {
        id
        title
        handle
      }
      refundPolicy {
        id
        title
        handle
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
`;
