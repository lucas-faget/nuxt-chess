import { PlayerColor } from "@/chess/types/PlayerColor";
import type { PieceName } from "@/chess/types/PieceName";

export const getFullLetterColor = (color: PlayerColor): string => {
    switch (color) {
        case PlayerColor.White:
            return "white";
        case PlayerColor.Black:
            return "black";
        case PlayerColor.Silver:
            return "silver";
        case PlayerColor.Gold:
            return "gold";
    }
};

export const getPieceImageSrc = (color: PlayerColor, pieceName: PieceName): string => {
    return `/assets/piece/${getFullLetterColor(color)}/${pieceName}.svg`;
};

export const getContrastColor = (color: PlayerColor): PlayerColor => {
    switch (color) {
        case PlayerColor.White:
        case PlayerColor.Silver:
            return PlayerColor.Black;
        default:
            return PlayerColor.White;
    }
};
