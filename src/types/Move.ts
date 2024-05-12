import type { Piece } from "./Piece";

export type Move = {
    fromSquare: string;
    toSquare: string;
    captureSquare: string;
    capturedPiece: Piece | null;
};
