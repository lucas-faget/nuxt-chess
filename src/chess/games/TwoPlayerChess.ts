import type { ChessVariant } from "../types/ChessVariant";
import type { FenRecord } from "../types/FenRecord";
import type { Player } from "../players/Player";
import { Blacks, Whites } from "../players/Players";
import type { Chessboard } from "../chessboards/Chessboard";
import { TwoPlayerChessboard } from "../chessboards/TwoPlayerChessboard";
import { Chess } from "./Chess";

export class TwoPlayerChess extends Chess
{
    static WhiteColor: string = 'w';
    static BlackColor: string = 'b';

    static WhiteKingsideCastling: string = 'K';
    static WhiteQueensideCastling: string = 'Q';
    static BlackKingsideCastling: string = 'k';
    static BlackQueensideCastling: string = 'q';

    static FenString: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    constructor(variant: ChessVariant, fenString: string = TwoPlayerChess.FenString, players: Player[] = [Whites, Blacks])
    {
        const fenRecord: FenRecord = TwoPlayerChess.getFenRecordFromString(fenString);

        const chessboard: Chessboard = new TwoPlayerChessboard(fenRecord.position);

        super(variant, players, chessboard);

        this.activePlayerIndex = fenRecord.activeColor === TwoPlayerChess.WhiteColor ? 0 : 1;

        this.addNewGameState(fenRecord.enPassantTarget !== '-' ? fenRecord.enPassantTarget : null);

        this.setLegalMoves();
    }

    static getFenRecordFromString(fenString: string): FenRecord
    {
        const fenData: string[] = fenString.split(' ');
        return {
            position: fenData[0],
            activeColor: fenData[1],
            castlingAvailabilities: fenData[2],
            enPassantTarget: fenData[3],
            halfmoveClock: fenData[4],
            fullmoveNumber: fenData[5]
        }
    }
}
