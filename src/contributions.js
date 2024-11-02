const { writeFileSync } = require("node:fs");

const scrapeContributions = async () => {
	const html = await (
		await fetch("https://github.com/users/ItsPi3141/contributions")
	).text();
	const dateRegex = /<tool-tip.*<\/tool-tip>/gm;

	const data = html.match(dateRegex).map((date) => {
		const dataRegex =
			/(?<=tool-tip.*contribution-day-component-)(?<row>\d+)-(?<col>\d+)(?:\n|.)*?(?<count>\d+|No)(?= contribution)/gm;

		const extractedData = dataRegex.exec(date).groups;
		return [
			Number.parseInt(extractedData.row),
			Number.parseInt(extractedData.col),
			Number.parseInt(extractedData.count === "No" ? 0 : extractedData.count),
		];
	});
	return data;
};

(async () => {
	const contributions = await scrapeContributions();
	writeFileSync("contributions.json", JSON.stringify(contributions));
})();
