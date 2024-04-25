import { FourPlayerChess } from "./chess/games/FourPlayerChess";
import { TwoPlayerChess } from "./chess/games/TwoPlayerChess";
import { ChessVariant } from "./chess/types/ChessVariant";

export function createTwoPlayerChessGame(variant: ChessVariant = ChessVariant.Standard): TwoPlayerChess
{
    return new TwoPlayerChess(variant);
}

export function createFourPlayerChessGame(): FourPlayerChess
{
    return new FourPlayerChess();
}
