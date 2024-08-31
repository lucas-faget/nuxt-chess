import type { Side } from "../types/Sides";
import type { Square } from "../squares/Square";
import { Move } from "./Move";

export class Castling extends Move {
    side: Side;
    rookMove: Move;

    constructor(fromSquare: Square, toSquare: Square, rookMove: Move, side: Side) {
        super(fromSquare, toSquare);
        this.rookMove = rookMove;
        this.side = side;
    }

    override carryOutMove(): void {
        super.carryOutMove();
        this.rookMove.carryOutMove();
    }

    override undoMove(): void {
        super.undoMove();
        this.rookMove.undoMove();
    }
}
