import type { Move } from "../moves/Move";
import type { SerializedMove } from "../serialization/SerializedMove";

export type MoveState = {
    move: Move;
    serialized: SerializedMove;
    algebraic: string;
};
