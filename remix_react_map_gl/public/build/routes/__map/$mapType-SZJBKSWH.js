import {
  React,
  __toESM,
  init_react,
  require_react,
  useLoaderData
} from "/build/_shared/chunk-NXDPIAF3.js";

// browser-route-module:C:\Users\Ruben\OneDrive\Bureaublad\OrbitStage2022\OrbitStage\remix_react_map_gl\app\routes\__map\$mapType.tsx?browser
init_react();

// app/routes/__map/$mapType.tsx
init_react();

// app/styles/mapType.css
var mapType_default = "/build/_assets/mapType-ZRZJ5I73.css";

// app/routes/__map/$mapType.tsx
var import_react = __toESM(require_react());
function links() {
  return [
    { rel: "stylesheet", href: mapType_default },
    {
      rel: "stylesheet",
      href: "https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css"
    }
  ];
}
function Test() {
  const { geojson, zoom } = useLoaderData();
  const mapRef = (0, import_react.useRef)(null);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, console.log(geojson));
}
export {
  Test as default,
  links
};
//# sourceMappingURL=/build/routes/__map/$mapType-SZJBKSWH.js.map
