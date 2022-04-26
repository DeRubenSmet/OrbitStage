"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRevalidate = void 0;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
/**
 * Trigger a revalidation of the current routes loaders.
 *
 * This work by navigating to the current page, this make Remix run the loaders
 * of the current page again.
 *
 * The hook sets `replace: true` to the navigation options in order to avoid
 * adding new history entries, this will avoid a case when the user clicks on
 * the back button and it remains on the same page instead of going to the real
 * previous page.
 * @example
 * let revalidate = useRevalidate();
 * return <button type="button" onClick={() => revalidate}>Reload</button>;
 */
function useRevalidate() {
    let navigate = react_router_dom_1.useNavigate();
    return react_1.useCallback(() => {
        navigate(".", { replace: true });
    }, [navigate]);
}
exports.useRevalidate = useRevalidate;
