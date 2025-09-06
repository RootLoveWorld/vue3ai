# Document Preview Component Implementation

This document describes the implementation of the file preview functionality for various document formats in the React frontend application.

## Overview

The DocumentPreview component provides browser-based preview capabilities for multiple file formats without requiring server-side processing. It supports:

- Image files (jpg, jpeg, png, gif, bmp, webp)
- PDF files
- Text files (txt)
- CSV files
- Markdown files (md)
- Office documents (doc, docx, xls, xlsx, ppt, pptx)

## Architecture

The solution is based on:

1. **File Type Detection**: Identify the file type based on extension or MIME type
2. **Content Loading**: Load file content using appropriate methods for each format
3. **Format-Specific Renderers**: Implement specialized rendering components for each file type
4. **Fallback Handling**: Provide graceful fallbacks for unsupported or failed previews

## Implementation Details

### File Loading Strategy

To preview actual file content, we use the FileReader API to read file content:

- For images and PDFs: `readAsDataURL()` to convert file to DataURL
- For text-based files: `readAsText()` to read file content as text
- For binary files: `readAsArrayBuffer()` to read file as ArrayBuffer

### Format-Specific Implementation

#### Image Files
- Use native `<img>` tag with DataURL as src
- FileReader.readAsDataURL() to convert file to DataURL

#### PDF Files
- Use Mozilla's PDF.js library
- FileReader.readAsArrayBuffer() to read PDF file
- Render using PDF.js viewer component with canvas

#### Text Files
- FileReader.readAsText() to read file content
- Display in a scrollable container with proper formatting

#### CSV Files
- FileReader.readAsText() to read file content
- Parse CSV data and display in a table format

#### Markdown Files
- FileReader.readAsText() to read file content
- Use react-markdown library to render

#### Office Documents
- For Word documents: Use mammoth.js library to convert to HTML
- For Excel documents: Use SheetJS (xlsx package) to parse and display data
- For PowerPoint: Display document information and download prompt

## Performance Optimizations

1. **Lazy Loading**: Preview components are only loaded when they come into view using Intersection Observer
2. **Caching**: Parsed content is cached using an in-memory cache with TTL (Time To Live)
3. **File Size Limits**: Files larger than 5MB have limited preview capabilities to prevent performance issues
4. **Virtualization**: For large CSV files, consider implementing virtualization (not yet implemented)

## Error Handling

- Comprehensive error handling for each file type
- Graceful fallbacks for unsupported formats
- User-friendly error messages
- Loading states for async operations

## Security Considerations

- Content is sanitized before rendering, especially for HTML/Markdown
- File types and extensions are validated
- XSS prevention through proper content escaping

## Dependencies

The implementation uses the following libraries:

- `pdfjs-dist`: For PDF rendering
- `mammoth`: For Word document processing
- `xlsx`: For Excel document processing
- `react-markdown`: For Markdown rendering

## Usage

The DocumentPreview component takes a Document object as props and automatically determines the appropriate preview method based on the file type.

```typescript
interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  content?: string | ArrayBuffer | null;
  previewUrl?: string;
}
```

## Future Improvements

1. Implement virtualization for large CSV files
2. Add image optimization before displaying
3. Implement more sophisticated CSV parsing that handles quoted fields
4. Add support for additional file formats
5. Implement progressive loading for large files