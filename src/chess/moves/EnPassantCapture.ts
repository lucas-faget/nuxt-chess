import type { Piece } from "../pieces/Piece";
import type { Square } from "../squares/Square";
import { MoveType } from "../types/MoveType";
import { Capture } from "./Capture";
import type { SerializedMove } from "../serialization/SerializedMove";

export class EnPassantCapture extends Capture {
    captureSquare: Square;

    constructor(fromSquare: Square, toSquare: Square, capturedPiece: Piece, captureSquare: Square) {
        super(fromSquare, toSquare, capturedPiece);
        this.captureSquare = captureSquare;
    }

    carryOutMove(): void {
        super.carryOutMove();
        this.captureSquare.piece = null;
    }

    undoMove(): void {
        this.fromSquare.piece = this.toSquare.piece;
        this.toSquare.piece = null;
        this.captureSquare.piece = this.capturedPiece;
    }

    serialize(): SerializedMove {
        return {
            fromSquare: this.fromSquare.name,
            toSquare: this.toSquare.name,
            captureSquare: this.captureSquare.name,
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
        return MoveType.EnPassantCapture;
    }
}
