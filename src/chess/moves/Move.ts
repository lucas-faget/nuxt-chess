import type { Piece } from "../pieces/Piece";
import type { Square } from "../squares/Square";
import { MoveType } from "../types/MoveType";

export class Move
{
    fromSquare: Square;
    toSquare: Square;
    capturedPiece: Piece|null;
    enPassantTarget: string|null;

    constructor(fromSquare: Square, toSquare: Square)
    {
        this.fromSquare = fromSquare;
        this.toSquare = toSquare;
        this.capturedPiece = null;
        this.enPassantTarget = null;
    }

    carryoutMove(): void
    {
        this.toSquare.piece = this.fromSquare.piece;
        this.fromSquare.piece = null;
    }

    undoMove(): void
    {
        this.fromSquare.piece = this.toSquare.piece;
        this.toSquare.piece = null;
    }

    getMoveType(): MoveType
    {
        return MoveType.Move;
    }
}
