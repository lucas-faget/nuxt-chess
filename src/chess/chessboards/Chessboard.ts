import type { Coordinates } from "../coordinates/Position";
import type { PlayerColor } from "../types/PlayerColor";
import { PieceName } from "../types/PieceName";
import type { Square } from "../squares/Square";
import { Bishop } from "../pieces/Bishop";
import { Knight } from "../pieces/Knight";
import { Rook } from "../pieces/Rook";
import { Queen } from "../pieces/Queen";
import type { Player } from "../players/Player";
import type { Move } from "../moves/Move";
import { King } from "../pieces/King";
import type { LegalMoves } from "../types/LegalMoves";

export abstract class Chessboard
{
    ranks: string[];
    files: string[];
    reversedRanks: string[];
    reversedFiles: string[];
    squares: Map<string, Square> = new Map();

    abstract kingSquareNameByPlayer: Object;

    constructor(ranks: string[], files: string[])
    {
        this.ranks = ranks;
        this.files = files;
        this.reversedRanks = [...this.ranks].reverse();
        this.reversedFiles = [...this.files].reverse();
    }

    getSquareByName(squareName: string): Square|null
    {
        return this.squares.get(squareName) ?? null;
    }

    getSquareByPosition(position: Coordinates): Square|null
    {
        if (position.x < 0 || position.y < 0 || position.x >= this.ranks.length || position.y >= this.files.length) {
            return null;
        }

        return this.squares.get(this.files[position.y] + this.ranks[position.x])!;
    }

    getSquareByDirection(square: Square, direction: Coordinates, step: number = 1): Square|null
    {
        return this.getSquareByPosition({
            x: square.position.x + step * direction.x,
            y: square.position.y + step * direction.y,
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

    calculateLegalMoves(player: Player, kingSquare: Square|null, enPassantTarget: string|null): LegalMoves
    {
        let legalMoves: LegalMoves = {};

        for (const square of this.squares.values()) {
            if (square.isOccupiedByAlly(player.color)) {
                let moves: Move[] = square.piece!.getMoves(player, square, this, kingSquare, enPassantTarget);
                if (moves) {
                    for (const move of moves) {
                        if (!legalMoves[move.fromSquare.name]) {
                            legalMoves[move.fromSquare.name] = {};
                        }
                        legalMoves[move.fromSquare.name][move.toSquare.name] = move;
                    }
                }
            }
        }

        return legalMoves;
    }

    isCheckedIfMoving(player: Player, move: Move, kingSquare: Square|null): boolean
    {
        let isChecked: boolean = false;

        if (kingSquare) {
            move.carryoutMove();
            isChecked = this.isChecked(player, kingSquare);
            move.undoMove();
        }

        return isChecked;
    }

    isChecked(player: Player, kingSquare: Square): boolean
    {
        return this.isCheckedByMobilePiece(player, kingSquare)
            || this.isCheckedByKnight(player, kingSquare)
            || this.isCheckedByPawn(player, kingSquare)
            || this.isCheckedByKing(player, kingSquare)
    }
    
    isCheckedByPawn(player: Player, kingSquare: Square): boolean
    {
        let square: Square|null = null;
                
        for (const direction of Bishop.Directions) {
            if (direction.x === player.direction.x || direction.y === player.direction.y) {
                square = this.getSquareByDirection(kingSquare, direction);
                if (square && square.isOccupiedByPieceName(PieceName.Pawn) && square.isOccupiedByOpponent(player.color)) {
                    return true;
                }
            }
        }

        return false;
    }
    
    isCheckedByKnight(player: Player, kingSquare: Square): boolean
    {
        let square: Square|null = null;

        for (const direction of Knight.Directions) {
            square = this.getSquareByDirection(kingSquare, direction);
            if (square && square.isOccupiedByPieceName(PieceName.Knight) && square.isOccupiedByOpponent(player.color)) {
                return true;
            }
        }

        return false;
    }

    isCheckedByMobilePiece(player: Player, kingSquare: Square): boolean
    {
        let square: Square|null = null;
    
        // test if checked by queen, rook or bishop
        for (const direction of Queen.Directions) {
            square = this.getSquareByDirection(kingSquare, direction);
            while (square) {
                if (!square.isEmpty()) {
                    if (square.isOccupiedByOpponent(player.color)) {
                        if (Rook.Directions.includes(direction)) {
                            if (square.isOccupiedByPieceName(PieceName.Queen) || square.isOccupiedByPieceName(PieceName.Rook)) {
                                return true;
                            }
                        } else {
                            if (square.isOccupiedByPieceName(PieceName.Queen) || square.isOccupiedByPieceName(PieceName.Bishop)) {
                                return true;
                            }
                        }
                    }
                    break;
                }
                square = this.getSquareByDirection(square, direction);
            }
        }

        return false;
    }

    isCheckedByKing(player: Player, kingSquare: Square): boolean
    {
        let square: Square|null = null;

        for (const direction of King.Directions) {
            square = this.getSquareByDirection(kingSquare, direction);
            if (square && square.isOccupiedByPieceName(PieceName.King) && square.isOccupiedByOpponent(player.color)) {
                return true;
            }
        }

        return false;
    }

    getPositionString(): string
    {
        let position: string = '';
        for (const [row, rank] of this.ranks.entries()) {
            let emptySquareCount: number = 0;
            for (const [col, file] of this.files.entries()) {
                let square: Square|null = this.getSquareByName(file + rank);
                if (square?.isEmpty()) {
                    emptySquareCount++;
                } else {
                    position += emptySquareCount > 0 ? emptySquareCount.toString() : '';
                    emptySquareCount = 0;
                    position += square?.piece ?? '';
                }
            }
            position += emptySquareCount > 0 ? emptySquareCount.toString() : '';
            position += row !== this.ranks.length - 1 ? '/' : '';
        }

        return position;
    }
}
