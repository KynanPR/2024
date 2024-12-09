import * as common from "./modules/common";

const filePath = "./inputs/day2-input.txt";

type Level = number;

class Report {
	levels: Level[];
	constructor(levels: number[]) {
		this.levels = levels;
	}

	// Check if this Report fulfils the "safe" criteria
	isSafe(): boolean {
		// First check if the Report is safe as is
		const alreadySafe: boolean = this.isSafeReport(this.levels);
		// Expensive way of checking damped safety so is not immidiatly run
		const safeWithDamping = (): boolean => {
			return this.levels.some((levelToRemove, index, originalReport) => {
				const dampenedReport = originalReport.toSpliced(index, 1);
				return this.isSafeReport(dampenedReport);
			});
		};

		return alreadySafe || safeWithDamping();
	}
	private isSafeReport(report: Level[]): boolean {
		return report.every((currentLevel, index, reportLevels) => {
			return this.isSafeLevel(currentLevel, reportLevels[index - 1], reportLevels[index + 1]);
		});
	}
	private isSafeLevel(
		currentLevel: Level,
		previousLevel: Level | undefined,
		nextLevel: Level | undefined
	): boolean {
		// Check the criteria for each Level with it's neighbours

		// Set of flags to indicate any unsafe level combinations. unsafe state = false
		const safetyFlags = {
			directionChange: false,
			noChange: false,
			bigChange: false,
		};

		const levelType: string = (() => {
			if (previousLevel === undefined || nextLevel === undefined) {
				return previousLevel === undefined ? "First" : "Last";
			} else {
				return "Middle";
			}
		})();

		// Check each safety condition
		// Special checks for first and last Level - determined by undefined previous Levels respectively
		// Ugly type assertion stuff, could be rewitten better
		switch (levelType) {
			case "First":
				// Don't need to check for direction change as it's first change
				checkBigChange(currentLevel, nextLevel as number);
				checkNoChange(currentLevel, nextLevel as number);
				break;
			case "Last":
				// Don't need to check for direction change as it's covererd by the previous Level's checks
				checkBigChange(currentLevel, previousLevel as number);
				checkNoChange(currentLevel, previousLevel as number);
				break;
			case "Middle":
				// Check direction change
				checkDirectionChange(currentLevel, previousLevel as number, nextLevel as number);
				// Check for big changes
				checkBigChange(currentLevel, previousLevel as number);
				checkBigChange(currentLevel, nextLevel as number);
				// Check for no changes
				checkNoChange(currentLevel, previousLevel as number);
				checkNoChange(currentLevel, nextLevel as number);
				break;
		}

		// Only return true if all flags are false
		const isSafeLevel: boolean = Object.values(safetyFlags).every((flag) => {
			return !flag;
		});
		return isSafeLevel;

		// Reusable unsafe check functions
		function checkBigChange(levelA: Level, levelB: Level): void {
			safetyFlags.bigChange = Math.abs(levelA - levelB) > 3;
		}
		function checkNoChange(levelA: Level, levelB: Level): void {
			safetyFlags.noChange = levelA === levelB;
		}
		function checkDirectionChange(
			currentLevel: Level,
			previousLevel: Level,
			nextLevel: Level
		): void {
			const changeFromPrev = currentLevel - previousLevel;
			const changeFromNext = nextLevel - currentLevel;
			// If the sign of the changes differs then there is not a continuous increase/decrease
			safetyFlags.directionChange = !(Math.sign(changeFromPrev) === Math.sign(changeFromNext));
		}
	}
}

function getReports(): Report[] {
	const inputLines: string[] = common.inputToArray(filePath);
	const reports: number[][] = inputLines.map((report) => {
		return report.split(" ").map((level) => {
			return parseInt(level);
		});
	});

	return reports.map((report) => {
		return new Report(report);
	});
}

const reports: Report[] = getReports();
// const nonReports = [
// 	[7, 6, 4, 2, 1],
// 	[1, 2, 7, 8, 9],
// 	[9, 7, 6, 2, 1],
// 	[1, 3, 2, 4, 5],
// 	[8, 6, 4, 4, 1],
// 	[1, 3, 6, 7, 9],
// ];
// const reports = nonReports.map((nonReport) => {
// 	return new Report(nonReport);
// });
const safeCount: number = reports.reduce((totalSafe, current) => {
	const isCurrentSafe: number = current.isSafe() ? 1 : 0;
	return totalSafe + isCurrentSafe;
}, 0);

console.log("There are", safeCount, "safe reports");
