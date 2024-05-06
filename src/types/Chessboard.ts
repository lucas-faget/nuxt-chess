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
}
