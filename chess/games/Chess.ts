import { ChessVariant } from "../types/ChessVariant";
import type { Coordinates } from "../coordinates/Position";
import type { PlayerColor } from "../types/PlayerColor";
import type { Player } from "../players/Player";
import { Blacks, Golds, Silvers, Whites } from "../players/Players";
import type { Square } from "../squares/Square";
import type { Move } from "../moves/Move";
import type { LegalMoves } from "../types/LegalMoves";
import type { GameState } from "../types/GameState";
import type { Chessboard } from "../chessboards/Chessboard";
import { TwoPlayerChessboard } from "../chessboards/TwoPlayerChessboard";
import { FourPlayerChessboard } from "../chessboards/FourPlayerChessboard";
import type { SerializedMove } from "../serialization/SerializedMove";
import type { SerializedLegalMoves } from "../serialization/SerializedLegalMoves";

const isChessVariant = (variant: string) =>
    Object.values(ChessVariant).includes(variant.toLowerCase() as ChessVariant);

export class Chess {
    static TwoPlayerFenPosition: string =
        "bRbNbBbQbKbBbNbR/bPbPbPbPbPbPbPbP/8/8/8/8/wPwPwPwPwPwPwPwP/wRwNwBwQwKwBwNwR";
    static FourPlayerFenPosition: string =
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
    chessboard: Chessboard;
    legalMoves: LegalMoves = {};
    history: GameState[] = [];
    activePlayerIndex = 0;

    constructor(variant: string = "", fenPosition: string = "") {
        this.variant = isChessVariant(variant) ? (variant as ChessVariant) : ChessVariant.Standard;

        this.players =
            variant === ChessVariant.FourPlayer
                ? [Whites, Silvers, Blacks, Golds]
                : [Whites, Blacks];

        if (!fenPosition) {
            fenPosition =
                variant === ChessVariant.FourPlayer
                    ? Chess.FourPlayerFenPosition
                    : Chess.TwoPlayerFenPosition;
        }

        this.chessboard =
            variant === ChessVariant.FourPlayer
                ? new FourPlayerChessboard(fenPosition)
                : new TwoPlayerChessboard(fenPosition);

        this.addGameState(fenPosition);

        this.setLegalMoves();
    }

    setLegalMoves(): void {
        const player: Player = this.players[this.activePlayerIndex];
        const kingSquare: Square | null = this.chessboard.findKingSquare(player.color);
        const enPassantTarget: string | null =
            this.history[this.history.length - 1].enPassantTarget;

        this.legalMoves = this.chessboard.calculateLegalMoves(player, kingSquare, enPassantTarget);
    }

    isLegalMove(fromSquareName: string, toSquareName: string): boolean {
        return fromSquareName in this.legalMoves && toSquareName in this.legalMoves[fromSquareName];
    }

    getLegalMove(fromSquareName: string, toSquareName: string): Move | null {
        return this.isLegalMove(fromSquareName, toSquareName)
            ? this.legalMoves[fromSquareName][toSquareName]
            : null;
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

    addGameState(
        fenPosition: string,
        enPassantTarget: string | null = null,
        move: Move | null = null
    ): void {
        this.history.push({
            fenPosition: fenPosition,
            enPassantTarget: enPassantTarget,
            move: move,
            serializedMove: move?.serialize() ?? null,
        });
    }

    getMoveByIndex(index: number): SerializedMove | null {
        if (index >= 0 && index < this.history.length) {
            return this.history[index].move?.serialize() ?? null;
        }

        return null;
    }

    getPositionByIndex(moveIndex: number = this.history.length - 1): string {
        if (moveIndex >= 0 && moveIndex < this.history.length) {
            return this.history[moveIndex].fenPosition;
        } else {
            return this.history[this.history.length - 1].fenPosition;
        }
    }

    tryMove(fromSquareName: string, toSquareName: string): SerializedMove | null {
        if (this.isLegalMove(fromSquareName, toSquareName)) {
            const move = this.getLegalMove(fromSquareName, toSquareName);
            if (move) {
                this.move(move);
                return this.history[this.history.length - 1].serializedMove;
            }
        }

        return null;
    }

    move(move: Move): void {
        move.carryOutMove();
        this.addGameState(this.chessboard.toString(), move.enPassantTarget, move);
        this.setNextPlayer();
        this.setLegalMoves();
    }

    cancelLastMove(): SerializedMove | null {
        if (this.history.length > 1) {
            const gameState: GameState | null = this.history.pop() ?? null;
            if (gameState) {
                gameState.move?.undoMove();
                this.setPreviousPlayer();
                this.setLegalMoves();
                return gameState.serializedMove;
            }
        }

        return null;
    }

    resetGame(): void {
        // TODO
    }

    static areEqualCoordinates(corrdinates1: Coordinates, coordinates2: Coordinates): boolean {
        return corrdinates1.x === coordinates2.x && coordinates2.y === coordinates2.y;
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
}
