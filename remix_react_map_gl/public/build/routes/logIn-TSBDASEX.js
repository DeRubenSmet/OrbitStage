import {
  Form
} from "/build/_shared/chunk-GYRAGDYE.js";
import {
  React,
  __commonJS,
  __toESM,
  init_react
} from "/build/_shared/chunk-P2FTGPOX.js";

// empty-module:~/services/auth.server
var require_auth = __commonJS({
  "empty-module:~/services/auth.server"(exports, module) {
    init_react();
    module.exports = {};
  }
});

// browser-route-module:C:\Users\Ruben\OneDrive\Bureaublad\OrbitStage2022\OrbitStage\remix_react_map_gl\app\routes\logIn.tsx?browser
init_react();

// app/routes/logIn.tsx
init_react();
var import_auth = __toESM(require_auth());
function Test() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Form, {
    id: "form",
    method: "post"
  }, /* @__PURE__ */ React.createElement("label", null, "Name:", /* @__PURE__ */ React.createElement("span", {
    style: { "marginRight": 30 }
  }), /* @__PURE__ */ React.createElement("input", {
    type: "text",
    name: "name"
  })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("label", {
    className: "password"
  }, "Password:", /* @__PURE__ */ React.createElement("span", {
    style: { "marginRight": 7 }
  }), /* @__PURE__ */ React.createElement("input", {
    type: "text",
    name: "password"
  })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("input", {
    type: "submit",
    value: "Submit"
  })));
}
export {
  Test as default
};
//# sourceMappingURL=/build/routes/logIn-TSBDASEX.js.map
