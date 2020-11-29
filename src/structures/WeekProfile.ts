import { escapeSpace, unescapeSpace } from '../utils';

export enum Status {
	Eco = 0,
	Comfort = 1,
	Away = 2,
	Off = 3,
}

export interface WeekProfile {
	/**
	 * Ignored when you add a week profile, will return new id
	 */
	id: number;
	/**
	 * Name of week profile. Should be no longer than 150 bytes
	 * Note that spaces will be encoded as 2 bytes
	 */
	name: string;
	/**
	 * List of timestamps (hours + minutes) and status it has in the following time
	 * Maximum 672 is allowed, minutes should be dividable by 15
	 */
	program: Array<[number, number, Status]>;
}

export const validate = (profile: WeekProfile) => {
	if (profile.name === '') {
		throw new TypeError('Empty profile name is not allowed');
	}

	if (Buffer.byteLength(escapeSpace(profile.name)) > 150) {
		throw new TypeError(
			'Profile name is too long, maximum 150 bytes allowed (note that spaces are encoded as 2 bytes)'
		);
	}

	if (profile.program.length === 0) {
		throw new TypeError('Empty week profile is not allowed');
	}

	if (profile.program.length > 672) {
		throw new TypeError(
			'Week profile program is too big, maximum allowed length is 672'
		);
	}

	profile.program.forEach(([hours, minutes]) => {
		if (hours < 0 || hours > 23) {
			throw new TypeError('Invalid hours value for program');
		}

		if (minutes < 0 || minutes > 59) {
			throw new TypeError('Invalid minutes value for program');
		}

		if (minutes % 15 !== 0) {
			throw new TypeError(
				'Invalid minutes value for program, it should be dividable by 15'
			);
		}
	});
};

// <Week profile id> <Name> <Profile>
const WeekProfileRegexp = /^(?<id>\d+)\s(?<name>.*?)\s(?<profile>(?:\d{5},?)+)$/;

export const deserialize = (input: string): WeekProfile => {
	const matches = input.match(WeekProfileRegexp);
	if (matches === null) {
		throw new SyntaxError('Invalid week profile info structure');
	}

	const groups = matches.groups as {
		id: string;
		name: string;
		profile: string;
	};

	return {
		id: Number(groups.id),
		name: unescapeSpace(groups.name),
		program: groups.profile
			.split(',')
			.map((value) => [
				Number(value.substr(0, 2)),
				Number(value.substr(2, 2)),
				Number(value.substr(4, 1)),
			]),
	};
};

// @todo maybe try to optimize list?
export const serialize = (profile: WeekProfile) =>
	[
		profile.id,
		escapeSpace(profile.name),
		profile.program
			.map(([hours, minutes, status]) =>
				[
					...[hours, minutes].map((value) => String(value).padStart(2, '0')),
					status,
				].join('')
			)
			.join(','),
	].join(' ');
