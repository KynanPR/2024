import * as common from "./modules/common";

const inputPath: string = "./inputs/day4-input.txt";

type Letter = "X" | "M" | "A" | "S";
type Row = Letter[];
type Column = Letter[];
// type Coordinate = [number, number];

class Coordinate {
	#column: number; // x direction
	#row: number; // y direction

	constructor(columnNo: number, rowNo: number) {
		this.#column = columnNo;
		this.#row = rowNo;
	}

	get column() {
		return this.#column;
	}
	get row() {
		return this.#row;
	}

	// Helper functions for easy navigation - eg. Left, Down, maybe diagonals
	right(amount: number = 1): Coordinate {
		const newColumnNo = this.column + amount;
		const unchangedRowNo = this.row;
		return new Coordinate(newColumnNo, unchangedRowNo);
	}
	left(amount: number = 1): Coordinate {
		const newColumnNo = this.column - amount;
		const unchangedRowNo = this.row;
		return new Coordinate(newColumnNo, unchangedRowNo);
	}
	down(amount: number = 1): Coordinate {
		const unchangedColumnNo = this.column;
		const newRowNo = this.row + amount;
		return new Coordinate(unchangedColumnNo, newRowNo);
	}
	up(amount: number = 1): Coordinate {
		const unchangedColumnNo = this.column;
		const newRowNo = this.row - amount;
		return new Coordinate(unchangedColumnNo, newRowNo);
	}
}
// Create 2d array of positions - WordSearch
class WordSearch {
	#searchSpace: Column[]; // Indexes from 0. Colunm number (x direction) increasing to the "right". Row number (y direction) increasing "down"

	constructor(letterColumns: Column[]) {
		this.#searchSpace = letterColumns;
	}

	letterAt(coordinate: Coordinate): Letter | undefined {
		try {
			if (
				this.#searchSpace[coordinate.column] === undefined ||
				this.#searchSpace[coordinate.column][coordinate.row] === undefined
			) {
				// Out of bounds check
				return; //"Coordinate is outside of search space";
			} else {
				return this.#searchSpace[coordinate.column][coordinate.row];
			}
		} catch (error) {
			("Coordinate is outside of search space");
		}
	}

	// XMAS finders
	private findXmas(startCoordinate: Coordinate): number {
		const currentLetter: Letter | undefined = this.letterAt(startCoordinate);

		// Check "Backslash" Diagonal \
		const leftUpLetter: Letter | undefined = this.letterAt(startCoordinate.left().up());
		const rightDownLetter: Letter | undefined = this.letterAt(startCoordinate.right().down());
		const backslashDiagLetters = [leftUpLetter, currentLetter, rightDownLetter];
		const backslashDiagMatch: boolean =
			backslashDiagLetters.toString() === mas.toString() ||
			backslashDiagLetters.toReversed().toString() === mas.toString();

		// Then "Forwardslash" Diagonal
		const rightUpLetter: Letter | undefined = this.letterAt(startCoordinate.right().up());
		const leftDownLetter: Letter | undefined = this.letterAt(startCoordinate.left().down());
		const forwardslashDiagLetters = [rightUpLetter, currentLetter, leftDownLetter];
		const forwardslashDiagMatch: boolean =
			forwardslashDiagLetters.toString() === mas.toString() ||
			forwardslashDiagLetters.toReversed().toString() === mas.toString();

		return backslashDiagMatch && forwardslashDiagMatch ? 1 : 0;
		//

		// return (
		// 	this.findHorizontal(startCoordinate) +
		// 	this.findVertical(startCoordinate) +
		// 	this.findDiagonals(startCoordinate)
		// );
	}

