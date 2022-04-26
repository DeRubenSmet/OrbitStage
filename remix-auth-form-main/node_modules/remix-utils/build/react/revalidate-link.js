"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevalidateLink = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@remix-run/react");
/**
 * Renders a link that will revalidate the current route.
 *
 * This works by rendering a Link to `.`, which will tell Remix to reload all
 * the loaders of the current routes and replace the position on the history
 * stack. The later is important to let users click Back and go to the previous
 * page instead of the same page with old data.
 *
 * This component is useful if you want to let users refresh manuall the data.
 *
 * @param props The props of the link, without the `to` prop.
 */
function RevalidateLink(props) {
    return jsx_runtime_1.jsx(react_1.Link, Object.assign({ to: "." }, props), void 0);
}
exports.RevalidateLink = RevalidateLink;
