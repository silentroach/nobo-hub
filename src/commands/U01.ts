import { Component, serialize } from '../structures/Component';

import { command } from '../command';

/**
 * Updates a component in the hub internal database
 *
 * structure:
 * U01 <Component>
 *
 * example:
 * U01 200154035201 0 component_name 0 -1 23 2
 *
 * returns:
 * V01
 */
export const U01 = (component: Component) =>
	command('U01', serialize(component));
