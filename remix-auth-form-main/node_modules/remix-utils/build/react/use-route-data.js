"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRouteData = void 0;
const react_1 = require("@remix-run/react");
function useRouteData(route) {
    var _a;
    return (_a = react_1.useMatches().find((match) => { var _a; return ((_a = match.handle) === null || _a === void 0 ? void 0 : _a.id) === route || match.pathname === route; })) === null || _a === void 0 ? void 0 : _a.data;
}
exports.useRouteData = useRouteData;
