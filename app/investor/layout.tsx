import React from 'react';

export default function InvestorLayout({ children }: { children: React.ReactNode }) {
  return <div className="investor-portal min-h-screen bg-background">{children}</div>;
}
