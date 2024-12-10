import { exec } from "child_process";
import * as common from "./modules/common";
const fs = require("node:fs");

const inputPath: string = "./inputs/day3-input.txt";

const asOneString: string = fs.readFileSync(inputPath, "utf-8");

// Create RegExp to find the mul() instructions and the conditionals
// The named conditional group will be used later to sort them
const combinedRE = new RegExp(
	"(?<conditional>(don't\\(\\))|(do\\(\\)))|(?:mul\\((\\d{1,3}),(\\d{1,3})\\))",
	"g"
);

// Get the numbers and inxex from the matched mul() instruction
function parseMul(match: RegExpExecArray): { foundIndex: number; foundNumbers: [number, number] } {
	return {
		foundIndex: match.index,
		foundNumbers: [parseInt(match[4]), parseInt(match[5])], // The hardcoded array indexes are liable to breaking if changes are made to the RegExp
	};
}

// Get the instruction from the found do()/don't() conditonal
function parseConditional(match: RegExpExecArray): {
	foundIndex: number;
	mulActive: boolean;
} {
	const activeFlag = match[3] ? true : false; // The hardcoded array indexe is liable to breaking if changes are made to the RegExp
	return {
		foundIndex: match.index,
		mulActive: activeFlag,
	};
}

type RunningTotal = {
	total: number;
	multActive: boolean;
};
// To use as callback on the found matches array
// Keeps track of whether we're currently doing mult() instructions and adds the rusult of the multiplication to the running total if we are
function uncorrupt(total: RunningTotal, match: RegExpExecArray): RunningTotal {
	const newTotal: RunningTotal = total;
	if (match.groups?.conditional) {
		// If the named capture group "conditionals" from the RegExp is present, we're on a conditional
		newTotal.multActive = parseConditional(match).mulActive;
	} else if (total.multActive) {
		// We're on a matched mul() instruction
		const nums: [number, number] = parseMul(match).foundNumbers;
		newTotal.total += nums[0] * nums[1];
	}
	return newTotal; // The new total to give to the next interation
}

// Get all matches
const combined = [...asOneString.matchAll(combinedRE)];

// Run through the array of matches and add up the active multiplications
const output = combined.reduce(uncorrupt, { total: 0, multActive: true });

console.log(output);
