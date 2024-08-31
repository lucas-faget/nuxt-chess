import type { SerializedPiece } from "./SerializedPiece";

export type SerializedMove = {
    fromSquare: string;
    toSquare: string;
    captureSquare: string | null;
    capturedPiece: SerializedPiece | null;
};
