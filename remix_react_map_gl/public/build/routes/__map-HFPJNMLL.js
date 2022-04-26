import {
  Link,
  Outlet
} from "/build/_shared/chunk-N77JAJXP.js";
import {
  React,
  init_react
} from "/build/_shared/chunk-P2FTGPOX.js";

// browser-route-module:C:\Users\Ruben\OneDrive\Bureaublad\OrbitStage2022\OrbitStage\remix_react_map_gl\app\routes\__map.tsx?browser
init_react();

// app/routes/__map.tsx
init_react();
function Index() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: { fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }
  }, /* @__PURE__ */ React.createElement("h1", null, "Welcome to Remix"), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(Link, {
    to: "/provinces"
  }, "Provincies")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(Link, {
    to: "/districts"
  }, "Districts")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(Link, {
    to: "/municipalities"
  }, "Municipalities")))), /* @__PURE__ */ React.createElement("div", {
    id: "map"
  }, /* @__PURE__ */ React.createElement(Outlet, null)));
}
export {
  Index as default
};
//# sourceMappingURL=/build/routes/__map-HFPJNMLL.js.map
