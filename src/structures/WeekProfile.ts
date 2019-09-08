import { escapeSpace, unescapeSpace } from '../utils';

export enum Status {
	Eco = 0,
	Comfort = 1,
	Away = 2,
	Off = 3
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
};

// <Week profile id> <Name> <Profile>

export const deserialize = (input: string): WeekProfile => {
	const matches = input.match(
		/^(?<id>\d+)\s(?<name>.*?)\s(?<profile>(?:\d{5},?)+)$/
	);

	if (!matches) {
		throw new TypeError('Invalid week profile structure');
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
			.map(value => [
				Number(value.substr(0, 2)),
				Number(value.substr(2, 2)),
				Number(value.substr(4, 1))
			])
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
					...[hours, minutes].map(value => String(value).padStart(2, '0')),
					status
				].join('')
			)
			.join(',')
	].join(' ');
