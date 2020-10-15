export interface Version {
	major: number;
	minor: number;
}

// <major>.<minor>

export const deserialize = (input: string): Version => {
	const matches = input.match(/^(?<major>\d+)\.(?<minor>\d+)$/);

	if (!matches) {
		throw new TypeError('Invalid version info structure');
	}

	const groups = matches.groups as {
		major: string;
		minor: string;
	};

	return {
		major: Number(groups.major),
		minor: Number(groups.minor),
	};
};
