import { type CSSProperties } from 'react';
import type { Page } from '../types';
import ComponentPreview from './ComponentPreview';

interface PagePreviewProps {
  page: Page;
}

export default function PagePreview({ page }: PagePreviewProps) {
  const pageStyle: CSSProperties = {
    ...(page.style as CSSProperties),
    minHeight: '400px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: page.style.padding || '16px',
  };

  return (
    <div style={pageStyle}>
      {page.components.length === 0 ? (
        <div className="text-gray-400 text-center py-12">
          No components yet. Add some components to see them here.
        </div>
      ) : (
        <div className="space-y-4">
          {page.components.map(component => (
            <div key={component.id}>
              <ComponentPreview component={component} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
