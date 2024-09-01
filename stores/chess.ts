import { defineStore } from "pinia";
import { useSettings } from "~/composables/useSettings";
import { Chess } from "~/chess/games/Chess";
import { VChessboard, VChessVariant, type VLegalMoves, type VMove, type VPlayer } from "~/types";

const { isChessboardSpinAutomatic } = useSettings();

export const useChessStore = defineStore("chess", {
    state: () => ({
        variant: null as VChessVariant | null,
        lastHalfmoveIndex: 0,
        activeHalfmoveIndex: 0,
        chess: null as Chess | null,
        players: [] as VPlayer[],
        chessboard: null as VChessboard | null,
        halfmoves: [] as string[],
        activePlayerIndex: 0,
        playerInFrontIndex: 0,
        legalMoves: {} as VLegalMoves,
    }),
    getters: {
        isActiveMoveTheLast: (state) => state.lastHalfmoveIndex === state.activeHalfmoveIndex,
    },
    actions: {
        gameExists(): boolean {
            return this.chess !== null;
        },
        createChessGame(variant: VChessVariant = VChessVariant.Standard) {
            this.variant = variant;
            this.lastHalfmoveIndex = 0;
            this.activeHalfmoveIndex = 0;
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
                this.chess.getPositionByIndex(this.activeHalfmoveIndex)
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
                    this.lastHalfmoveIndex++;
                    this.activeHalfmoveIndex++;
                    this.halfmoves = this.chess.getHalfMoves();
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
                moveIndex !== this.activeHalfmoveIndex &&
                moveIndex > 0 &&
                moveIndex <= this.lastHalfmoveIndex
            ) {
                const position: string = this.chess.getPositionByIndex(moveIndex);
                this.fillChessboard(position);
                this.activeHalfmoveIndex = moveIndex;
            }
        },
        goToFirstMove() {
            if (this.activeHalfmoveIndex > 1) {
                this.goToMove(1);
            }
        },
        goToPreviousMove() {
            if (this.activeHalfmoveIndex > 1) {
                this.goToMove(this.activeHalfmoveIndex - 1);
            }
        },
        goToNextMove() {
            if (this.activeHalfmoveIndex < this.lastHalfmoveIndex) {
                this.goToMove(this.activeHalfmoveIndex + 1);
            }
        },
        goToLastMove() {
            if (this.activeHalfmoveIndex < this.lastHalfmoveIndex) {
                this.goToMove(this.lastHalfmoveIndex);
            }
        },
        cancelLastMove() {
            if (this.chess && this.isActiveMoveTheLast) {
                const move: VMove = this.chess.cancelLastMove() as VMove;
                if (move) {
                    this.undoMove(move);
                    this.activePlayerIndex = this.chess.activePlayerIndex;
                    this.lastHalfmoveIndex--;
                    this.activeHalfmoveIndex--;
                    this.halfmoves = this.chess.getHalfMoves();
                    this.legalMoves = this.chess.serializeLegalMoves() ?? {};
                }
            }
        },
    },
});
