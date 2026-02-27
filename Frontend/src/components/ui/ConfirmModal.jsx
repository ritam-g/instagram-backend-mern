import { useEffect, useRef } from "react";
import gsap from "gsap";
import Button from "./Button";

function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open || !containerRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".modal-backdrop",
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" }
      );
      gsap.fromTo(
        ".modal-card",
        { opacity: 0, y: 22, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.26, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        aria-label="close modal"
        className="modal-backdrop absolute inset-0 bg-black/35"
        onClick={onCancel}
        type="button"
      />
      <div className="modal-card glass-surface relative z-10 w-full max-w-md rounded-2xl p-6">
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
