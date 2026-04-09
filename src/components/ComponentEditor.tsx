import { useState } from 'react';
import type { PageComponent } from '../types';

interface ComponentEditorProps {
  component: PageComponent;
  availableRoutes: string[];
  onSave: (component: PageComponent) => void;
  onCancel: () => void;
}

export default function ComponentEditor({ component, availableRoutes, onSave, onCancel }: ComponentEditorProps) {
  const [editedComponent, setEditedComponent] = useState<PageComponent>(component);

  const updateField = (field: string, value: string | number | boolean | string[]) => {
    setEditedComponent({ ...editedComponent, [field]: value } as PageComponent);
  };

  const updateStyle = (styleProp: string, value: string) => {
    setEditedComponent({
      ...editedComponent,
      style: { ...editedComponent.style, [styleProp]: value },
    });
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white">
      <h3 className="text-xl font-semibold mb-4">Edit {component.type} Component</h3>

      <div className="space-y-4">
        {/* Type-specific fields */}
        {component.type === 'Header' && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1">Content</label>
              <input
                type="text"
                value={(editedComponent as typeof component).content}
                onChange={(e) => updateField('content', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Level</label>
              <select
                value={(editedComponent as typeof component).level}
                onChange={(e) => updateField('level', Number(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                {[1, 2, 3, 4, 5, 6].map(level => (
                  <option key={level} value={level}>
                    H{level}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {component.type === 'Text' && (
          <div>
            <label className="block text-sm font-semibold mb-1">Content</label>
            <textarea
              value={(editedComponent as typeof component).content}
              onChange={(e) => updateField('content', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>
        )}

        {component.type === 'TextBox' && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                value={(editedComponent as typeof component).name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Default Value</label>
              <input
                type="text"
                value={(editedComponent as typeof component).defaultValue}
                onChange={(e) => updateField('defaultValue', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </>
        )}

        {component.type === 'TextArea' && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                value={(editedComponent as typeof component).name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Default Value</label>
              <textarea
                value={(editedComponent as typeof component).defaultValue}
                onChange={(e) => updateField('defaultValue', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>
          </>
        )}

        {component.type === 'CheckBox' && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                value={(editedComponent as typeof component).name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(editedComponent as typeof component).defaultValue}
                  onChange={(e) => updateField('defaultValue', e.target.checked)}
                />
                <span className="text-sm font-semibold">Default Checked</span>
              </label>
            </div>
          </>
        )}

        {component.type === 'SelectBox' && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                value={(editedComponent as typeof component).name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Options (comma-separated)</label>
              <input
                type="text"
                value={(editedComponent as typeof component).options.join(', ')}
                onChange={(e) => updateField('options', e.target.value.split(',').map(s => s.trim()))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Default Value</label>
              <input
                type="text"
                value={(editedComponent as typeof component).defaultValue}
                onChange={(e) => updateField('defaultValue', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </>
        )}

        {component.type === 'Button' && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1">Label</label>
              <input
                type="text"
                value={(editedComponent as typeof component).label}
                onChange={(e) => updateField('label', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Route (Target Page)</label>
              <select
                value={(editedComponent as typeof component).route}
                onChange={(e) => updateField('route', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select a route</option>
                {availableRoutes.map(route => (
                  <option key={route} value={route}>
                    {route}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Style fields */}
        <div className="border-t pt-4 mt-4">
          <h4 className="font-semibold mb-2">Styling</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1">Color</label>
              <input
                type="text"
                value={editedComponent.style.color || ''}
                onChange={(e) => updateStyle('color', e.target.value)}
                placeholder="#000000"
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Background</label>
              <input
                type="text"
                value={editedComponent.style.backgroundColor || ''}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                placeholder="#ffffff"
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Font Size</label>
              <input
                type="text"
                value={editedComponent.style.fontSize || ''}
                onChange={(e) => updateStyle('fontSize', e.target.value)}
                placeholder="16px"
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Padding</label>
              <input
                type="text"
                value={editedComponent.style.padding || ''}
                onChange={(e) => updateStyle('padding', e.target.value)}
                placeholder="8px"
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={() => onSave(editedComponent)}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
