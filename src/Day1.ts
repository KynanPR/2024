import * as common from "./modules/common";

const inputPath: string = "./inputs/day1-input.txt";

class Lists {
	leftList: number[];
	rightList: number[];

	constructor(leftList: number[], rightList: number[]) {
		this.leftList = leftList;
		this.rightList = rightList;
	}

	// Get an array of the differences between the numbers with same index of right and left list
	get differences(): number[] {
		// Safety check. Lists should be the same length
		if (this.leftList.length === this.rightList.length) {
			return locationLists.leftList.map((locationId, index) => {
				return Math.abs(locationId - this.rightList[index]);
			});
		} else {
			throw new Error("Unequal list lengths");
		}
	}

	get sharedIdCounts(): number[][] {
		// Create a new Map with the keys as leftList entries and values initialised to 0
		// It's a map to make getting and setting counts based on locationId easier
		const locationCounters = new Map(
			this.leftList.map((locationId) => {
				return [locationId, 0];
			})
		);

		// Itterate over rightList and increment the apperance count when the location id also appears in leftList/locationCounters
		this.rightList.forEach((locationId) => {
			const currentCount = locationCounters.get(locationId);
			currentCount !== undefined ? locationCounters.set(locationId, currentCount + 1) : null;
		});

		// Return location counters as an array rather than Map now Map's usufulness is done
		return Array.from(locationCounters);
	}
}

console.log("Advent of Code!");

// Turn the input file into a Lists object containing the numbers in the order they appear
function getUnsortedLists(filePath: string) {
	const splitLines: string[] = common.inputToArray(filePath);
	// const asOneString: string = fs.readFileSync(filePath, "utf-8"); // Inital stream is one string
	// const splitLines: string[] = asOneString.split("\n");
	const leftList: number[] = [];
	const rightList: number[] = [];

	splitLines.forEach((combinedIds) => {
		const splitIds = combinedIds.split("   ");
		leftList.push(parseInt(splitIds[0]));
		rightList.push(parseInt(splitIds[1]));
	});

	return new Lists(leftList, rightList);
}

// Get the input file as sorted lists
function getLists() {
	const unsortedLists = getUnsortedLists(inputPath);
	const sortedLeft: number[] = unsortedLists.leftList.sort();
	const sortedRight: number[] = unsortedLists.rightList.sort();
	return new Lists(sortedLeft, sortedRight);
}

const locationLists: Lists = getLists();
console.log(
	"Difference sum: ",
	locationLists.differences.reduce((total, value) => {
		return total + value;
	})
);
console.log(
	"Similarity Score: ",
	locationLists.sharedIdCounts.reduce((total, locationIdCount) => {
		const similarityScore: number = locationIdCount[0] * locationIdCount[1];
		return total + similarityScore;
	}, 0)
);
