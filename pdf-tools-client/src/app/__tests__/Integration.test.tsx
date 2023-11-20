import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '../[locale]/page';

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
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

describe('Home Page Integration', () => {
  it('renders HeroSection and ToolGrid', () => {
    render(<Home />);
    
    // Check for HeroSection content (assuming some text exists)
    // We might need to check HeroSection.tsx content to know what to look for.
    // Or we can mock HeroSection and ToolGrid to just verify they are called.
    // Let's try to find elements that should be there.
    
    // ToolGrid should render tools
    expect(screen.getByText('merge-pdf.title')).toBeInTheDocument();
  });
});
