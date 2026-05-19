interface ToastItem {
  id: number;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastItem[];
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="bg-card border border-white/10 text-light text-sm px-4 py-3 rounded shadow-lg animate-in"
          style={{ animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
