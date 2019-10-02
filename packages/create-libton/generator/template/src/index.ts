// read more about doc comment syntax in https://api-extractor.com/pages/tsdoc/doc_comment_syntax/

/**
 * <%= description %>
 *
 * @remarks
 * provide {@link <%= umdName %>} function that returns `<%= filename %>` string
 *
 * @packageDocumentation
 */

export { <%= umdName %> } from './<%= filename %>';
