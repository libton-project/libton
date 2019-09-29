// read more about doc comment syntax in https://api-extractor.com/pages/tsdoc/doc_comment_syntax/

/**
 * <%= description %>
 *
 * @remarks
 * provide {@link <%= umdName %>} function that returns `<%= filename %>` string
 *
 * @packageDocumentation
 */

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
export function <%= umdName %>() {
  return '<%= filename %>';
}
