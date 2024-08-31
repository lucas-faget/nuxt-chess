import { PieceName } from "../types/PieceName";
import type { Piece } from "../pieces/Piece";
import type { Square } from "../squares/Square";
import type { SerializedMove } from "../serialization/SerializedMove";

export class Move {
    fromSquare: Square;
    toSquare: Square;
    enPassantTarget: string | null;

    constructor(fromSquare: Square, toSquare: Square) {
        this.fromSquare = fromSquare;
        this.toSquare = toSquare;
        this.enPassantTarget = null;
    }

    carryOutMove(): void {
        this.toSquare.piece = this.fromSquare.piece;
        this.fromSquare.piece = null;
    }

    undoMove(): void {
        this.fromSquare.piece = this.toSquare.piece;
        this.toSquare.piece = null;
    }

    serialize(): SerializedMove {
        return {
            fromSquare: this.fromSquare.name,
            toSquare: this.toSquare.name,
            captureSquare: null,
            capturedPiece: null,
        };
    }

    toString(): string {
        let move: string = "";

        if (this.fromSquare.piece) {
            const piece: Piece | null = this.fromSquare.piece;
            const pieceName: string = piece.getName();

            if (pieceName !== PieceName.Pawn) {
                move += pieceName.charAt(0).toUpperCase();
            }

            move += this.toSquare.name;
        }

        return move;
    }
}
