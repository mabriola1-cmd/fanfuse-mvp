import './globals.css';

export const metadata = {
  title: 'FanFuse',
  description: 'Clean baseline (JS only)',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: 16, borderBottom: '1px solid #eee' }}>
          <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <a href="/">Home</a>
            <a href="/creators">Creators</a>
            <a href="/concierge/new">New Request</a>
            <a href="/concierge">All Requests (JSON)</a>
            <a href="/messages">Messages</a>
            {/* quick test links for one creator */}
            <a href="/creators/c1/requests" style={{ marginLeft: 'auto' }}>Creator Requests</a>
            <a href="/creators/c1/manage">Manage</a>
            <a href="/wallet">Wallet</a>
          </nav>
        </header>
        <main style={{ padding: 24 }}>{children}</main>
        <footer style={{ padding: 16, borderTop: '1px solid #eee', marginTop: 32 }}>
          <small>© {new Date().getFullYear()} FanFuse</small>
        </footer>
      </body>
    </html>
  );
}
