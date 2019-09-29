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
 * @returns `<%= filename %>`
 *
 * @example
 * Here's an example:
 *
 * ```ts
 * // Prints "<%= filename %>":
 * console.log(<%= umdName %>());
 * ```
 */
const <%= umdName %> = () => '<%= filename %>';

export default <%= umdName %>;
