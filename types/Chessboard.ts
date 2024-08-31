import type { VMove } from "./Move";
import type { VPiece } from "./Piece";
import type { VPieces } from "./Pieces";

export class VChessboard {
    ranks: string[];
    files: string[];
    reversedRanks: string[];
    reversedFiles: string[];

    squares: Map<string, VPiece | null> = new Map();

    constructor(ranks: string[], files: string[], pieces: VPieces) {
        this.ranks = ranks;
        this.files = files;
        this.reversedRanks = [...this.ranks].reverse();
        this.reversedFiles = [...this.files].reverse();

        this.fillChessboard(pieces);
    }

    fillChessboard(pieces: VPieces) {
        for (const rank of this.ranks) {
            for (const file of this.files) {
                const squareName: string = file + rank;
                this.squares.set(squareName, pieces[squareName] ?? null);
            }
        }
    }

    carryOutMove(move: VMove) {
        if (this.squares.has(move.fromSquare) && this.squares.has(move.toSquare)) {
            if (move.captureSquare && this.squares.has(move.captureSquare)) {
                this.squares.set(move.captureSquare, null);
            }

            this.squares.set(move.toSquare, this.squares.get(move.fromSquare)!);
            this.squares.set(move.fromSquare, null);
        }
    }

    undoMove(move: VMove) {
        if (this.squares.has(move.fromSquare) && this.squares.has(move.toSquare)) {
            this.squares.set(move.fromSquare, this.squares.get(move.toSquare)!);
            this.squares.set(move.toSquare, null);

            if (move.captureSquare && this.squares.has(move.captureSquare)) {
                this.squares.set(move.captureSquare, move.capturedPiece);
            }
        }
    }
}
