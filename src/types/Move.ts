import type { Piece } from "./Piece";

export interface Move {
    fromSquare: string;
    toSquare: string;
    captureSquare: string;
    capturedPiece: Piece;
}
