import type { Position } from "./coordinates/Position";
import type { PlayerColor } from "./enums/PlayerColor";
import { PieceName } from "./enums/PieceName";
import type { Row } from "./lines/Row";
import type { Column } from "./lines/Column";
import { Square } from "./Square";

export class Chessboard
{
    ranks: string[];
    files: string[];
    reverseRanks: string[];
    reverseFiles: string[];
    squares: Map<string, Square> = new Map();

    constructor(rows: Row[], columns: Column[])
    {
        this.ranks = rows.map((row) => row.name);
        this.files = columns.map((column) => column.name);

        this.reverseRanks = [...this.ranks].reverse();
        this.reverseFiles = [...this.files].reverse();

        // Fill the chessboard
        for (const row of rows) {
            for (const column of columns)
            {
                let square: Square = new Square(
                    column.name + row.name, 
                    { x: row.index, y: column.index }
                );

                if (row.isPawnRow) {
                    square.setPiece(PieceName.Pawn, row.color!);
                } else {
                    if (row.isPieceRow) {
                        square.setPiece(column.pieceName, row.color!);
                    }
                }

                this.squares.set(column.name + row.name, square);
            }
        }
    }

    getSquareByName(squareName: string): Square|null
    {
        return this.squares.get(squareName) ?? null;
    }

    getSquareByPosition(position: Position): Square|null
    {
        if (position.x < 0 || position.y < 0 || position.x >= this.ranks.length || position.y >= this.files.length) {
            return null;
        }

        return this.squares.get(this.files[position.y] + this.ranks[position.x])!;
    }

    getNextSquare(square: Square, direction: Position, gap: number = 1): Square|null
    {
        return this.getSquareByPosition({
            x: square.position.x + gap * direction.x,
            y: square.position.y + gap * direction.y,
        });
    }

    searchKingSquare(color: PlayerColor): Square|null
    {
        for (const square of this.squares.values()) {
            if (square.isOccupiedByPieceName(PieceName.King) && square.isOccupiedByAlly(color)) {
                return square;
            }
        }

        return null;
    }
}
