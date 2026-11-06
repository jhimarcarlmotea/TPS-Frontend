import React, { useRef, useState, useEffect, useCallback } from "react";

/**
 * SignaturePad component allowing users to draw a digital signature using mouse or touch.
 * 
 * Props:
 *  - value: string (data URL of existing signature, if any)
 *  - onChange: (dataUrl: string) => void
 *  - label: string (optional label above the pad)
 *  - error: string (optional error message)
 *  - height: number (canvas height in px, default 160)
 */
export default function SignaturePad({
  value,
  onChange,
  label = "Digital Signature",
  error,
  height = 160,
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!value);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // Resize canvas to match display size and high DPR
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Only resize if actual client dimensions differ
    if (canvas.width !== rect.width * dpr || canvas.height !== height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#1b382f";

      // If value already provided, load it
      if (value) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, rect.width, height);
          setHasSignature(true);
        };
        img.src = value;
      }
    }
  }, [value, height]);

  useEffect(() => {
    setupCanvas();
    window.addEventListener("resize", setupCanvas);
    return () => window.removeEventListener("resize", setupCanvas);
  }, [setupCanvas]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const pos = getCoordinates(e);
    lastPosRef.current = pos;
    setIsDrawing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPosRef.current = pos;
    if (!hasSignature) setHasSignature(true);
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    if (e) e.preventDefault();
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (canvas && onChange) {
      const dataUrl = canvas.toDataURL("image/png");
      onChange(dataUrl);
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasSignature(false);
    if (onChange) onChange("");
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="font-serif font-bold text-[0.85rem] text-[#202020]">
          {label}
          <span className="ml-1 text-red-500">*</span>
          <span className="ml-2 font-sans text-xs font-normal text-[#666]">
            (draw signature inside the box)
          </span>
        </label>
        {hasSignature && (
          <button
            type="button"
            onClick={clear}
            className="text-xs text-red-600 hover:text-red-700 underline font-medium cursor-pointer"
          >
            Clear signature
          </button>
        )}
      </div>

      <div
        className={`relative w-full rounded-xl border bg-white overflow-hidden transition ${
          error ? "border-red-400 bg-red-50/10" : "border-black/20 hover:border-tf-teal focus-within:border-tf-teal"
        }`}
        style={{ height: `${height}px` }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: `${height}px`, touchAction: "none" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair block"
        />

        {/* Signature baseline indicator */}
        <div className="pointer-events-none absolute bottom-6 left-6 right-6 flex items-center justify-between border-b border-dashed border-black/20 pb-1">
          <span className="text-[11px] font-sans text-black/40 tracking-wider uppercase">
            Sign above this line
          </span>
          <span className="text-black/30 text-xs">✕</span>
        </div>

        {!hasSignature && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="text-xs text-black/30 font-serif italic">
              Draw your signature here with your mouse, finger, or stylus
            </span>
          </div>
        )}
      </div>

      {error && <p className="m-0 text-xs text-red-600">{error}</p>}
    </div>
  );
}
