import { useRef } from 'react';
import { Download, Upload, RotateCcw } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader';

interface SettingsPanelProps {
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
}

export function SettingsPanel({ onExport, onImport, onReset }: SettingsPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <SectionHeader title="Settings" accent="#94a3b8" />

      <div className="max-w-md flex flex-col gap-4">
        <div className="bg-card rounded p-5 flex flex-col gap-1" style={{ borderTop: '3px solid #94a3b8' }}>
          <p className="text-dim text-xs uppercase tracking-widest font-medium mb-3">Data</p>

          <button
            onClick={onExport}
            className="flex items-center gap-3 px-4 py-3 bg-surface rounded text-light text-sm hover:bg-white/10 transition-colors w-full text-left"
          >
            <Download size={15} className="text-dim flex-shrink-0" />
            <div>
              <p className="font-medium">Export JSON</p>
              <p className="text-dim text-xs">Download a full backup of all data</p>
            </div>
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-3 px-4 py-3 bg-surface rounded text-light text-sm hover:bg-white/10 transition-colors w-full text-left mt-2"
          >
            <Upload size={15} className="text-dim flex-shrink-0" />
            <div>
              <p className="font-medium">Import JSON</p>
              <p className="text-dim text-xs">Restore from a backup file</p>
            </div>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                onImport(file);
                e.target.value = '';
              }
            }}
          />
        </div>

        <div className="bg-card rounded p-5" style={{ borderTop: '3px solid #ef4444' }}>
          <p className="text-dim text-xs uppercase tracking-widest font-medium mb-3">Danger Zone</p>
          <button
            onClick={onReset}
            className="flex items-center gap-3 px-4 py-3 bg-surface rounded text-sm hover:bg-red-950/30 transition-colors w-full text-left"
            style={{ color: '#ef4444' }}
          >
            <RotateCcw size={15} className="flex-shrink-0" />
            <div>
              <p className="font-medium">Reset All Data</p>
              <p className="text-dim text-xs">Wipes localStorage and reseeds defaults</p>
            </div>
          </button>
        </div>

        <p className="text-dim text-xs text-center pt-2">Summer OS 2026 · May 19 – Aug 31</p>
      </div>
    </div>
  );
}
