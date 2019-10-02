/**
 * @public
 */
export interface Options {}

/**
 *
 * return `<%= filename %>` string
 *
 * @returns the `<%= filename %>`  string
 *
 * @example
 * Here's an example:
 *
 * ```ts
 * import { <%= umdName %> } from '<%= name %>'
 *
 * console.log(<%= umdName %>());
 * // Prints "<%= filename %>":
 * ```
 */
export function <%= umdName %>(options?: Options) {
  return '<%= filename %>';
}
