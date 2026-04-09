import { createElement, type CSSProperties } from 'react';
import type { PageComponent } from '../types';

interface ComponentPreviewProps {
  component: PageComponent;
}

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export default function ComponentPreview({ component }: ComponentPreviewProps) {
  const baseStyle: CSSProperties = {
    ...component.style,
  };

  switch (component.type) {
    case 'Header': {
      const headingMap: Record<number, HeadingTag> = {
        1: 'h1',
        2: 'h2',
        3: 'h3',
        4: 'h4',
        5: 'h5',
        6: 'h6',
      };
      const headerTag = headingMap[component.level];
      return createElement(headerTag, { style: baseStyle }, component.content);
    }

    case 'Text':
      return <p style={baseStyle}>{component.content}</p>;

    case 'TextBox':
      return (
        <div style={baseStyle}>
          <label className="block text-sm mb-1">{component.name}</label>
          <input
            type="text"
            defaultValue={component.defaultValue}
            className="border border-gray-300 rounded px-2 py-1 w-full"
            disabled
          />
        </div>
      );

    case 'TextArea':
      return (
        <div style={baseStyle}>
          <label className="block text-sm mb-1">{component.name}</label>
          <textarea
            defaultValue={component.defaultValue}
            className="border border-gray-300 rounded px-2 py-1 w-full"
            rows={3}
            disabled
          />
        </div>
      );

    case 'CheckBox':
      return (
        <div style={baseStyle}>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              defaultChecked={component.defaultValue}
              disabled
            />
            <span>{component.name}</span>
          </label>
        </div>
      );

    case 'SelectBox':
      return (
        <div style={baseStyle}>
          <label className="block text-sm mb-1">{component.name}</label>
          <select
            defaultValue={component.defaultValue}
            className="border border-gray-300 rounded px-2 py-1 w-full"
            disabled
          >
            {component.options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case 'Button':
      return (
        <button
          style={baseStyle}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled
        >
          {component.label} → {component.route}
        </button>
      );

    default:
      return <div>Unknown component</div>;
  }
}
