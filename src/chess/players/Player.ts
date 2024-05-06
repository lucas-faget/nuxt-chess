import type { Coordinates } from "../coordinates/Position";
import { Direction } from "../coordinates/Direction";
import type { PlayerColor } from "../types/PlayerColor";

export class Player {
    name: string;
    color: PlayerColor;
    direction: Coordinates;

    constructor(color: PlayerColor, name: string, direction: Coordinates) {
        this.color = color;
        this.name = name;
        this.direction = direction;
    }

    kingsideDirection(): Coordinates {
        return this.direction.y === 0 ? Direction.Right : Direction.Down;
    }

    queensideDirection(): Coordinates {
        return this.direction.y === 0 ? Direction.Left : Direction.Up;
    }
}
