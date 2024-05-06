import type { Square } from "../squares/Square";
import { MoveType } from "../types/MoveType";
import { Move } from "./Move";

export class Castling extends Move {
    rookMove: Move;

    constructor(fromSquare: Square, toSquare: Square, rookMove: Move) {
        super(fromSquare, toSquare);
        this.rookMove = rookMove;
    }

    carryOutMove(): void {
        super.carryOutMove();
        this.rookMove.carryOutMove();
    }

    undoMove(): void {
        super.undoMove();
        this.rookMove.undoMove();
    }

    getMoveType(): MoveType {
        return MoveType.Castling;
    }
}
