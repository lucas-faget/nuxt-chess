import type { PlayerColor } from "../enums/PlayerColor"

export class Player
{
    color: PlayerColor;
    name: string;
    advantage: number;

    constructor(color: PlayerColor, name: string) {
        this.color = color;
        this.name = name;
        this.advantage = 0;
    }
}
