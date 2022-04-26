"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useParentData = exports.Outlet = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@remix-run/react");
/**
 * Wrapper of the React Router Outlet component. This Outlet receives an
 * optional `data` prop and wraps the Remix Outlet in a React Context passing
 * this data as value.
 *
 * ```tsx
 * let data = useLoaderData(); // get data from the current route
 * return <Outlet data={data} /> // pass data to the Outlet
 * ```
 *
 * @deprecated Use the Outlet component from Remix.
 */
function Outlet({ data }) {
    return jsx_runtime_1.jsx(react_1.Outlet, { context: data }, void 0);
}
exports.Outlet = Outlet;
/**
 * Get the data from the parent data. This needs to be rendered in a route with
 * a parent router rendering the Outlet component of Remix Utils.
 * ```tsx
 * let loaderData = useLoaderData(); // get data from the loader
 * let parentData = useParentData(); // get data from the parent
 * ```
 * @deprecated Use the useOutletContext Hook from Remix.
 */
function useParentData() {
    let parentData = react_1.useOutletContext();
    if (!parentData)
        throw new Error("Missing parent data.");
    return parentData;
}
exports.useParentData = useParentData;
