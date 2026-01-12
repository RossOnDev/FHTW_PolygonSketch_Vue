import {Position} from "./Position.ts";

export interface Model {

	finishedPolygons: Position[][]
	currentPolygon: Position[],
	mousePos: Position

	past: Model | undefined,
	future: Model | undefined
}