	private findHorizontal(startCoordinate: Coordinate): number {
		// Right first
		const rightLetters: Array<Letter | undefined> = Array(xmas.length)
			.fill(null)
			.map((val, colIncrement) => {
				return this.letterAt(startCoordinate.right(colIncrement));
			});
		const rightMatch: number = rightLetters.toString() === xmas.toString() ? 1 : 0;

		// Then Left
		const leftLetters: Array<Letter | undefined> = Array(xmas.length)
			.fill(null)
			.map((val, colIncrement) => {
				return this.letterAt(startCoordinate.left(colIncrement));
			});
		const leftMatch: number = leftLetters.toString() === xmas.toString() ? 1 : 0;

		return rightMatch + leftMatch;
	}
	private findVertical(startCoordinate: Coordinate): number {
		// Down First
		const downLetters: Array<Letter | undefined> = Array(xmas.length)
			.fill(null)
			.map((val, rowIncrement) => {
				return this.letterAt(startCoordinate.down(rowIncrement));
			});
		const downMatch: number = downLetters.toString() === xmas.toString() ? 1 : 0;

		// Then Up
		const upLetters: Array<Letter | undefined> = Array(xmas.length)
			.fill(null)
			.map((val, rowIncrement) => {
				return this.letterAt(startCoordinate.up(rowIncrement));
			});
		const upMatch: number = upLetters.toString() === xmas.toString() ? 1 : 0;

		return downMatch + upMatch;
	}
	private findDiagonals(startCoordinate: Coordinate): number {
		// Right-Down first
		const rightDownLetters: Array<Letter | undefined> = Array(xmas.length)
			.fill(null)
			.map((val, diagIncrement) => {
				return this.letterAt(startCoordinate.right(diagIncrement).down(diagIncrement));
			});
		const rightDownMatch: number = rightDownLetters.toString() === xmas.toString() ? 1 : 0;

		// Then Right-Up
		const rightUpLetters: Array<Letter | undefined> = Array(xmas.length)
			.fill(null)
			.map((val, diagIncrement) => {
				return this.letterAt(startCoordinate.right(diagIncrement).up(diagIncrement));
			});
		const rightUpMatch: number = rightUpLetters.toString() === xmas.toString() ? 1 : 0;

		// Then Left-Down
		const leftDownLetters: Array<Letter | undefined> = Array(xmas.length)
			.fill(null)
			.map((val, diagIncrement) => {
				return this.letterAt(startCoordinate.left(diagIncrement).down(diagIncrement));
			});
		const leftDownMatch: number = leftDownLetters.toString() === xmas.toString() ? 1 : 0;

		// Then Left-Up
		const leftUpLetters: Array<Letter | undefined> = Array(xmas.length)
			.fill(null)
			.map((val, diagIncrement) => {
				return this.letterAt(startCoordinate.left(diagIncrement).up(diagIncrement));
			});
		const leftUpMatch: number = leftUpLetters.toString() === xmas.toString() ? 1 : 0;

		return rightDownMatch + rightUpMatch + leftDownMatch + leftUpMatch;
	}

	// Overall Solver
	solve(): number {
		return this.#searchSpace.reduce((total, col, colIndex) => {
			return (
				total +
				col.reduce((colTotal: number, letter, letterIndex) => {
					if (letter === "A") {
						return colTotal + this.findXmas(new Coordinate(colIndex, letterIndex));
					} else return colTotal;
				}, 0)
			);
		}, 0);
	}
}

const xmas = ["X", "M", "A", "S"];
const mas = ["M", "A", "S"];

const inputArray = common.inputToArray(inputPath);
// const inputArray = [
// 	"MMMSXXMASM",
// 	"MSAMXMSMSA",
// 	"AMXSXMAAMM",
// 	"MSAMASMSMX",
// 	"XMASAMXAMM",
// 	"XXAMMXXAMA",
// 	"SMSMSASXSS",
// 	"SAXAMASAAA",
// 	"MAMMMXMMMM",
// 	"MXMXAXMASX",
// ];

// Rotate the array and prepare it for WordSearch creation
const columnArray: Letter[][] = common.rotateArray(
	inputArray.map((string) => {
		return Array.from(string) as Letter[];
	})
);

// Create and solve the WordSearch
const wordSearch = new WordSearch(columnArray);
console.log(wordSearch.solve());
