import { escapeSpace, unescapeSpace } from '../utils';

export interface Zone {
	/**
	 * Ignored when you add a zone, will return new id
	 */
	id: number;
	/**
	 * Name of zone. Should be no longer than 100 bytes
	 * Note that spaces will be encoded as 2 bytes
	 */
	name: string;
	/**
	 * Optional ID of Active Week Profile. Default week profile will be used If not specified
	 */
	activeWeekProfileId?: number;
	/**
	 * Degrees Celsius. Expected to be an integer at the range 7 to 30
	 * and at least as large as the Eco temperature
	 */
	comfortTemperature: number;
	/**
	 * Degrees Celsius. Expected to be an integer at the range 7 to 30
	 * and no larger than the Comfort temperature
	 */
	ecoTemperature: number;
	allowOverrides: boolean;
}

export const validate = (zone: Zone) => {
	if (zone.name === '') {
		throw new TypeError('Empty zone name is not allowed');
	}

	if (Buffer.byteLength(escapeSpace(zone.name)) > 100) {
		throw new TypeError(
			'Zone name is too long, maximum 100 bytes allowed (note that spaces are encoded as 2 bytes)'
		);
	}

	if (zone.activeWeekProfileId && zone.activeWeekProfileId < 1) {
		throw new TypeError('Invalid zone active week profile id');
	}

	if (zone.comfortTemperature < 7 || zone.comfortTemperature > 30) {
		throw new TypeError(
			'Invalid comfort temperature, should be between 7 and 30 celsius'
		);
	}

	if (zone.ecoTemperature < 7 || zone.ecoTemperature > 30) {
		throw new TypeError(
			'Invalid eco temperature, should be between 7 and 30 celsius'
		);
	}

	if (zone.ecoTemperature > zone.comfortTemperature) {
		throw new TypeError(
			'Invalid temperature, eco temperature should be less than comfort temperature'
		);
	}
};

// <Zone id> <Name> <Active week profile id> <Comfort temperature> <Eco temperature> <Allow overrides> <Active override id>
const ZoneRegexp = /^(?<id>\d+)\s(?<name>.*?)\s(?<week>\d+)\s(?<comfort>\d+)\s(?<eco>\d+)\s(?<overrides>[10])\s-1$/;

export const deserialize = (input: string): Zone => {
	const matches = input.match(ZoneRegexp);
	if (matches === null) {
		throw new SyntaxError('Invalid zone info structure');
	}

	const groups = matches.groups as {
		id: string;
		name: string;
		week: string;
		comfort: string;
		eco: string;
		overrides: string;
	};

	return {
		id: Number(groups.id),
		name: unescapeSpace(groups.name),
		activeWeekProfileId: Number(groups.week),
		comfortTemperature: Number(groups.comfort),
		ecoTemperature: Number(groups.eco),
		allowOverrides: Boolean(Number(groups.overrides)),
	};
};

export const serialize = (zone: Zone) =>
	[
		zone.id,
		escapeSpace(zone.name),
		// 1 is readonly default week profile id
		zone.activeWeekProfileId !== undefined ? zone.activeWeekProfileId : 1,
		zone.comfortTemperature,
		zone.ecoTemperature,
		zone.allowOverrides ? 1 : 0,
		/** active override id, reserved, not used */ -1,
	].join(' ');
