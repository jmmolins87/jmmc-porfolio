import { Toaster } from 'sonner';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster 
        position="bottom-right"
        toastOptions={{ 
          className: 'bg-background border border-border text-foreground',
          style: {
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--foreground)',
          }
        }}
        richColors
        closeButton
      />
    </>
  );
}
