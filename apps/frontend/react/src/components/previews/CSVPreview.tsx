import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Import cache utility
import { documentCache } from '../../utils/documentCache';

interface CSVPreviewProps {
  content: string;
}

const CSVPreview: React.FC<CSVPreviewProps> = ({ content }) => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState<string[][]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setCsvError(null);
      const lines = content.split('\n');
      const data = lines.map(line => {
        // Simple CSV parsing (doesn't handle quoted fields)
        return line.split(',').map(cell => cell.trim());
      });
      setTableData(data);
      
      // Cache the content
      documentCache.set('csv-document', content);
    } catch (err) {
      setCsvError('Failed to parse CSV: ' + (err as Error).message);
    }
  }, [content]);

  if (csvError) {
    return (
      <div className="error">
        <p>{t('documents.error', 'Error parsing CSV: {{error}}', { error: csvError })}</p>
      </div>
    );
  }

  return (
    <div className="csv-preview">
      <table>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CSVPreview;