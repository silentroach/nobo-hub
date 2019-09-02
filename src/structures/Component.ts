import { escapeSpace, unescapeSpace } from '../utils';

export interface Component {
	/**
	 * Serial number format is 'aaabbbcccddd'. Each group in the serial number (aaa, bbb, etc)
	 * is an 8 bit integer no higher than 255
	 */
	serialNumber: string;
	/**
	 * Name of component. Should be no longer than 100 bytes
	 * Note that spaces will be encoded as 2 bytes
	 */
	name: string;
	/**
	 * @todo for what components?
	 * Only applicable for some components
	 */
	reverse?: boolean;
	/**
	 * Id of the Zone the component is connected to if any
	 */
	zoneId?: number;
	/**
	 * Id of the Zone the component is used as a temperature sensor for if any
	 */
	sensorForZoneId?: number; // @todo maybe rename this shit
}

export const validate = (component: Component) => {
	const serialNumberParts = component.serialNumber.match(/\d{3}/g);
	if (
		!serialNumberParts ||
		serialNumberParts.length !== 4 ||
		serialNumberParts.map(Number).some(part => part > 255 || part < 0)
	) {
		throw new TypeError(
			'Invalid component serial number, must be 4 groups of integer no higher than 255'
		);
	}

	if (component.name === '') {
		throw new TypeError('Empty component name is not allowed');
	}

	if (Buffer.byteLength(escapeSpace(component.name)) > 100) {
		throw new TypeError(
			'Component name is too long, maximum 100 bytes allowed (note that spaces are encoded as 2 bytes)'
		);
	}
};

// <Serial number> <Status> <Name> <Reverse on/off?> <ZoneId> <Active override Id> <Temperature sensor for zone>

export const deserialize = (input: string): Component => {
	// @todo reverse
	const matches = input.match(
		/^(?<serial>\d{12})\s0\s(?<name>.*?)\s(?<reverse>0)\s(?<zoneId>-?\d{1,2})\s-1\s(?<sensor>-?\d{1,2})$/
	);

	if (!matches) {
		throw new TypeError('Invalid component structure');
	}

	const groups = matches.groups as {
		serial: string;
		name: string;
		reverse: string;
		zoneId: string;
		sensor: string;
	};

	const component: Component = {
		serialNumber: groups.serial,
		name: unescapeSpace(groups.name)
	};

	const zoneId = Number(groups.zoneId);
	if (zoneId !== -1) {
		component.zoneId = zoneId;
	}

	const sensorForZoneId = Number(groups.sensor);
	if (sensorForZoneId !== -1) {
		component.sensorForZoneId = sensorForZoneId;
	}

	return component;
};

export const serialize = (component: Component) =>
	[
		component.serialNumber,
		/** status, reserved, not used */ 0,
		escapeSpace(component.name),
		/** reverse, @todo */ 0,
		component.zoneId !== undefined ? component.zoneId : -1,
		/** active override id, reserved, not used */ -1,
		component.sensorForZoneId !== undefined ? component.sensorForZoneId : -1
	].join(' ');
