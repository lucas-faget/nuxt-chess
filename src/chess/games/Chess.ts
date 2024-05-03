import type { Coordinates } from "../coordinates/Position";
import { ChessVariant } from "../types/ChessVariant";
import type { Player } from "../players/Player";
import type { Square } from "../squares/Square";
import type { Move } from "../moves/Move";
import type { LegalMoves } from "../types/LegalMoves";
import type { GameState } from "../types/GameState";
import type { Chessboard } from "../chessboards/Chessboard";

export abstract class Chess
{
    variant: ChessVariant;
    players: Player[];
    chessboard: Chessboard;
    legalMoves: LegalMoves = {};
    gameStates: GameState[] = [];

    activePlayerIndex = 0;
    playerIndexInFront: number = 0;
    activeMoveIndex: number = 0;

    constructor(variant: ChessVariant, players: Player[], chessboard: Chessboard)
    {
        this.variant = variant;
        this.players = players;
        this.chessboard = chessboard;
    }

    setLegalMoves(): void
    {
        const player: Player = this.players[this.activePlayerIndex];
        const kingSquare: Square|null = this.chessboard.searchKingSquare(player.color);
        const enPassantTarget: string|null = this.gameStates[this.activeMoveIndex].enPassantTarget;

        this.legalMoves = this.chessboard.calculateLegalMoves(player, kingSquare, enPassantTarget);
    }

    isLegalMove(fromSquareName: string, toSquareName: string): boolean
    {
        return fromSquareName in this.legalMoves && toSquareName in this.legalMoves[fromSquareName];
    }

    getLegalMove(fromSquareName: string, toSquareName: string): Move|null
    {
        return this.legalMoves[fromSquareName][toSquareName] ?? null;
    }

    isLegalSquare(squareName: string): boolean
    {
        for (const fromSquareName in this.legalMoves) {
            if (squareName in this.legalMoves[fromSquareName]) {
                return true;
            }
        }

        return false;
    }

    isActiveMoveTheLast(): boolean
    {
        return this.activeMoveIndex === this.gameStates.length - 1;
    }

    isPlayerActive(player: Player): boolean
    {
        return this.isActiveMoveTheLast() && this.players[this.activePlayerIndex] === player;
    }

    setNextPlayer(): void
    {
        this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
    }

    setPreviousPlayer(): void
    {
        this.activePlayerIndex = (this.activePlayerIndex - 1 + this.players.length) % this.players.length;
    }

    addNewGameState(enPassantTarget: string|null = null): void
    {
        this.gameStates.push({
            move: null,
            enPassantTarget: enPassantTarget,
        });
    }

    saveMove(move: Move): void
    {
        move.carryoutMove();
        this.gameStates[this.activeMoveIndex].move = move;
        this.addNewGameState(move.enPassantTarget);
        this.activeMoveIndex++;
        this.setNextPlayer();
        this.setLegalMoves();
    }

    deleteLastMove(): void
    {
        if (this.isActiveMoveTheLast()) {
            if (this.gameStates.length > 1)
            {
                this.gameStates.pop();
                this.activeMoveIndex--;
                this.gameStates[this.activeMoveIndex].move!.undoMove();
                this.gameStates[this.activeMoveIndex].move = null;
                this.setPreviousPlayer();
                this.setLegalMoves();
            }
        }
    }

    resetGame(): void
    {
        if (!this.isActiveMoveTheLast()) {
            this.goToLastMove();
        }

        while (this.gameStates.length > 1) {
            this.deleteLastMove();
        }
    }

    spinChessboard(): void
    {
        this.playerIndexInFront = (this.playerIndexInFront + 1) % this.players.length;
    }

    goToPreviousMove(): void
    {
        if (this.activeMoveIndex > 0) {
            this.activeMoveIndex--;
            this.gameStates[this.activeMoveIndex].move!.undoMove();
        }
    }

    goToFirstMove(): void
    {
        while (this.activeMoveIndex > 0) {
            this.goToPreviousMove();
        }
    }

    goToNextMove(): void
    {
        if (this.activeMoveIndex < this.gameStates.length - 1) {
            this.gameStates[this.activeMoveIndex].move!.carryoutMove();
            this.activeMoveIndex++;
        }
    }

    goToLastMove(): void
    {
        while (this.activeMoveIndex < this.gameStates.length - 1) {
            this.goToNextMove();
        }
    }

    isFoggedSquare(squareName: string): boolean
    {
        return this.variant === ChessVariant.FogOfWar
            && this.chessboard.getSquareByName(squareName)?.piece?.color !== this.players[this.activePlayerIndex].color
            && !this.isLegalSquare(squareName);
    }

    static isDarkSquare(x: number, y: number): boolean
    {
        return (y % 2 === 0) ? (x % 2 === 0) : (x % 2 !== 0);
    }

    static areEqualCoordinates(corrdinates1: Coordinates, coordinates2: Coordinates): boolean
    {
        return corrdinates1.x === coordinates2.x && coordinates2.y === coordinates2.y;
    }
}
