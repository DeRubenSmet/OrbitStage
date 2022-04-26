"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalScripts = void 0;
const react_1 = require("react");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_2 = require("@remix-run/react");
function ExternalScripts() {
    let matches = react_2.useMatches();
    let scripts = matches.flatMap((match) => {
        var _a;
        let scripts = (_a = match.handle) === null || _a === void 0 ? void 0 : _a.scripts;
        if (typeof scripts === "function")
            return scripts();
        return [];
    });
    return (jsx_runtime_1.jsxs(jsx_runtime_1.Fragment, { children: [scripts.map((props) => {
                let rel = props.noModule ? "modulepreload" : "preload";
                let as = !props.noModule ? "script" : undefined;
                return (jsx_runtime_1.jsx("link", { rel: rel, href: props.src, as: as, crossOrigin: props.crossOrigin, integrity: props.integrity, referrerPolicy: props.referrerPolicy }, props.src));
            }),
            scripts.map((props) => {
                return react_1.createElement("script", Object.assign({}, props, { key: props.src }));
            })] }, void 0));
}
exports.ExternalScripts = ExternalScripts;
