import React from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  userName: string;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  userName,
}) => {
  const [zoom, setZoom] = React.useState(1);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.88)",
        backdropFilter: "blur(8px)",
        zIndex: 1200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 600 }}>
          Profile Media: {userName}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))}
            style={{
              padding: "6px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
            }}
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
            style={{
              padding: "6px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
            }}
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "6px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Image container */}
      <div
        style={{
          maxWidth: "85vw",
          maxHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={userName}
          style={{
            maxWidth: "100%",
            maxHeight: "80vh",
            objectFit: "contain",
            borderRadius: "12px",
            transform: `scale(${zoom})`,
            transition: "transform 0.2s ease",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
          }}
        />
      </div>
    </div>
  );
};
