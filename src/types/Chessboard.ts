import type { Move } from "./Move";
import type { Piece } from "./Piece";
import type { Pieces } from "./Pieces";

export class Chessboard {
    ranks: string[];
    files: string[];
    reversedRanks: string[];
    reversedFiles: string[];

    squares: Map<string, Piece | null> = new Map();

    constructor(ranks: string[], files: string[], pieces: Pieces) {
        this.ranks = ranks;
        this.files = files;
        this.reversedRanks = [...this.ranks].reverse();
        this.reversedFiles = [...this.files].reverse();

        this.fillChessboard(pieces);
    }

    fillChessboard(pieces: Pieces) {
        for (const rank of this.ranks) {
            for (const file of this.files) {
                const squareName: string = file + rank;
                this.squares.set(squareName, pieces[squareName] ?? null);
            }
        }
    }

    carryOutMove(move: Move) {
        if (
            this.squares.has(move.fromSquare) &&
            this.squares.has(move.toSquare) &&
            this.squares.has(move.captureSquare)
        ) {
            this.squares.set(move.captureSquare, null);
            this.squares.set(move.toSquare, this.squares.get(move.fromSquare)!);
            this.squares.set(move.fromSquare, null);
        }
    }

    undoMove(move: Move) {
        if (
            this.squares.has(move.fromSquare) &&
            this.squares.has(move.toSquare) &&
            this.squares.has(move.captureSquare)
        ) {
            this.squares.set(move.fromSquare, this.squares.get(move.toSquare)!);
            this.squares.set(move.toSquare, null);
            this.squares.set(move.captureSquare, move.capturedPiece);
        }
    }
}
