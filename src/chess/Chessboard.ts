import type { Position } from "./coordinates/Position";
import type { PlayerColor } from "./enums/PlayerColor";
import { PieceName } from "./enums/PieceName";
import { Square } from "./Square";
import type { Piece } from "./pieces/Piece";

type PieceMove = {
    from: string,
    to: string,
    piece: Piece|null
}

export class Chessboard
{
    ranks: string[];
    files: string[];
    reverseRanks: string[];
    reverseFiles: string[];
    squares: Map<string, Square> = new Map();

    constructor(json: any)
    {
        this.ranks = json.ranks;
        this.files = json.files;

        this.reverseRanks = [...this.ranks].reverse();
        this.reverseFiles = [...this.files].reverse();

        // Fill the chessboard
        for (const [rankIndex, rank] of this.ranks.entries()) {
            for (const [fileIndex, file] of this.files.entries())
            {
                let square: Square = new Square(
                    file + rank, 
                    { x: rankIndex, y: fileIndex }
                );

                if (json.pieces[square.name]) {
                    let pieceName : PieceName = json.pieces[square.name].name;
                    let playerColor: PlayerColor = json.pieces[square.name].color;
                    square.setPiece(pieceName, playerColor);
                }

                this.squares.set(square.name, square);
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

    shuffleRow(rank: string): void
    {
        const pieceMoves: PieceMove[] = [];

        const lightFiles: string[] = this.files.filter((file) => {
            const square = this.getSquareByName(file + rank);
            return square?.isDark() ?? false;
        });
          
        const darkFiles: string[] = this.files.filter((file) => {
            const square = this.getSquareByName(file + rank);
            return !square?.isDark() ?? false;
        });

        for (const file of this.files) {
            let square: Square|null = this.getSquareByName(file + rank);
            if (square?.getPiece()?.getName() === PieceName.Bishop) {
                let file: string|undefined = Chessboard.getRandomElement(square.isDark() ? darkFiles : lightFiles);
                if (file) {
                    pieceMoves.push({
                        from: square.name,
                        to: file + rank,
                        piece: square.getPiece()
                    })
                }
            }
        }

        const files = [...lightFiles, ...darkFiles];

        for (const file of this.files) {
            let square: Square|null = this.getSquareByName(file + rank);
            if (square && square?.getPiece()?.getName() !== PieceName.Bishop) {
                let file: string|undefined = Chessboard.getRandomElement(files);
                if (file) {
                    pieceMoves.push({
                        from: square.name,
                        to: file + rank,
                        piece: square.getPiece()
                    })
                }
            }
        }

        console.log(pieceMoves);

        for (const move of pieceMoves) {
            this.squares.get(move.to)!.piece = move.piece;
        }
    }

    static getRandomElement<T>(array: T[]): T|undefined {
        if (array.length === 0) {
            return undefined;
        }
      
        return array.splice(Math.floor(
            Math.random() * array.length), 1
        )[0];
    }
}
