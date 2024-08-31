import { defineStore } from "pinia";
import { useSettings } from "~/composables/useSettings";
import { Chess } from "~/chess/games/Chess";
import {
    VChessboard,
    VChessVariant,
    type VLegalMoves,
    type VMove,
    type VPieces,
    type VPlayer,
} from "~/types";

const { isChessboardSpinAutomatic } = useSettings();

export const useChessStore = defineStore("chess", {
    state: () => ({
        variant: null as VChessVariant | null,
        chess: null as Chess | null,
        players: [] as VPlayer[],
        chessboard: null as VChessboard | null,
        activePlayerIndex: 0,
        lastMoveIndex: 0,
        currentMoveIndex: 0,
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
            const chess: Chess = new Chess(variant as string);
            const chessboard: VChessboard = new VChessboard(
                chess.chessboard.ranks,
                chess.chessboard.files,
                chess.chessboard.serializePieces()
            );
            this.variant = variant;
            this.chess = chess;
            this.players = chess.players.map((player) => {
                return {
                    name: player.name,
                    color: player.color as string,
                };
            });
            this.chessboard = chessboard;
            this.activePlayerIndex = chess.activePlayerIndex;
            this.lastMoveIndex = chess.currentMoveIndex;
            this.currentMoveIndex = chess.currentMoveIndex;
            this.legalMoves = chess.serializeLegalMoves();
        },
        fillChessboard(pieces: VPieces) {
            this.chessboard?.fillChessboard(pieces);
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
            if (this.isActiveMoveTheLast) {
                const move: VMove = this.chess?.tryMove(fromSquareName, toSquareName) as VMove;
                if (move) {
                    this.carryOutMove(move);
                    this.activePlayerIndex = this.chess?.activePlayerIndex ?? 0;
                    this.lastMoveIndex = this.chess?.currentMoveIndex ?? 0;
                    this.currentMoveIndex = this.chess?.currentMoveIndex ?? 0;
                    this.legalMoves = this.chess?.serializeLegalMoves() ?? {};
                    if (isChessboardSpinAutomatic()) {
                        this.playerInFrontIndex = this.activePlayerIndex;
                    }
                }
            }
        },
        cancelLastMove() {
            if (this.isActiveMoveTheLast) {
                const move: VMove = this.chess?.cancelLastMove() as VMove;
                if (move) {
                    this.undoMove(move);
                    this.activePlayerIndex = this.chess?.activePlayerIndex ?? 0;
                    this.lastMoveIndex = this.chess?.currentMoveIndex ?? 0;
                    this.currentMoveIndex = this.chess?.currentMoveIndex ?? 0;
                    this.legalMoves = this.chess?.serializeLegalMoves() ?? {};
                }
            }
        },
        spinChessboard() {
            const index = (this.playerInFrontIndex + 1) % this.players.length;
            this.playerInFrontIndex = index;
        },
        goToFirstMove() {
            while (this.currentMoveIndex > 0) {
                this.goToPreviousMove();
            }
        },
        goToPreviousMove() {
            if (this.currentMoveIndex > 0) {
                this.currentMoveIndex -= 1;
                const move: VMove = this.chess?.getMoveByIndex(this.currentMoveIndex) as VMove;
                if (move) {
                    this.undoMove(move);
                }
            }
        },
        goToNextMove() {
            if (this.currentMoveIndex < this.lastMoveIndex) {
                const move: VMove = this.chess?.getMoveByIndex(this.currentMoveIndex) as VMove;
                if (move) {
                    this.carryOutMove(move);
                }
                this.currentMoveIndex += 1;
            }
        },
        goToLastMove() {
            while (this.currentMoveIndex < this.lastMoveIndex) {
                this.goToNextMove();
            }
        },
    },
});
