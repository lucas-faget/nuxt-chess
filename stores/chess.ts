import { defineStore } from "pinia";
import { useSettings } from "~/composables/useSettings";
import { Chess } from "~/chess/games/Chess";
import { VChessboard, VChessVariant, type VLegalMoves, type VMove, type VPlayer } from "~/types";

const { isChessboardSpinAutomatic } = useSettings();

export const useChessStore = defineStore("chess", {
    state: () => ({
        variant: null as VChessVariant | null,
        lastMoveIndex: 0,
        currentMoveIndex: 0,
        chess: null as Chess | null,
        players: [] as VPlayer[],
        chessboard: null as VChessboard | null,
        activePlayerIndex: 0,
        playerInFrontIndex: 0,
        legalMoves: {} as VLegalMoves,
    }),
    getters: {
        isActiveMoveTheLast: (state) => state.lastMoveIndex === state.currentMoveIndex,
    },
    actions: {
        gameExists(): boolean {
            return this.chess !== null;
        },
        createChessGame(variant: VChessVariant = VChessVariant.Standard) {
            this.variant = variant;
            this.lastMoveIndex = 0;
            this.currentMoveIndex = 0;
            this.chess = new Chess(variant as string);
            this.players = this.chess.players.map((player) => {
                return {
                    name: player.name,
                    color: player.color as string,
                };
            });
            this.chessboard = new VChessboard(
                this.chess.chessboard.ranks,
                this.chess.chessboard.files,
                this.chess.getPositionByIndex(this.currentMoveIndex)
            );
            this.activePlayerIndex = this.chess.activePlayerIndex;
            this.legalMoves = this.chess.serializeLegalMoves();
        },
        fillChessboard(position: string) {
            this.chessboard?.fill(position);
        },
        checkLegalMove(fromSquareName: string, toSquareName: string): boolean {
            return (
                fromSquareName in this.legalMoves && toSquareName in this.legalMoves[fromSquareName]
            );
        },
        getLegalMove(fromSquareName: string, toSquareName: string): VMove | null {
            return (
                (this.chess?.getLegalMove(fromSquareName, toSquareName)?.serialize() as VMove) ??
                null
            );
        },
        carryOutMove(move: VMove) {
            this.chessboard?.carryOutMove(move);
        },
        undoMove(move: VMove) {
            this.chessboard?.undoMove(move);
        },
        tryMove(fromSquareName: string, toSquareName: string) {
            if (this.chess && this.isActiveMoveTheLast) {
                const move: VMove = this.chess.tryMove(fromSquareName, toSquareName) as VMove;
                if (move) {
                    this.carryOutMove(move);
                    this.activePlayerIndex = this.chess.activePlayerIndex;
                    this.lastMoveIndex++;
                    this.currentMoveIndex++;
                    this.legalMoves = this.chess.serializeLegalMoves() ?? {};
                    if (isChessboardSpinAutomatic()) {
                        this.playerInFrontIndex = this.activePlayerIndex;
                    }
                }
            }
        },
        spinChessboard() {
            const index = (this.playerInFrontIndex + 1) % this.players.length;
            this.playerInFrontIndex = index;
        },
        goToMove(moveIndex: number) {
            if (
                this.chess &&
                moveIndex !== this.currentMoveIndex &&
                moveIndex >= 0 &&
                moveIndex <= this.lastMoveIndex
            ) {
                const position: string = this.chess.getPositionByIndex(moveIndex);
                this.fillChessboard(position);
                this.currentMoveIndex = moveIndex;
            }
        },
        goToFirstMove() {
            if (this.currentMoveIndex > 0) {
                this.goToMove(0);
            }
        },
        goToPreviousMove() {
            if (this.currentMoveIndex > 0) {
                this.goToMove(this.currentMoveIndex - 1);
            }
        },
        goToNextMove() {
            if (this.currentMoveIndex < this.lastMoveIndex) {
                this.goToMove(this.currentMoveIndex + 1);
            }
        },
        goToLastMove() {
            if (this.currentMoveIndex < this.lastMoveIndex) {
                this.goToMove(this.lastMoveIndex);
            }
        },
        cancelLastMove() {
            if (this.chess && this.isActiveMoveTheLast) {
                const move: VMove = this.chess.cancelLastMove() as VMove;
                if (move) {
                    this.undoMove(move);
                    this.activePlayerIndex = this.chess.activePlayerIndex;
                    this.lastMoveIndex--;
                    this.currentMoveIndex--;
                    this.legalMoves = this.chess.serializeLegalMoves() ?? {};
                }
            }
        },
    },
});
