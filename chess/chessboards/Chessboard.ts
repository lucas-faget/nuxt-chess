import type { Coordinates } from "../coordinates/Position";
import { PlayerColor } from "../types/PlayerColor";
import { PieceName } from "../types/PieceName";
import { Bishop } from "../pieces/Bishop";
import { Knight } from "../pieces/Knight";
import { Rook } from "../pieces/Rook";
import { Queen } from "../pieces/Queen";
import type { Player } from "../players/Player";
import { Square } from "../squares/Square";
import type { Move } from "../moves/Move";
import { King } from "../pieces/King";
import type { LegalMoves } from "../types/LegalMoves";
import type { SerializedPieces } from "../serialization/SerializedPieces";

const isInteger = (char: string) => !isNaN(parseInt(char));
const isPlayerColor = (char: string) =>
    Object.values(PlayerColor).includes(char.toLowerCase() as PlayerColor);
const isPieceName = (char: string) =>
    Object.values(PieceName).includes(char.toLowerCase() as PieceName);

export abstract class Chessboard {
    static Regex = /([a-zA-Z]{2}|\d+)/g;

    ranks: string[];
    files: string[];
    squares: Map<string, Square> = new Map();

    constructor(ranks: string[], files: string[], fenPosition: string = "") {
        this.ranks = ranks;
        this.files = files;

        for (const [y, rank] of this.ranks.entries()) {
            for (const [x, file] of this.files.entries()) {
                let square: Square = new Square(file + rank, { x, y });
                this.squares.set(square.name, square);
            }
        }

        if (fenPosition) {
            this.fill(fenPosition);
        }
    }

    fill(fenPosition: string) {
        if (fenPosition) {
            const rows = fenPosition.split("/");
            for (const [y, row] of rows.reverse().entries()) {
                let x = 0;
                const segments: string[] = row.match(Chessboard.Regex) || [];
                for (const segment of segments) {
                    if (isInteger(segment)) {
                        x += parseInt(segment);
                    } else {
                        if (
                            segment.length === 2 &&
                            isPlayerColor(segment[0]) &&
                            isPieceName(segment[1])
                        ) {
                            const playerColor: PlayerColor =
                                segment[0].toLowerCase() as PlayerColor;
                            const pieceName: PieceName = segment[1].toLowerCase() as PieceName;
                            this.getSquareByName(this.files[x] + this.ranks[y])?.setPiece(
                                pieceName,
                                playerColor
                            );
                        }
                        x++;
                    }
                }
            }
        }
    }

    getSquareByName(squareName: string): Square | null {
        return this.squares.get(squareName) ?? null;
    }

    getSquareByPosition(position: Coordinates): Square | null {
        if (
            position.x < 0 ||
            position.y < 0 ||
            position.x >= this.files.length ||
            position.y >= this.ranks.length
        ) {
            return null;
        }

        return this.squares.get(this.files[position.x] + this.ranks[position.y])!;
    }

    getSquareByDirection(square: Square, direction: Coordinates, step: number = 1): Square | null {
        return this.getSquareByPosition({
            x: square.position.x + step * direction.x,
            y: square.position.y + step * direction.y,
        });
    }

    findKingSquare(color: PlayerColor): Square | null {
        for (const square of this.squares.values()) {
            if (square.isOccupiedByPieceName(PieceName.King) && square.isOccupiedByAlly(color)) {
                return square;
            }
        }

        return null;
    }

    calculateLegalMoves(
        player: Player,
        kingSquare: Square | null,
        enPassantTarget: string | null
    ): LegalMoves {
        let legalMoves: LegalMoves = {};

        for (const square of this.squares.values()) {
            if (square.isOccupiedByAlly(player.color)) {
                let moves: Move[] = square.piece!.getMoves(player, square, this, enPassantTarget);

                if (moves) {
                    for (const move of moves) {
                        if (!this.isCheckedByMoving(player, move, kingSquare)) {
                            if (!legalMoves[move.fromSquare.name]) {
                                legalMoves[move.fromSquare.name] = {};
                            }
                            legalMoves[move.fromSquare.name][move.toSquare.name] = move;
                        }
                    }
                }
            }
        }

        return legalMoves;
    }

    isCheckedByMoving(player: Player, move: Move, kingSquare: Square | null): boolean {
        let isChecked: boolean = false;

        if (kingSquare) {
            move.carryOutMove();
            isChecked = this.isChecked(
                player,
                move.toSquare.piece?.getName() === PieceName.King ? move.toSquare : kingSquare
            );
            move.undoMove();
        }

        return isChecked;
    }

    isChecked(player: Player, kingSquare: Square): boolean {
        return (
            this.isCheckedByMobilePiece(player, kingSquare) ||
            this.isCheckedByKnight(player, kingSquare) ||
            this.isCheckedByPawn(player, kingSquare) ||
            this.isCheckedByKing(player, kingSquare)
        );
    }

    isCheckedByPawn(player: Player, kingSquare: Square): boolean {
        let square: Square | null = null;

        for (const direction of Bishop.Directions) {
            if (direction.x === player.direction.x || direction.y === player.direction.y) {
                square = this.getSquareByDirection(kingSquare, direction);
                if (
                    square &&
                    square.isOccupiedByPieceName(PieceName.Pawn) &&
                    square.isOccupiedByOpponent(player.color)
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    isCheckedByKnight(player: Player, kingSquare: Square): boolean {
        let square: Square | null = null;

        for (const direction of Knight.Directions) {
            square = this.getSquareByDirection(kingSquare, direction);
            if (
                square &&
                square.isOccupiedByPieceName(PieceName.Knight) &&
                square.isOccupiedByOpponent(player.color)
            ) {
                return true;
            }
        }

        return false;
    }

    isCheckedByMobilePiece(player: Player, kingSquare: Square): boolean {
        let square: Square | null = null;

        // test if checked by queen, rook or bishop
        for (const direction of Queen.Directions) {
            square = this.getSquareByDirection(kingSquare, direction);
            while (square) {
                if (!square.isEmpty()) {
                    if (square.isOccupiedByOpponent(player.color)) {
                        if (Rook.Directions.includes(direction)) {
                            if (
                                square.isOccupiedByPieceName(PieceName.Queen) ||
                                square.isOccupiedByPieceName(PieceName.Rook)
                            ) {
                                return true;
                            }
                        } else {
                            if (
                                square.isOccupiedByPieceName(PieceName.Queen) ||
                                square.isOccupiedByPieceName(PieceName.Bishop)
                            ) {
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

    isCheckedByKing(player: Player, kingSquare: Square): boolean {
        let square: Square | null = null;

        for (const direction of King.Directions) {
            square = this.getSquareByDirection(kingSquare, direction);
            if (
                square &&
                square.isOccupiedByPieceName(PieceName.King) &&
                square.isOccupiedByOpponent(player.color)
            ) {
                return true;
            }
        }

        return false;
    }

    serializePieces(): SerializedPieces {
        const pieces: SerializedPieces = {};

        for (const [squareName, square] of this.squares.entries()) {
            if (square.piece) {
                pieces[squareName] = {
                    name: square.piece.getName() as string,
                    color: square.piece.color as string,
                };
            }
        }

        return pieces;
    }
}
