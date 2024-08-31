import type { Move } from "../moves/Move";
import type { SerializedMove } from "../serialization/SerializedMove";

export type GameState = {
    fenPosition: string;
    enPassantTarget: string | null;
    move: Move | null;
    serializedMove: SerializedMove | null;
};
