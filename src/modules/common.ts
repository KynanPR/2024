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
