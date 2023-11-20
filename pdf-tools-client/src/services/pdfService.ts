const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5142/api';

export interface RotateOptions {
    [pageNum: number]: number;
}

export const pdfService = {
    async mergePdfs(files: File[]): Promise<Blob> {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await fetch(`${API_URL}/merge`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ Detailed: 'Merge failed' }));
            throw new Error(errorData.Detailed || 'Merge failed');
        }

        return await response.blob();
    },

    async splitPdf(file: File, mode: 'range' | 'extract', ranges?: string, selectedPages?: number[]): Promise<Blob> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mode', mode);

        if (mode === 'range' && ranges) {
            formData.append('ranges', ranges);
        } else if (mode === 'extract' && selectedPages) {
            selectedPages.forEach(p => formData.append('selectedPages', p.toString()));
        }

        const response = await fetch(`${API_URL}/split`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ Detailed: 'Split failed' }));
            throw new Error(errorData.Detailed || 'Split failed');
        }

        return await response.blob();
    },

    async rotatePdf(file: File, rotations: RotateOptions): Promise<Blob> {
        const formData = new FormData();
        formData.append('file', file);

        Object.entries(rotations).forEach(([page, deg]) => {
            formData.append(`RotationDegrees[${page}]`, deg.toString());
        });

        const response = await fetch(`${API_URL}/Rotate`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ Detailed: 'Rotation failed' }));
            throw new Error(errorData.Detailed || 'Rotation failed');
        }

        return await response.blob();
    },

    async deletePages(file: File, pagesToDelete: number[]): Promise<Blob> {
        const formData = new FormData();
        formData.append('file', file);

        pagesToDelete.forEach((page, index) => {
            formData.append(`PagesToDelete[${index}]`, page.toString());
        });

        const response = await fetch(`${API_URL}/Delete`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ Detailed: 'Delete failed' }));
            throw new Error(errorData.Detailed || 'Delete failed');
        }

        return await response.blob();
    },

    async compressPdf(file: File, level: 'Low' | 'Medium' | 'High'): Promise<Blob> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('level', level);

        const response = await fetch(`${API_URL}/Compress`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ Detailed: 'Compression failed' }));
            throw new Error(errorData.Detailed || 'Compression failed');
        }

        return await response.blob();
    }
};
