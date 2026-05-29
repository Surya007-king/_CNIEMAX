import * as React from "react";
import { X } from "lucide-react";

export function TrailerModal({
  youtubeKey,
  open,
  onClose,
}: {
  youtubeKey?: string;
  open: boolean;
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/90 backdrop-blur-sm animate-fade-in p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close trailer"
        className="absolute top-5 right-5 w-11 h-11 grid place-items-center rounded-full glass hover:bg-primary transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl"
      >
        {youtubeKey ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1&rel=0`}
            title="Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full grid place-items-center bg-card text-muted-foreground">
            No trailer available for this title.
          </div>
        )}
      </div>
    </div>
  );
}