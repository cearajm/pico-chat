import InitCanvasKit from "canvaskit-wasm";
import wasmUrl from "canvaskit-wasm/bin/canvaskit.wasm?url";

export const canvasKit = await InitCanvasKit({ locateFile: () => wasmUrl });
