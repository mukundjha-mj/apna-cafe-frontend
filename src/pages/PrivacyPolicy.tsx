
const PrivacyPolicy = () => {
  return (
    <div className="page animate-fade-in" style={{ padding: '2rem 1.25rem', color: 'var(--text-cream)' }}>
      <h1>Privacy Policy</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Last Updated: April 27, 2026</p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
        <p>When you use Apna Cafe, we collect information that you provide directly to us, such as when you create an account, place an order, or contact us for support. This includes your name, email address, phone number, and delivery address.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>2. How We Use Information</h2>
        <p>We use the information we collect to process your orders, communicate with you about your account, and improve our services. We do not sell your personal information to third parties.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>3. Authentication</h2>
        <p>We use Google OAuth via Supabase for secure authentication. We only access your basic profile information (name, email, and profile picture) as authorized by your Google account settings.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>4. Data Security</h2>
        <p>We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or destruction.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>5. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at support@apnacafe.com.</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
