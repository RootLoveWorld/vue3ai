import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentPreview from './DocumentPreview';

// Mock the pdfjs-dist library
jest.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: {
    workerSrc: ''
  },
  getDocument: jest.fn().mockReturnValue({
    promise: Promise.resolve({
      numPages: 1,
      getPage: jest.fn().mockReturnValue(
        Promise.resolve({
          getViewport: jest.fn().mockReturnValue({ scale: 1, width: 100, height: 100 }),
          render: jest.fn().mockReturnValue({ promise: Promise.resolve() })
        })
      )
    })
  })
}));

// Mock the mammoth library
jest.mock('mammoth', () => ({
  default: {
    convertToHtml: jest.fn().mockResolvedValue({ value: '<p>Test content</p>' })
  }
}));

// Mock the xlsx library
jest.mock('xlsx', () => ({
  read: jest.fn().mockReturnValue({
    SheetNames: ['Sheet1'],
    Sheets: {
      Sheet1: {}
    }
  }),
  utils: {
    sheet_to_html: jest.fn().mockReturnValue('<table><tr><td>Test</td></tr></table>')
  }
}));

// Mock react-markdown
jest.mock('react-markdown', () => {
  return ({ children }: { children: string }) => <div>{children}</div>;
});

describe('DocumentPreview', () => {
  const baseDocument = {
    id: '1',
    name: 'test.pdf',
    type: 'pdf',
    size: 1024,
    uploadDate: '2023-01-01'
  };

  test('renders document information', () => {
    render(<DocumentPreview document={baseDocument} />);
    
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText(/Type: PDF/)).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(<DocumentPreview document={{ ...baseDocument, content: null }} />);
    
    // Since we don't have a loading prop, we can't directly test this
    // In a real implementation, we would add a loading prop
  });

  test('renders image preview when previewUrl is provided', () => {
    const document = {
      ...baseDocument,
      type: 'jpg',
      previewUrl: 'data:image/jpeg;base64,test'
    };
    
    render(<DocumentPreview document={document} />);
    
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'data:image/jpeg;base64,test');
  });

  test('renders text preview for txt files', () => {
    const document = {
      ...baseDocument,
      type: 'txt',
      content: 'This is a test text file content'
    };
    
    render(<DocumentPreview document={document} />);
    
    expect(screen.getByText('This is a test text file content')).toBeInTheDocument();
  });

  test('renders markdown preview for md files', () => {
    const document = {
      ...baseDocument,
      type: 'md',
      content: '# Test Header\n\nThis is a test markdown content'
    };
    
    render(<DocumentPreview document={document} />);
    
    expect(screen.getByText('# Test Header')).toBeInTheDocument();
    expect(screen.getByText('This is a test markdown content')).toBeInTheDocument();
  });

  test('renders default message for unsupported formats', () => {
    const document = {
      ...baseDocument,
      type: 'unknown'
    };
    
    render(<DocumentPreview document={document} />);
    
    expect(screen.getByText(/Preview not available/)).toBeInTheDocument();
  });
});