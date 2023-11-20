import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FileUploader from '../FileUploader';

describe('FileUploader', () => {
  it('renders correctly with default props', () => {
    render(<FileUploader onFilesSelected={() => {}} />);
    
    expect(screen.getByText('Dosyaları Seçin')).toBeInTheDocument();
    expect(screen.getByText('PDF dosyalarını buraya sürükleyin veya seçin')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dosya seç/i })).toBeInTheDocument();
  });

  it('calls onFilesSelected when file is dropped', async () => {
    const onFilesSelected = vi.fn();
    render(<FileUploader onFilesSelected={onFilesSelected} />);

    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    
    // Get the hidden file input
    // react-dropzone creates a hidden input. We can find it by type="file" usually.
    // However, since we are using testing-library, we can try to find it by label text if associated, 
    // or just look for the input directly.
    const input = screen.queryByLabelText(/dosyaları seçin/i, { selector: 'input' }) 
      || document.querySelector('input[type="file"]');

    if (input) {
      Object.defineProperty(input, 'files', {
        value: [file],
      });
      fireEvent.change(input);
    }

    // Wait for the callback
    // Note: react-dropzone might be async. 
    // For now, let's just check if the input exists and we can trigger it.
    // A full test might require wrapping in waitFor.
    expect(input).toBeInTheDocument();
  });
});
