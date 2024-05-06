import { createStore } from "vuex";
import type { Pieces } from "@/types/Pieces";
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
        move({ commit, state }, { fromSquareName, toSquareName }): void {
            state.chess?.tryMove(fromSquareName, toSquareName);
            commit("updateChessboard", state.chess?.chessboard.getPieces());
            commit("setActivePlayerIndex", state.chess?.activePlayerIndex);
            commit("setLastMoveIndex", state.chess?.currentMoveIndex);
            commit("setCurrentMoveIndex", state.chess?.currentMoveIndex);
            commit("setLegalMoves", state.chess?.legalMoves);
        },
        spinChessboard({ commit, state }): void {
            const index = (state.playerInFrontIndex + 1) % state.players.length;
            commit("setPlayerInFrontIndex", index);
        },
        goToFirstMove({ state }): void {
            // TODO
        },
        goToPreviousMove({ state }): void {
            // TODO
        },
        goToNextMove({ state }): void {
            // TODO
        },
        goToLastMove({ state }): void {
            // TODO
        },
        cancelLastMove({ state }): void {
            // TODO
        },
    },
});

export default store;
