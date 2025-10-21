/**
 * Weekly Market Summary Email Template
 * 
 * This template is designed to be rendered server-side and sent via email.
 * It uses inline styles for maximum email client compatibility.
 * Can also be printed to PDF.
 */

interface WeeklySummaryData {
  orgName: string;
  weekStart: string;
  weekEnd: string;
  keyMoves: Array<{
    product: string;
    variant: string;
    oldPrice: number;
    newPrice: number;
    change: number;
  }>;
  newSKUs: Array<{
    product: string;
    brand: string;
    category: string;
    medianPrice: number;
    coverage: number;
  }>;
  backInStock: Array<{
    product: string;
    store: string;
    price: number;
  }>;
  positionChanges: Array<{
    product: string;
    oldRank: number;
    newRank: number;
    currentPrice: number;
  }>;
  opportunities: Array<{
    product: string;
    reason: string;
    potentialImpact: string;
    recommendation: string;
  }>;
}

export function WeeklySummaryEmail({ data }: { data: WeeklySummaryData }) {
  const styles = {
    body: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      lineHeight: '1.6',
      color: '#333',
      backgroundColor: '#f4f4f4',
      margin: 0,
      padding: 0,
    },
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
    },
    header: {
      backgroundColor: '#16a34a',
      color: '#ffffff',
      padding: '32px 24px',
      textAlign: 'center' as const,
    },
    logo: {
      fontSize: '28px',
      fontWeight: 'bold',
      margin: 0,
    },
    subtitle: {
      fontSize: '14px',
      margin: '8px 0 0 0',
      opacity: 0.9,
    },
    content: {
      padding: '32px 24px',
    },
    section: {
      marginBottom: '32px',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#16a34a',
      borderBottom: '2px solid #16a34a',
      paddingBottom: '8px',
    },
    card: {
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: '#e5e7eb',
      color: '#374151',
    },
    badgeGreen: {
      backgroundColor: '#dcfce7',
      color: '#166534',
    },
    badgeRed: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
    },
    cta: {
      display: 'inline-block',
      backgroundColor: '#16a34a',
      color: '#ffffff',
      padding: '12px 32px',
      borderRadius: '6px',
      textDecoration: 'none',
      fontWeight: '600',
      marginTop: '16px',
    },
    footer: {
      backgroundColor: '#f9fafb',
      padding: '24px',
      textAlign: 'center' as const,
      fontSize: '12px',
      color: '#6b7280',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      marginTop: '12px',
    },
    th: {
      textAlign: 'left' as const,
      padding: '8px',
      borderBottom: '2px solid #e5e7eb',
      fontSize: '12px',
      fontWeight: '600',
      color: '#6b7280',
    },
    td: {
      padding: '8px',
      borderBottom: '1px solid #e5e7eb',
      fontSize: '14px',
    },
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>LeafLedger Weekly Market Summary</title>
      </head>
      <body style={styles.body}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.logo}>🌿 LeafLedger</h1>
            <p style={styles.subtitle}>
              Weekly Market Summary • {data.weekStart} - {data.weekEnd}
            </p>
          </div>

          {/* Content */}
          <div style={styles.content}>
            {/* Greeting */}
            <p style={{ fontSize: '16px', marginBottom: '24px' }}>
              Hi {data.orgName} team,
            </p>
            <p style={{ marginBottom: '24px' }}>
              Here's your weekly cannabis market intelligence summary. This report highlights 
              the most important pricing movements, new products, and competitive opportunities 
              from the past week.
            </p>

            {/* Key Market Moves */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>📊 Key Market Moves</h2>
              <p style={{ marginBottom: '16px', color: '#6b7280' }}>
                Significant price changes in your market
              </p>
              {data.keyMoves.map((move, idx) => (
                <div key={idx} style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{move.product}</div>
                      <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                        {move.variant}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        {formatCurrency(move.newPrice)}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        fontWeight: '600',
                        color: move.change > 0 ? '#dc2626' : '#16a34a' 
                      }}>
                        {formatPercent(move.change)}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                    Previous: {formatCurrency(move.oldPrice)}
                  </div>
                </div>
              ))}
            </div>

            {/* New SKUs */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>✨ New Products</h2>
              <p style={{ marginBottom: '16px', color: '#6b7280' }}>
                Recently launched products in your tracked categories
              </p>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Product</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Median Price</th>
                    <th style={styles.th}>Coverage</th>
                  </tr>
                </thead>
                <tbody>
                  {data.newSKUs.map((sku, idx) => (
                    <tr key={idx}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: '600' }}>{sku.product}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{sku.brand}</div>
                      </td>
                      <td style={styles.td}>{sku.category}</td>
                      <td style={styles.td}>{formatCurrency(sku.medianPrice)}</td>
                      <td style={styles.td}>{sku.coverage} stores</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Back in Stock */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>📦 Back in Stock</h2>
              <p style={{ marginBottom: '16px', color: '#6b7280' }}>
                Previously unavailable products that are now available
              </p>
              {data.backInStock.map((item, idx) => (
                <div key={idx} style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{item.product}</div>
                      <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                        {item.store}
                      </div>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>
                      {formatCurrency(item.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Position Changes */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>🎯 Your Position Changes</h2>
              <p style={{ marginBottom: '16px', color: '#6b7280' }}>
                How your competitive ranking has changed
              </p>
              {data.positionChanges.map((change, idx) => {
                const improved = change.newRank < change.oldRank;
                return (
                  <div key={idx} style={styles.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600' }}>{change.product}</div>
                        <div style={{ fontSize: '14px', marginTop: '8px' }}>
                          Rank: #{change.oldRank} → #{change.newRank}
                          <span style={{ 
                            marginLeft: '8px',
                            color: improved ? '#16a34a' : '#dc2626',
                            fontWeight: '600'
                          }}>
                            {improved ? '↑' : '↓'}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Your Price</div>
                        <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>
                          {formatCurrency(change.currentPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top Opportunities */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>💡 Top Opportunities</h2>
              <p style={{ marginBottom: '16px', color: '#6b7280' }}>
                Actionable insights to improve your competitive position
              </p>
              {data.opportunities.map((opp, idx) => (
                <div key={idx} style={{ 
                  ...styles.card, 
                  borderLeft: '4px solid #16a34a' 
                }}>
                  <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '8px' }}>
                    {opp.product}
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                    <strong>Insight:</strong> {opp.reason}
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                    <strong>Impact:</strong> {opp.potentialImpact}
                  </div>
                  <div style={{ fontSize: '14px', color: '#16a34a', fontWeight: '600' }}>
                    → {opp.recommendation}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
              <a 
                href="https://leafledger.io/app/catalog" 
                style={styles.cta}
              >
                Open in LeafLedger →
              </a>
            </div>

            {/* Closing */}
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '32px' }}>
              Questions about this report? Reply to this email or contact our support team.
            </p>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <p style={{ margin: '0 0 8px 0' }}>
              © 2025 LeafLedger. All rights reserved.
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              Cannabis Market Intelligence • British Columbia
            </p>
            <p style={{ margin: '0' }}>
              <a href="#" style={{ color: '#6b7280', textDecoration: 'none', margin: '0 8px' }}>
                Unsubscribe
              </a>
              |
              <a href="#" style={{ color: '#6b7280', textDecoration: 'none', margin: '0 8px' }}>
                Update Preferences
              </a>
              |
              <a href="#" style={{ color: '#6b7280', textDecoration: 'none', margin: '0 8px' }}>
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}

// Example usage in API route or background job:
// 
// import { renderToStaticMarkup } from 'react-dom/server';
// import { sendEmail } from '@/lib/email';
// 
// const html = renderToStaticMarkup(<WeeklySummaryEmail data={summaryData} />);
// await sendEmail({
//   to: user.email,
//   subject: `LeafLedger Weekly Summary - ${weekStart}`,
//   html,
// });


