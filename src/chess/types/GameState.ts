import type { Move } from "../moves/Move"

export type GameState = {
    move: Move|null,
    enPassantTarget: string|null,
}
