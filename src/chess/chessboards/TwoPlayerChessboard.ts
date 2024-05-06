import { PlayerColor } from "../types/PlayerColor";
import { PieceName } from "../types/PieceName";
import { Chessboard } from "./Chessboard";

const isInteger = (char: string) => !isNaN(parseInt(char));
const isUpperCase = (char: string) => char === char.toUpperCase();
const isPieceName = (char: string) =>
    Object.values(PieceName).includes(char.toLowerCase() as PieceName);

export class TwoPlayerChessboard extends Chessboard {
    static Ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];
    static Files = ["a", "b", "c", "d", "e", "f", "g", "h"];

    constructor() {
        super(TwoPlayerChessboard.Ranks, TwoPlayerChessboard.Files);

        this.squares.get("a1")?.setPiece(PieceName.Rook, PlayerColor.White);
        this.squares.get("b1")?.setPiece(PieceName.Knight, PlayerColor.White);
        this.squares.get("c1")?.setPiece(PieceName.Bishop, PlayerColor.White);
        this.squares.get("d1")?.setPiece(PieceName.Queen, PlayerColor.White);
        this.squares.get("e1")?.setPiece(PieceName.King, PlayerColor.White);
        this.squares.get("f1")?.setPiece(PieceName.Bishop, PlayerColor.White);
        this.squares.get("g1")?.setPiece(PieceName.Knight, PlayerColor.White);
        this.squares.get("h1")?.setPiece(PieceName.Rook, PlayerColor.White);

        this.squares.get("a2")?.setPiece(PieceName.Pawn, PlayerColor.White);
        this.squares.get("b2")?.setPiece(PieceName.Pawn, PlayerColor.White);
        this.squares.get("c2")?.setPiece(PieceName.Pawn, PlayerColor.White);
        this.squares.get("d2")?.setPiece(PieceName.Pawn, PlayerColor.White);
        this.squares.get("e2")?.setPiece(PieceName.Pawn, PlayerColor.White);
        this.squares.get("f2")?.setPiece(PieceName.Pawn, PlayerColor.White);
        this.squares.get("g2")?.setPiece(PieceName.Pawn, PlayerColor.White);
        this.squares.get("h2")?.setPiece(PieceName.Pawn, PlayerColor.White);

        this.squares.get("a7")?.setPiece(PieceName.Pawn, PlayerColor.Black);
        this.squares.get("b7")?.setPiece(PieceName.Pawn, PlayerColor.Black);
        this.squares.get("c7")?.setPiece(PieceName.Pawn, PlayerColor.Black);
        this.squares.get("d7")?.setPiece(PieceName.Pawn, PlayerColor.Black);
        this.squares.get("e7")?.setPiece(PieceName.Pawn, PlayerColor.Black);
        this.squares.get("f7")?.setPiece(PieceName.Pawn, PlayerColor.Black);
        this.squares.get("g7")?.setPiece(PieceName.Pawn, PlayerColor.Black);
        this.squares.get("h7")?.setPiece(PieceName.Pawn, PlayerColor.Black);

        this.squares.get("a8")?.setPiece(PieceName.Rook, PlayerColor.Black);
        this.squares.get("b8")?.setPiece(PieceName.Knight, PlayerColor.Black);
        this.squares.get("c8")?.setPiece(PieceName.Bishop, PlayerColor.Black);
        this.squares.get("d8")?.setPiece(PieceName.Queen, PlayerColor.Black);
        this.squares.get("e8")?.setPiece(PieceName.King, PlayerColor.Black);
        this.squares.get("f8")?.setPiece(PieceName.Bishop, PlayerColor.Black);
        this.squares.get("g8")?.setPiece(PieceName.Knight, PlayerColor.Black);
        this.squares.get("h8")?.setPiece(PieceName.Rook, PlayerColor.Black);
    }
}
