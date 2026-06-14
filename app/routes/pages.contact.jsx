import {useState} from 'react';

/**
 * Static Contact page for MAHROO — no Shopify data needed.
 * Accessible at /pages/contact
 */
export const meta = () => {
  return [
    {title: 'MAHROO | Contact Us'},
    {
      name: 'description',
      content:
        'Get in touch with the MAHROO team. We are here to help with orders, press inquiries, wholesale partnerships, and more.',
    },
  ];
};

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  function handleChange(e) {
    setFormState((prev) => ({...prev, [e.target.name]: e.target.value}));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleReset() {
    setFormState({name: '', email: '', subject: '', message: ''});
    setSubmitted(false);
  }

  const inputBase = {
    width: '100%',
    background: 'var(--surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '4px',
    padding: '0.875rem 1.125rem',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.875rem',
    color: 'var(--black)',
    outline: 'none',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
    display: 'block',
    boxSizing: 'border-box',
  };

  const inputFocused = {
    borderColor: 'var(--gold)',
    boxShadow: '0 0 0 3px rgba(197,160,89,0.12)',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: '600',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    marginBottom: '0.5rem',
  };

  const contactItems = [
    {
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
      label: 'Email',
      value: 'hello@mahroo.com',
      href: 'mailto:hello@mahroo.com',
    },
    {
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      ),
      label: 'Phone',
      value: '+974 4400 0000',
      href: 'tel:+97444000000',
    },
    {
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
      label: 'Location',
      value: 'Doha, Qatar',
      href: null,
    },
    {
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Hours',
      value: 'Mon–Sat  9am – 6pm',
      href: null,
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: 'var(--header-height)',
        background: 'var(--surface)',
      }}
    >
      {/* ── Hero ─────────────────────────────────────────── */}
      <div
        style={{
          minHeight: '52vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '5rem 2.5rem',
          background:
            'linear-gradient(160deg, #FDFBF8 0%, #F9F3E8 50%, #FDFBF8 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(197,160,89,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,0.04) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Soft radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '300px',
            background:
              'radial-gradient(ellipse at center, rgba(197,160,89,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{position: 'relative', zIndex: 1, maxWidth: '640px'}}>
          <span
            className="section-eyebrow"
            style={{display: 'block', marginBottom: '1.5rem'}}
          >
            We&rsquo;d love to hear from you
          </span>

          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: '500',
              color: 'transparent',
              background:
                'linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 45%, var(--gold-dark) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              letterSpacing: '0.28em',
              marginBottom: '1.5rem',
              lineHeight: '1.1',
            }}
          >
            CONTACT US
          </h1>

          <p
            style={{
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(0.95rem, 2.2vw, 1.2rem)',
              color: 'var(--muted)',
              lineHeight: '1.7',
              maxWidth: '480px',
              margin: '0 auto',
            }}
          >
            Questions, collaborations, or just want to say hello — our team is
            ready to assist you.
          </p>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────── */}
      <div
        style={{
          maxWidth: 'var(--container)',
          margin: '0 auto',
          padding: '6rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.6fr)',
          gap: '5rem',
          alignItems: 'start',
        }}
        className="contact-layout"
      >
        {/* ── Left: Contact Info ────────────────────────── */}
        <div>
          <span
            className="section-eyebrow"
            style={{display: 'block', marginBottom: '1rem'}}
          >
            Reach Out
          </span>
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              color: 'var(--black)',
              marginBottom: '0.75rem',
              lineHeight: '1.3',
            }}
          >
            Let&rsquo;s start a conversation
          </h2>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--muted)',
              lineHeight: '1.85',
              marginBottom: '3rem',
            }}
          >
            Whether you have a question about an order, want to explore a
            wholesale partnership, or are reaching out for press — we are here
            and happy to help.
          </p>

          {/* Contact info cards */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
            {contactItems.map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.25rem',
                  padding: '1.25rem 1.5rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(197,160,89,0.35)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 20px rgba(197,160,89,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    'var(--border-subtle)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Icon badge */}
                <div
                  style={{
                    flexShrink: 0,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(197,160,89,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold)',
                  }}
                >
                  {item.icon}
                </div>

                <div>
                  <p
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: '600',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      margin: '0 0 0.25rem',
                    }}
                  >
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: 'var(--black)',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = 'var(--gold)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = 'var(--black)')
                      }
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: 'var(--black)',
                        margin: 0,
                      }}
                    >
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Gold divider + note */}
          <div
            style={{
              marginTop: '3rem',
              paddingTop: '2.5rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '1px',
                background: 'var(--gold)',
                marginBottom: '1.25rem',
              }}
            />
            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--muted)',
                lineHeight: '1.8',
              }}
            >
              We typically respond within{' '}
              <span style={{color: 'var(--gold)', fontWeight: '600'}}>
                1–2 business days
              </span>
              . For urgent order issues, please reference your order number in
              the subject field.
            </p>
          </div>
        </div>

        {/* ── Right: Contact Form ───────────────────────── */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            boxShadow: '0 8px 48px rgba(45,45,45,0.06)',
          }}
        >
          {submitted ? (
            /* ── Success State ─────────────────────── */
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
              }}
            >
              {/* Animated checkmark circle */}
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(197,160,89,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'successPop 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              >
                <svg
                  width="32"
                  height="32"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>

              <div>
                <h2
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.75rem',
                    color: 'var(--black)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Message Sent
                </h2>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--muted)',
                    lineHeight: '1.8',
                    maxWidth: '360px',
                    margin: '0 auto',
                  }}
                >
                  Thank you for reaching out. A member of our team will be in
                  touch with you within 1–2 business days.
                </p>
              </div>

              <button
                onClick={handleReset}
                className="btn-gold"
                id="contact-send-another-btn"
                style={{marginTop: '0.5rem'}}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            /* ── Form ────────────────────────────────── */
            <form onSubmit={handleSubmit} noValidate>
              <div style={{marginBottom: '2rem'}}>
                <span
                  className="section-eyebrow"
                  style={{display: 'block', marginBottom: '0.5rem'}}
                >
                  Send a Message
                </span>
                <h2
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.5rem',
                    color: 'var(--black)',
                  }}
                >
                  How can we help?
                </h2>
              </div>

              {/* ── Name + Email row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.25rem',
                  marginBottom: '1.25rem',
                }}
                className="form-row"
              >
                {/* Full Name */}
                <div>
                  <label htmlFor="contact-name" style={labelStyle}>
                    Full Name <span style={{color: 'var(--gold)'}}>*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Aisha Al-Mansouri"
                    value={formState.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...inputBase,
                      ...(focusedField === 'name' ? inputFocused : {}),
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" style={labelStyle}>
                    Email Address <span style={{color: 'var(--gold)'}}>*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formState.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...inputBase,
                      ...(focusedField === 'email' ? inputFocused : {}),
                    }}
                  />
                </div>
              </div>

              {/* ── Subject */}
              <div style={{marginBottom: '1.25rem'}}>
                <label htmlFor="contact-subject" style={labelStyle}>
                  Subject <span style={{color: 'var(--gold)'}}>*</span>
                </label>
                <div style={{position: 'relative'}}>
                  <select
                    id="contact-subject"
                    name="subject"
                    required
                    value={formState.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...inputBase,
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      cursor: 'pointer',
                      color: formState.subject ? 'var(--black)' : 'rgba(45,45,45,0.4)',
                      paddingRight: '2.5rem',
                      ...(focusedField === 'subject' ? inputFocused : {}),
                    }}
                  >
                    <option value="" disabled>
                      Select a topic…
                    </option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="press">Press &amp; Collaboration</option>
                    <option value="wholesale">Wholesale</option>
                  </select>
                  {/* Custom chevron */}
                  <div
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: 'var(--gold)',
                    }}
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* ── Message */}
              <div style={{marginBottom: '2rem'}}>
                <label htmlFor="contact-message" style={labelStyle}>
                  Message <span style={{color: 'var(--gold)'}}>*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Tell us how we can help you…"
                  value={formState.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...inputBase,
                    resize: 'vertical',
                    minHeight: '140px',
                    ...(focusedField === 'message' ? inputFocused : {}),
                  }}
                />
              </div>

              {/* ── Submit */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <p
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--muted)',
                    letterSpacing: '0.02em',
                    margin: 0,
                  }}
                >
                  <span style={{color: 'var(--gold)'}}>*</span> Required fields
                </p>

                <button
                  type="submit"
                  className="btn-gold"
                  id="contact-submit-btn"
                  style={{minWidth: '180px'}}
                >
                  Send Message
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    style={{marginLeft: '0.25rem'}}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12h12m0 0l-4-4m4 4l-4 4"
                    />
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── Responsive layout + animation styles ─────────── */}
      <style>{`
        @keyframes successPop {
          0%   { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1);   opacity: 1; }
        }

        @media (max-width: 900px) {
          .contact-layout {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }

        @media (max-width: 520px) {
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }

        /* Autofill override */
        input:-webkit-autofill,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px var(--surface) inset;
          -webkit-text-fill-color: var(--black);
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}
