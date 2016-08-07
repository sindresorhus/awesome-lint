/**
 * getUrlFromItem - extracts the url from a link in a Markdown list item `- [name](url)`
 *
 * @param  {Node}             node A Unist node (https://github.com/wooorm/unist#node)
 * @return {String|undefined} the url or false if the item is not a link
 */
function getUrlFromItem(node) {
	try {
		const link = node.children[0].children[0];
		if (link.type === 'link') {
			return link.url;
		}
	} catch (err) {
		// link not found
	}
}

exports.getUrlFromItem = getUrlFromItem;
