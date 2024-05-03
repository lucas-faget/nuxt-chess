import { ChessVariant } from "../types/ChessVariant";
import type { Player } from "../players/Player";
import { Blacks, Golds, Silvers, Whites } from "../players/Players";
import type { Chessboard } from "../chessboards/Chessboard";
import { FourPlayerChessboard } from "../chessboards/FourPlayerChessboard";
import { Chess } from "./Chess";

export class FourPlayerChess extends Chess
{
    constructor()
    {
        const players: Player[] = [Whites, Silvers, Blacks, Golds];
        
        const chessboard: Chessboard = new FourPlayerChessboard();
        
        super(ChessVariant.FourPlayer, players, chessboard);

        this.addNewGameState();

        this.setLegalMoves();
    }
}
