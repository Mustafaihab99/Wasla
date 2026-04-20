// ConfirmDialog.tsx

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />

      {/* CONTENT */}
      <div className="relative bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">

        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-dried mb-6">{description}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg border border-border hover:bg-background/60 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-error/90 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}