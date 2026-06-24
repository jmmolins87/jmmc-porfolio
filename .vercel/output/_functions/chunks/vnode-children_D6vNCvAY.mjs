import { Fragment, createElement } from "react";
import { DOCUMENT_NODE, ELEMENT_NODE, TEXT_NODE, parse } from "ultrahtml";
//#region node_modules/.pnpm/@astrojs+react@6.0.0_@types+node@24.13.2_@types+react-dom@19.2.3_@types+react@19.2.17___d0b9a68c93cd503e078bec0302593a6b/node_modules/@astrojs/react/dist/vnode-children.js
var ids = 0;
function convert(children) {
	let doc = parse(children.toString().trim());
	let id = ids++;
	let key = 0;
	function createReactElementFromNode(node) {
		const childVnodes = Array.isArray(node.children) && node.children.length ? node.children.map((child) => createReactElementFromNode(child)).filter(Boolean) : void 0;
		if (node.type === DOCUMENT_NODE) return createElement(Fragment, {}, childVnodes);
		else if (node.type === ELEMENT_NODE) {
			const { class: className, ...props } = node.attributes;
			return createElement(node.name, {
				...props,
				className,
				key: `${id}-${key++}`
			}, childVnodes);
		} else if (node.type === TEXT_NODE) return node.value.trim() ? node.value : void 0;
	}
	return createReactElementFromNode(doc).props.children;
}
//#endregion
export { convert as default };
