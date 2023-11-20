import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdBanner from '../AdBanner';

// Mock AdSense global object
const mockPush = vi.fn();
global.window = Object.create(window);
Object.defineProperty(window, 'adsbygoogle', {
  value: { push: mockPush },
  writable: true
});

describe('AdBanner', () => {
  it('renders correctly', () => {
    render(<AdBanner dataAdSlot="1234567890" />);
    
    const adElement = document.querySelector('.adsbygoogle');
    expect(adElement).toBeInTheDocument();
    expect(adElement).toHaveAttribute('data-ad-slot', '1234567890');
  });

  it('pushes to adsbygoogle array on mount', () => {
    render(<AdBanner dataAdSlot="1234567890" />);
    expect(mockPush).toHaveBeenCalled();
  });
});
