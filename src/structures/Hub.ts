import { unescapeSpace } from '../utils';

export interface Hub {
	serialNumber: string;
	name: string;
	defaultAwayOverrideLength: number; // @todo what unit ?
	activeOverrideId?: number;
	softwareVersion: number;
	hardwareVersion: string;
	productionDate: number;
}

// <Serial number> <Name> <AwayOverrideLength> <ActiveOverrideId>
// <SoftwareVersion> <HardwareVersion> <ProductionDate>

export const deserialize = (input: string): Hub => {
	const matches = input.match(
		/^(?<serial>\d{12})\s(?<name>.*?)\s(?<overrideLength>\d+)\s(?<override>-?\d+)\s(?<soft>\d+)\s(?<hard>[a-z\d._]+)\s(?<date>\d{8})$/
	);

	if (!matches) {
		throw new TypeError('Invalid hub info structure');
	}

	const groups = matches.groups as {
		serial: string;
		name: string;
		overrideLength: string;
		override: string;
		soft: string;
		hard: string;
		date: string;
	};

	const hub: Hub = {
		serialNumber: groups.serial,
		name: unescapeSpace(groups.name),
		defaultAwayOverrideLength: Number(groups.overrideLength),
		softwareVersion: Number(groups.soft),
		hardwareVersion: groups.hard,
		productionDate: Number(groups.date)
	};

	const activeOverrideId = Number(groups.override);
	if (activeOverrideId !== -1) {
		hub.activeOverrideId = activeOverrideId;
	}

	return hub;
};
