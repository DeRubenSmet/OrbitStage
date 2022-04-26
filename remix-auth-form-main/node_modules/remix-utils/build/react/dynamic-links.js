"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicLinks = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@remix-run/react");
function DynamicLinks() {
    let links = react_2.useMatches().flatMap((match) => {
        var _a;
        let fn = (_a = match.handle) === null || _a === void 0 ? void 0 : _a.dynamicLinks;
        if (typeof fn !== "function")
            return [];
        return fn({ data: match.data });
    });
    return (jsx_runtime_1.jsx(jsx_runtime_1.Fragment, { children: links.map((link) => (react_1.createElement("link", Object.assign({}, link, { key: link.integrity || JSON.stringify(link) })))) }, void 0));
}
exports.DynamicLinks = DynamicLinks;
