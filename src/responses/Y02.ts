interface TemperatureInformation {
	serial: string;
	temperature?: number;
}

/**
 * Component temperature value sent as part of a G00 response
 * or pushed from the hub
 *
 * structure
 * Y02 <serial number> <temperature>
 *
 * temperature can be a number or a string "N/A" if info is not available or outdated
 *
 * example
 * Y02 234000012006 24.125
 */
export const Y02 = (input: string): TemperatureInformation => {
	const matches = input.match(
		/^(?<serial>\d{12})\s(?<temperature>N\/A|\d+(?:.\d+)?)$/
	);
	if (!matches) {
		throw new TypeError('Invalid component temperature info structure');
	}

	const groups = matches.groups as {
		serial: string;
		temperature: string;
	};

	return {
		serial: groups.serial,
		temperature:
			groups.temperature === 'N/A' ? undefined : Number(groups.temperature)
	};
};
