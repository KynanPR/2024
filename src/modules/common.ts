import * as fs from "node:fs";

export function inputToArray(inputFilePath: string): string[] {
	try {
		const asOneString: string = fs.readFileSync(inputFilePath, "utf-8"); // Inital stream is one string

		if (asOneString) {
			const splitLines: string[] = asOneString.split("\n"); // Split on line breaks
			!splitLines.at(-1) ? splitLines.pop() : null;
			return splitLines;
		} else {
			throw new Error("No file contents");
		}
	} catch (error) {
		throw new Error("File parse was unsuccessful");
	}
}

export function rotateArray<Type>(arrayToRotate: Type[][]): Type[][] {
	// Find the length of the longest sub-array
	const longest: number = arrayToRotate.toSorted((a, b) => {
		return a.length - b.length;
	})[0].length;
	// Use the length of that array to create the new arrays
	let baseArray: Type[][] = Array(longest)
		.fill(null)
		.map(() => []);
	arrayToRotate.forEach((subArray, index) => {
		subArray.forEach((val, jindex) => {
			baseArray[jindex][index] = val;
		});
	});
	return baseArray;
}
