import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DropzoneArea } from '../DropzoneArea';
import { vi } from 'vitest';

describe('DropzoneArea', () => {
  it('should render correctly', () => {
    render(<DropzoneArea onFilesDrop={() => {}} />);
    expect(screen.getByText('PDF dosyalarını seçin')).toBeInTheDocument();
  });

  it('should call onFilesDrop when files are dropped', async () => {
    const onFilesDrop = vi.fn();
    render(<DropzoneArea onFilesDrop={onFilesDrop} />);

    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByRole('presentation').querySelector('input');

    if (input) {
      Object.defineProperty(input, 'files', {
        value: [file],
      });
      fireEvent.change(input);
    }

    await waitFor(() => {
      expect(onFilesDrop).toHaveBeenCalledTimes(1);
      expect(onFilesDrop).toHaveBeenCalledWith(expect.arrayContaining([file]));
    });
  });
});
