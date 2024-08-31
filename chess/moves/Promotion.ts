import { Pawn } from "../pieces/Pawn";
import { Queen } from "../pieces/Queen";
import { Capture } from "./Capture";

export class Promotion extends Capture {
    override carryOutMove(): void {
        this.toSquare.piece = new Queen(this.fromSquare.piece!.color);
        this.fromSquare.piece = null;
    }

    override undoMove(): void {
        this.fromSquare.piece = new Pawn(this.toSquare.piece!.color);
        this.toSquare.piece = this.capturedPiece;
    }
}
