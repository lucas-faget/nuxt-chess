import type { VPiece } from "./Piece";

export type VMove = {
    fromSquare: string;
    toSquare: string;
    captureSquare: string | null;
    capturedPiece: VPiece | null;
};
