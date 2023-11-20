import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ToolGrid from '../ToolGrid';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock navigation
vi.mock('@/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('ToolGrid', () => {
  it('renders all tools', () => {
    render(<ToolGrid />);
    
    // Check for a few key tools to ensure the list is rendered
    expect(screen.getByText('merge-pdf.title')).toBeInTheDocument();
    expect(screen.getByText('split-pdf.title')).toBeInTheDocument();
    expect(screen.getByText('compress-pdf.title')).toBeInTheDocument();
  });

  it('renders correct links', () => {
    render(<ToolGrid />);
    
    const mergeLink = screen.getByRole('link', { name: /merge-pdf.title/i });
    expect(mergeLink).toHaveAttribute('href', '/merge');
  });
});
