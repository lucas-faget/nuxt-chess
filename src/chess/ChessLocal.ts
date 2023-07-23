import type { Move } from "./moves/Move";
import { Chess } from "./Chess";
import type { Player } from "./players/Player";

export class ChessLocal extends Chess
{
    constructor(json: any, players: Player[]) {
        super(json, players);
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
