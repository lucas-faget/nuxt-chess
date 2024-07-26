import type { Piece } from "../pieces/Piece";
import type { Square } from "../squares/Square";
import { MoveType } from "../types/MoveType";
import type { SerializedMove } from "../serialization/SerializedMove";

export class Move {
    fromSquare: Square;
    toSquare: Square;
    capturedPiece: Piece | null;
    enPassantTarget: string | null;

    constructor(fromSquare: Square, toSquare: Square) {
        this.fromSquare = fromSquare;
        this.toSquare = toSquare;
        this.capturedPiece = null;
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
            captureSquare: this.toSquare.name,
            capturedPiece:
                this.capturedPiece !== null
                    ? {
                          color: this.capturedPiece.color as string,
                          name: this.capturedPiece.getName() as string,
                      }
                    : null,
        };
    }

    getMoveType(): MoveType {
        return MoveType.Move;
    }
}
