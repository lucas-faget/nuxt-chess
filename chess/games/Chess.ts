import { ChessVariant } from "../types/ChessVariant";
import type { Coordinates } from "../coordinates/Position";
import type { PlayerColor } from "../types/PlayerColor";
import type { Player } from "../players/Player";
import { Blacks, Golds, Silvers, Whites } from "../players/Players";
import type { Square } from "../squares/Square";
import type { Move } from "../moves/Move";
import type { SerializedMove } from "../serialization/SerializedMove";
import type { MoveState } from "../types/MoveState";
import type { LegalMoves } from "../types/LegalMoves";
import type { SerializedLegalMoves } from "../serialization/SerializedLegalMoves";
import type { ChessboardState } from "../types/ChessboardState";
import type { Chessboard } from "../chessboards/Chessboard";
import { TwoPlayerChessboard } from "../chessboards/TwoPlayerChessboard";
import { FourPlayerChessboard } from "../chessboards/FourPlayerChessboard";
import type { Piece } from "../pieces/Piece";

const isChessVariant = (variant: string) =>
    Object.values(ChessVariant).includes(variant.toLowerCase() as ChessVariant);

export class Chess {
    static TwoPlayerChessboardPosition: string = "8/8/8/8/8/8/4wQwK2/7bk";
    static FourPlayerChessboardPosition: string =
        "3bRbNbBbKbQbBbNbR3/" +
        "3bPbPbPbPbPbPbPbP3/" +
        "14/" +
        "sRsP10gPgR/" +
        "sNsP10gPgN/" +
        "sBsP10gPgB/" +
        "sQsP10gPgK/" +
        "sKsP10gPgQ/" +
        "sBsP10gPgB/" +
        "sNsP10gPgN/" +
        "sRsP10gPgR/" +
        "14/" +
        "3wPwPwPwPwPwPwPwP3/" +
        "3wRwNwBwQwKwBwNwR3";

    variant: ChessVariant;
    players: Player[];
    activePlayerIndex: number = 0;
    chessboard: Chessboard;
    legalMoves: LegalMoves = {};
    chessboardHistory: ChessboardState[] = [];
    moveHistory: MoveState[] = [];
    gameOver: boolean = false;
    checkmatePiece: Piece | undefined = undefined;

    constructor(variant: string = "", position: string = "") {
        this.variant = isChessVariant(variant) ? (variant as ChessVariant) : ChessVariant.Standard;

        this.players =
            variant === ChessVariant.FourPlayer
                ? [Whites, Silvers, Blacks, Golds]
                : [Whites, Blacks];

        if (!position) {
            position =
                variant === ChessVariant.FourPlayer
                    ? Chess.FourPlayerChessboardPosition
                    : Chess.TwoPlayerChessboardPosition;
        }

        this.chessboard =
            variant === ChessVariant.FourPlayer
                ? new FourPlayerChessboard(position)
                : new TwoPlayerChessboard(position);

        this.addPositionToHistory(position);

        this.setLegalMoves();
    }

    setLegalMoves(): void {
        const player: Player = this.players[this.activePlayerIndex];
        const kingSquare: Square | null = this.chessboard.findKingSquare(player.color);
        if (kingSquare) {
            const enPassantTarget: string | null =
                this.chessboardHistory[this.chessboardHistory.length - 1].enPassantTarget;

            this.legalMoves = this.chessboard.calculateLegalMoves(
                player,
                kingSquare,
                enPassantTarget
            );

            if (Object.keys(this.legalMoves).length === 0) {
                this.gameOver = true;
                const checkmatePiece: Piece | false = this.chessboard.isChecked(
                    this.players[this.activePlayerIndex],
                    kingSquare
                );
                if (checkmatePiece) {
                    this.checkmatePiece = checkmatePiece;
                }
            } else {
                this.gameOver = false;
                this.checkmatePiece = undefined;
            }
        }
    }

    isLegalMove(fromSquareName: string, toSquareName: string): boolean {
        return fromSquareName in this.legalMoves && toSquareName in this.legalMoves[fromSquareName];
    }

    getLegalMove(fromSquareName: string, toSquareName: string): Move | null {
        return this.isLegalMove(fromSquareName, toSquareName)
            ? this.legalMoves[fromSquareName][toSquareName]
            : null;
    }

    serializeLegalMoves(): SerializedLegalMoves {
        const legalMoves: SerializedLegalMoves = {};

        for (const from in this.legalMoves) {
            if (this.legalMoves.hasOwnProperty(from)) {
                legalMoves[from] = {};
                for (const to in this.legalMoves[from]) {
                    if (this.legalMoves[from].hasOwnProperty(to)) {
                        legalMoves[from][to] = true;
                    }
                }
            }
        }

        return legalMoves;
    }

    isPlayerActive(color: PlayerColor): boolean {
        return this.players[this.activePlayerIndex].color === color;
    }

    setNextPlayer(): void {
        this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
    }

    setPreviousPlayer(): void {
        this.activePlayerIndex =
            (this.activePlayerIndex - 1 + this.players.length) % this.players.length;
    }

    addPositionToHistory(position: string, enPassantTarget: string | null = null) {
        this.chessboardHistory.push({
            position,
            enPassantTarget,
        });
    }

    addMoveToHistory(move: Move) {
        this.moveHistory.push({
            move,
            serialized: move.serialize(),
            algebraic: move.toString(),
        });
    }

    getHalfMoves(): string[] {
        return this.moveHistory.map((moveState) => moveState.algebraic);
    }

    getChessboardPositionByIndex(moveIndex: number = this.chessboardHistory.length - 1): string {
        if (moveIndex >= 0 && moveIndex < this.chessboardHistory.length) {
            return this.chessboardHistory[moveIndex].position;
        } else {
            return this.chessboardHistory[this.chessboardHistory.length - 1].position;
        }
    }

    move(move: Move): void {
        this.addMoveToHistory(move);
        move.carryOutMove();
        this.addPositionToHistory(this.chessboard.toString(), move.enPassantTarget);
        this.setNextPlayer();
        this.setLegalMoves();
    }

    tryMove(fromSquareName: string, toSquareName: string): SerializedMove | null {
        if (this.isLegalMove(fromSquareName, toSquareName)) {
            const move = this.getLegalMove(fromSquareName, toSquareName);
            if (move) {
                this.move(move);
                return this.moveHistory[this.moveHistory.length - 1].serialized;
            }
        }

        return null;
    }

    cancelLastMove(): SerializedMove | null {
        if (this.moveHistory.length > 0) {
            const moveState: any = this.moveHistory.pop();
            moveState.move?.undoMove();
            this.setPreviousPlayer();
            this.setLegalMoves();
            return moveState.serialized;
        }

        return null;
    }

    resetGame(): void {
        // TODO
    }

    static areEqualCoordinates(corrdinates1: Coordinates, coordinates2: Coordinates): boolean {
        return corrdinates1.x === coordinates2.x && coordinates2.y === coordinates2.y;
    }
}
