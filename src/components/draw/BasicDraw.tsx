import { useEffect, useRef, type CanvasHTMLAttributes, type PointerEvent } from "react";
import { canvasKit } from "@/src/lib/canvasKit";
import type { Canvas, Paint, PathBuilder, Surface } from "canvaskit-wasm";

interface BasicDrawProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
  /**
   * Width of the canvas in pixels.
   */
  width: number;

  /**
   * Height of the canvas in pixels.
   */
  height: number;

  /**
   * Defines the thickness of lines drawn in pixels.
   */
  strokeWidth: number;

  /**
   * Whether to apply anti-aliasing to drawn segments.
   * Default: false
   */
  antiAlias?: boolean;
}

/**
 * A component that functions as a basic drawing canvas.
 */
export default function BasicDraw({ width, height, strokeWidth, antiAlias, ...props }: BasicDrawProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const surfaceRef = useRef<Surface | null>(null);
  const ckCanvasRef = useRef<Canvas | null>(null);
  const paintRef = useRef<Paint | null>(null);
  const pathBuilderRef = useRef<PathBuilder | null>(null);
  // True when mouse click is held down
  const isDrawingRef = useRef(false);

  // Initialize canvas
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const surface = canvasKit.MakeWebGLCanvasSurface(canvasElement);
    if (!surface) return;
    surfaceRef.current = surface;

    const canvas = surface.getCanvas();
    ckCanvasRef.current = canvas;

    const paint = new canvasKit.Paint();
    paint.setColor(canvasKit.BLACK);
    paint.setStyle(canvasKit.PaintStyle.Stroke);
    paint.setStrokeWidth(strokeWidth);
    paint.setAntiAlias(antiAlias ?? false);
    paintRef.current = paint;

    canvas.clear(canvasKit.WHITE);
    surface.flush();

    const pathBuilder = new canvasKit.PathBuilder();
    pathBuilderRef.current = pathBuilder;

    // Cleanup routine runs when removed from DOM or dependant properties change
    return () => {
      surface.delete();
      paint.delete();
      pathBuilder.delete();
      surfaceRef.current = null;
      ckCanvasRef.current = null;
      paintRef.current = null;
    };
  }, [strokeWidth, antiAlias]);

  // Updates the canvas with the current state of the path builder.
  const updateCanvas = () => {
    const canvas = ckCanvasRef.current;
    const paint = paintRef.current;
    const surface = surfaceRef.current;
    const pathBuilder = pathBuilderRef.current;
    if (!canvas || !paint || !surface || !pathBuilder) return;

    const path = pathBuilder.snapshot();  // snapshot retains pathBuilder state
    canvas.drawPath(path, paint);
    surface.flush();

    path.delete();
  }

  // Define event listeners
  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = ckCanvasRef.current;
    const paint = paintRef.current;
    const surface = surfaceRef.current;
    const pathBuilder = pathBuilderRef.current;
    if (e.button !== 0 || !canvas || !paint || !surface || !pathBuilder) return;

    e.currentTarget.setPointerCapture(e.pointerId);

    // Define path start location and start drawing
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    pathBuilder.moveTo(x, y);
    pathBuilder.addCircle(x, y, 1);
    updateCanvas();
    isDrawingRef.current = true;
  };

  const onPointerUp = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = ckCanvasRef.current;
    const paint = paintRef.current;
    const surface = surfaceRef.current;
    if (e.button !== 0 || !canvas || !paint || !surface) return;

    e.currentTarget.releasePointerCapture(e.pointerId);
    isDrawingRef.current = false;
    updateCanvas();
  };

  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const isDrawing = isDrawingRef.current;
    const canvas = ckCanvasRef.current;
    const paint = paintRef.current;
    const surface = surfaceRef.current;
    const pathBuilder = pathBuilderRef.current;
    if (!isDrawing || !canvas || !paint || !surface || !pathBuilder) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    // Continue the path to the current (x, y) and draw it on the canvas
    pathBuilder.lineTo(x, y);
    updateCanvas();
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      {...props}
    />
  );
}
