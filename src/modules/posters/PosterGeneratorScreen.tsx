import React, { useState } from 'react';
import { Image as ImageIcon, Type, Square, Download } from 'lucide-react';

interface PosterElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  content?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  fontSize?: number;
}

export const PosterGeneratorScreen: React.FC = () => {
  const [elements, setElements] = useState<PosterElement[]>([
    { id: 'bg', type: 'shape', x: 0, y: 0, w: 400, h: 500, color: '#1e293b' },
    { id: 't1', type: 'text', content: 'MATCH DAY', x: 20, y: 40, w: 200, h: 40, color: '#ffffff', fontSize: 32 },
    { id: 't2', type: 'text', content: 'VS', x: 180, y: 200, w: 40, h: 40, color: '#facc15', fontSize: 24 },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addElement = (type: 'text' | 'shape') => {
    const newEl: PosterElement = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'New Text' : undefined,
      x: 50,
      y: 50,
      w: 100,
      h: 50,
      color: type === 'shape' ? '#3b82f6' : '#ffffff',
      fontSize: 20
    };
    setElements([...elements, newEl]);
    setSelectedId(newEl.id);
  };

  const updateElement = (id: string, updates: Partial<PosterElement>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      
      {/* Toolbar */}
      <div className="w-16 flex flex-col items-center py-4 bg-slate-800 border-r border-slate-700 gap-4">
        <div className="w-10 h-10 rounded bg-indigo-600 flex items-center justify-center mb-4">
          <Palette className="w-6 h-6" />
        </div>
        <button onClick={() => addElement('text')} className="p-3 hover:bg-slate-700 rounded transition-colors" title="Add Text">
          <Type className="w-6 h-6 text-slate-300" />
        </button>
        <button onClick={() => addElement('shape')} className="p-3 hover:bg-slate-700 rounded transition-colors" title="Add Shape">
          <Square className="w-6 h-6 text-slate-300" />
        </button>
        <button className="p-3 hover:bg-slate-700 rounded transition-colors" title="Add Image">
          <ImageIcon className="w-6 h-6 text-slate-300" />
        </button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center bg-slate-950 relative overflow-hidden">
        {/* The Canvas */}
        <div 
          className="bg-slate-800 shadow-2xl relative overflow-hidden"
          style={{ width: '400px', height: '500px' }}
        >
          {elements.map(el => (
            <div
              key={el.id}
              onClick={(e) => { e.stopPropagation(); setSelectedId(el.id); }}
              className={`absolute cursor-move ${selectedId === el.id ? 'ring-2 ring-indigo-500' : ''}`}
              style={{
                left: el.x, top: el.y, width: el.w, height: el.h,
                backgroundColor: el.type === 'shape' ? el.color : 'transparent',
                color: el.color,
                fontSize: el.fontSize,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold'
              }}
            >
              {el.content}
            </div>
          ))}
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-72 bg-slate-800 border-l border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700 font-bold">Properties</div>
        
        {selectedId ? (
          <div className="p-4 space-y-4">
            {elements.find(e => e.id === selectedId)?.type === 'text' && (
               <div>
                <label className="block text-xs text-slate-400 mb-1">Text Content</label>
                <input 
                  type="text" 
                  value={elements.find(e => e.id === selectedId)?.content || ''}
                  onChange={(e) => updateElement(selectedId, { content: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm"
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">X Position</label>
                <input 
                  type="number" 
                  value={elements.find(e => e.id === selectedId)?.x}
                  onChange={(e) => updateElement(selectedId, { x: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Y Position</label>
                <input 
                  type="number" 
                  value={elements.find(e => e.id === selectedId)?.y}
                  onChange={(e) => updateElement(selectedId, { y: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Color</label>
              <input 
                type="color" 
                value={elements.find(e => e.id === selectedId)?.color}
                onChange={(e) => updateElement(selectedId, { color: e.target.value })}
                className="w-full h-10 bg-slate-900 border border-slate-600 rounded cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">
            Select an element to edit its properties.
          </div>
        )}

        <div className="mt-auto p-4 border-t border-slate-700">
           <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-bold flex items-center justify-center gap-2">
             <Download className="w-4 h-4" /> Export Poster
           </button>
        </div>
      </div>

    </div>
  );
};

// Icon component needed for the layout above
const Palette = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
  </svg>
);
