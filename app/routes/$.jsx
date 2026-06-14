import {Link} from 'react-router';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'MAHROO | Page Not Found'},
    {
      name: 'description',
      content: 'The page you are looking for does not exist.',
    },
  ];
};

export async function loader({request}) {
  return new Response(null, {
    status: 404,
  });
}

export default function NotFoundPage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>404</h1>
        <h2 style={styles.subtitle}>Page Not Found</h2>
        <p style={styles.text}>
          We couldn't find the page you were looking for. It might have been
          removed, renamed, or did not exist in the first place.
        </p>
        <Link to="/collections/all" style={styles.button}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--header-height) 2rem 5rem',
    background: 'var(--surface)',
  },
  container: {
    maxWidth: '500px',
    textAlign: 'center',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '6rem',
    fontWeight: '400',
    color: 'var(--gold)',
    lineHeight: 1,
    marginBottom: '1rem',
  },
  subtitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2rem',
    fontWeight: '400',
    color: 'var(--black)',
    marginBottom: '1rem',
  },
  text: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '1rem',
    color: 'var(--muted)',
    lineHeight: 1.6,
    marginBottom: '2rem',
  },
  button: {
    display: 'inline-block',
    background: 'var(--gold)',
    color: 'var(--white)',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.9rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    padding: '1rem 2rem',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease',
  },
};
