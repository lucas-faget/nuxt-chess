import type { Coordinates } from "../coordinates/Position";
import { Direction } from "../coordinates/Direction";
import type { PlayerColor } from "../types/PlayerColor";
import { Pawn } from "../pieces/Pawn";
import type { Square } from "../squares/Square";

export class Player {
    name: string;
    color: PlayerColor;
    direction: Coordinates;
    pawnCaptureDirections: Coordinates[];
    enPassantCaptureDirections: Coordinates[];
    kingSquare: Square | null = null;
    isChecked: boolean = false;

    constructor(color: PlayerColor, name: string, direction: Coordinates) {
        this.color = color;
        this.name = name;
        this.direction = direction;
        this.pawnCaptureDirections = Pawn.getCaptureDirections(direction);
        this.enPassantCaptureDirections = Pawn.getEnPassantCaptureDirections(direction);
    }

    kingsideDirection(): Coordinates {
        return this.direction.y === 0 ? Direction.Right : Direction.Down;
    }

    queensideDirection(): Coordinates {
        return this.direction.y === 0 ? Direction.Left : Direction.Up;
    }
}
