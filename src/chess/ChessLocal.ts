import type { Move } from "./moves/Move";
import { Chess } from "./Chess";

export class ChessLocal extends Chess
{
    constructor(json: any) {
        super(json);
        this.controller.calculateMoves(this);
    }

    canPlay(): boolean
    {
        return this.isCurrentMoveTheLast();
    }

    saveMove(move: Move): void
    {
        move.carryoutMove();
        this.savedMoves.push(move);
        this.currentMoveIndex = this.savedMoves.length;
        this.updateAdvantage(move);
        this.updateCurrentPlayer();
        this.controller.calculateMoves(this);
    }

    deleteLastMove(): void
    {
        if (this.savedMoves.length > 0)
        {
            let lastMove: Move = this.savedMoves.pop()!;
            lastMove.undoMove();
            this.currentMoveIndex = this.savedMoves.length;
            this.updateAdvantage(lastMove);
            this.updateCurrentPlayer();
            this.controller.calculateMoves(this);
        }
    }
}
