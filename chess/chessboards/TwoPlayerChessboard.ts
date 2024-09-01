import { Chessboard } from "./Chessboard";

export class TwoPlayerChessboard extends Chessboard {
    static Ranks: string[] = ["1", "2", "3", "4", "5", "6", "7", "8"];
    static Files: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];

    constructor(position: string = "") {
        super(TwoPlayerChessboard.Ranks, TwoPlayerChessboard.Files, position);
    }
}
