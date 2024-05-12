import { createStore } from "vuex";
import type { Pieces } from "@/types/Pieces";
import type { Move } from "@/types/Move";
import { Chessboard } from "@/types/Chessboard";

import { ChessVariant } from "@/chess/types/ChessVariant";
import type { Player } from "@/chess/players/Player";
import type { LegalMoves } from "@/chess/types/LegalMoves";
import type { Chess } from "@/chess/games/Chess";
import { TwoPlayerChess } from "@/chess/games/TwoPlayerChess";
import { FourPlayerChess } from "@/chess/games/FourPlayerChess";

const store = createStore({
    state() {
        return {
            variant: null as ChessVariant | null,
            chess: null as Chess | null,
            players: [] as Player[],
            chessboard: null as Chessboard | null,
            activePlayerIndex: 0,
            lastMoveIndex: 0,
            currentMoveIndex: 0,
            playerInFrontIndex: 0,
            legalMoves: {} as LegalMoves,
        };
    },
    getters: {
        isActiveMoveTheLast: (state): boolean => {
            return state.lastMoveIndex === state.currentMoveIndex;
        },
    },
    mutations: {
        setVariant(state, variant: ChessVariant) {
            state.variant = variant;
        },
        setChess(state, chess: Chess) {
            state.chess = chess;
        },
        setPlayers(state, players: Player[]) {
            state.players = players;
        },
        setChessboard(state, chessboard: Chessboard) {
            state.chessboard = chessboard;
        },
        setActivePlayerIndex(state, index: number) {
            state.activePlayerIndex = index;
        },
        setLastMoveIndex(state, index: number) {
            state.lastMoveIndex = index;
        },
        setCurrentMoveIndex(state, index: number) {
            state.currentMoveIndex = index;
        },
        setPlayerInFrontIndex(state, index: number) {
            state.playerInFrontIndex = index;
        },
        setLegalMoves(state, legalMoves: LegalMoves) {
            state.legalMoves = legalMoves;
        },
        updateChessboard(state, pieces: Pieces) {
            state.chessboard?.fillChessboard(pieces);
        },
        carryOutMove(state, move: Move) {
            state.chessboard?.carryOutMove(move);
        },
        undoMove(state, move: Move) {
            state.chessboard?.undoMove(move);
        },
    },
    actions: {
        gameExists({ state }, variant: ChessVariant): boolean {
            return state.chess !== null && state.variant === variant;
        },
        createTwoPlayerChessGame({ commit }, variant: ChessVariant = ChessVariant.Standard): void {
            const chess: Chess = new TwoPlayerChess(variant);
            const chessboard: Chessboard = new Chessboard(
                chess.chessboard.ranks,
                chess.chessboard.files,
                chess.chessboard.getPieces()
            );
            commit("setVariant", variant);
            commit("setChess", chess);
            commit("setPlayers", chess.players);
            commit("setChessboard", chessboard);
            commit("setActivePlayerIndex", chess.activePlayerIndex);
            commit("setLastMoveIndex", chess.currentMoveIndex);
            commit("setCurrentMoveIndex", chess.currentMoveIndex);
            commit("setLegalMoves", chess.legalMoves);
        },
        createFourPlayerChessGame({ commit }): void {
            const chess: Chess = new FourPlayerChess();
            const chessboard: Chessboard = new Chessboard(
                chess.chessboard.ranks,
                chess.chessboard.files,
                chess.chessboard.getPieces()
            );
            commit("setVariant", ChessVariant.FourPlayer);
            commit("setChess", chess);
            commit("setPlayers", chess.players);
            commit("setChessboard", chessboard);
            commit("setActivePlayerIndex", chess.activePlayerIndex);
            commit("setLastMoveIndex", chess.currentMoveIndex);
            commit("setCurrentMoveIndex", chess.currentMoveIndex);
            commit("setLegalMoves", chess.legalMoves);
        },
        checkLegalMove({ state }, { fromSquareName, toSquareName }): boolean {
            return (
                fromSquareName in state.legalMoves &&
                toSquareName in state.legalMoves[fromSquareName]
            );
        },
        getLegalMove({ state }, { fromSquareName, toSquareName }): Move | null {
            return state.chess?.getLegalMove(fromSquareName, toSquareName)?.serialize() ?? null;
        },
        tryMove({ commit, getters, state }, { fromSquareName, toSquareName }): void {
            if (getters.isActiveMoveTheLast) {
                const move = state.chess?.tryMove(fromSquareName, toSquareName);
                if (move) {
                    commit("carryOutMove", move);
                    commit("setActivePlayerIndex", state.chess?.activePlayerIndex);
                    commit("setLastMoveIndex", state.chess?.currentMoveIndex);
                    commit("setCurrentMoveIndex", state.chess?.currentMoveIndex);
                    commit("setLegalMoves", state.chess?.legalMoves);
                }
            }
        },
        cancelLastMove({ commit, getters, state }): void {
            if (getters.isActiveMoveTheLast) {
                const move = state.chess?.cancelLastMove();
                if (move) {
                    commit("undoMove", move);
                    commit("setActivePlayerIndex", state.chess?.activePlayerIndex);
                    commit("setLastMoveIndex", state.chess?.currentMoveIndex);
                    commit("setCurrentMoveIndex", state.chess?.currentMoveIndex);
                    commit("setLegalMoves", state.chess?.legalMoves);
                }
            }
        },
        spinChessboard({ commit, state }): void {
            const index = (state.playerInFrontIndex + 1) % state.players.length;
            commit("setPlayerInFrontIndex", index);
        },
        goToFirstMove({ dispatch, state }): void {
            while (state.currentMoveIndex > 0) {
                dispatch("goToPreviousMove");
            }
        },
        goToPreviousMove({ commit, state }): void {
            if (state.currentMoveIndex > 0) {
                commit("setCurrentMoveIndex", state.currentMoveIndex - 1);
                const move = state.chess?.getMoveByIndex(state.currentMoveIndex);
                if (move) {
                    commit("undoMove", move);
                }
            }
        },
        goToNextMove({ commit, state }): void {
            if (state.currentMoveIndex < state.lastMoveIndex) {
                const move = state.chess?.getMoveByIndex(state.currentMoveIndex);
                if (move) {
                    commit("carryOutMove", move);
                }
                commit("setCurrentMoveIndex", state.currentMoveIndex + 1);
            }
        },
        goToLastMove({ dispatch, state }): void {
            while (state.currentMoveIndex < state.lastMoveIndex) {
                dispatch("goToNextMove");
            }
        },
    },
});

export default store;
