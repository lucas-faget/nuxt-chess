import { PieceName } from "../types/PieceName";
import type { Piece } from "../pieces/Piece";
import type { Square } from "../squares/Square";
import { Move } from "./Move";
import type { SerializedMove } from "../serialization/SerializedMove";

export class Capture extends Move {
    capturedPiece: Piece | null;

    constructor(fromSquare: Square, toSquare: Square, capturedPiece: Piece | null) {
        super(fromSquare, toSquare);
        this.capturedPiece = capturedPiece;
    }

    override undoMove(): void {
        this.fromSquare.piece = this.toSquare.piece;
        this.toSquare.piece = this.capturedPiece;
    }

    override serialize(): SerializedMove {
        console;
        return {
            fromSquare: this.fromSquare.name,
            toSquare: this.toSquare.name,
            captureSquare: this.toSquare.name,
            capturedPiece: this.toSquare.serialize(),
        };
    }

    override toString(): string {
        let move: string = "";

        if (this.fromSquare.piece) {
            const piece: Piece | null = this.fromSquare.piece;
            const pieceName: string = piece.getName();

            if (pieceName !== PieceName.Pawn) {
                move += pieceName.charAt(0).toUpperCase();
            }

            if (this.capturedPiece) {
                if (pieceName === PieceName.Pawn) {
                    move += this.fromSquare.name.charAt(0);
                }
                move += "x";
            }

            move += this.toSquare.name;
        }

        return move;
    }
}
