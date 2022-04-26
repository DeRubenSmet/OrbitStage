import {
  Outlet,
  React,
  init_react,
  useLoaderData
} from "/build/_shared/chunk-V7STPFD3.js";

// browser-route-module:/Users/pascalvanhecke/codetaal/orbit/research/remix-react-map-gl/app/routes/$type.tsx?browser
init_react();

// app/routes/$type.tsx
init_react();
function Posts() {
  const { posts } = useLoaderData();
  console.log(posts);
  return /* @__PURE__ */ React.createElement("main", null, /* @__PURE__ */ React.createElement("h1", null, "Posts"), /* @__PURE__ */ React.createElement(Outlet, null));
}
export {
  Posts as default
};
//# sourceMappingURL=/build/routes/$type-R3QUK5CK.js.map
