import {
  require_react_dom
} from "/build/_shared/chunk-KROZOGSQ.js";
import {
  useLoaderData
} from "/build/_shared/chunk-MRJ35FI6.js";
import {
  React,
  __toESM,
  init_react,
  require_react
} from "/build/_shared/chunk-P2FTGPOX.js";

// browser-route-module:/Users/pascalvanhecke/codetaal/orbit/research/remix-react-map-gl/app/routes/__map/$mapType.tsx?browser
init_react();

// app/routes/__map/$mapType.tsx
init_react();

// node_modules/react-map-gl/dist/esm/index.js
init_react();

// node_modules/react-map-gl/dist/esm/components/map.js
init_react();
var React3 = __toESM(require_react());
var import_react3 = __toESM(require_react());

// node_modules/react-map-gl/dist/esm/components/use-map.js
init_react();
var React2 = __toESM(require_react());
var import_react = __toESM(require_react());
var MountedMapsContext = React2.createContext(null);

// node_modules/react-map-gl/dist/esm/mapbox/mapbox.js
init_react();

// node_modules/react-map-gl/dist/esm/utils/transform.js
init_react();
function transformToViewState(tr) {
  return {
    longitude: tr.center.lng,
    latitude: tr.center.lat,
    zoom: tr.zoom,
    pitch: tr.pitch,
    bearing: tr.bearing,
    padding: tr.padding
  };
}
function applyViewStateToTransform(tr, props) {
  const v = props.viewState || props;
  let changed = false;
  if ("longitude" in v && "latitude" in v) {
    const center = tr.center;
    tr.center = new center.constructor(v.longitude, v.latitude);
    changed = changed || center !== tr.center;
  }
  if ("zoom" in v) {
    const zoom = tr.zoom;
    tr.zoom = v.zoom;
    changed = changed || zoom !== tr.zoom;
  }
  if ("bearing" in v) {
    const bearing = tr.bearing;
    tr.bearing = v.bearing;
    changed = changed || bearing !== tr.bearing;
  }
  if ("pitch" in v) {
    const pitch = tr.pitch;
    tr.pitch = v.pitch;
    changed = changed || pitch !== tr.pitch;
  }
  if (v.padding && !tr.isPaddingEqual(v.padding)) {
    changed = true;
    tr.padding = v.padding;
  }
  return changed;
}

// node_modules/react-map-gl/dist/esm/utils/style-utils.js
init_react();
var refProps = ["type", "source", "source-layer", "minzoom", "maxzoom", "filter", "layout"];
function normalizeStyle(style) {
  if (!style) {
    return null;
  }
  if (typeof style === "string") {
    return style;
  }
  if ("toJS" in style) {
    style = style.toJS();
  }
  if (!style.layers) {
    return style;
  }
  const layerIndex = {};
  for (const layer of style.layers) {
    layerIndex[layer.id] = layer;
  }
  const layers = style.layers.map((layer) => {
    const layerRef = layerIndex[layer.ref];
    let normalizedLayer = null;
    if ("interactive" in layer) {
      normalizedLayer = { ...layer };
      delete normalizedLayer.interactive;
    }
    if (layerRef) {
      normalizedLayer = normalizedLayer || { ...layer };
      delete normalizedLayer.ref;
      for (const propName of refProps) {
        if (propName in layerRef) {
          normalizedLayer[propName] = layerRef[propName];
        }
      }
    }
    return normalizedLayer || layer;
  });
  return { ...style, layers };
}

// node_modules/react-map-gl/dist/esm/utils/deep-equal.js
init_react();
function arePointsEqual(a, b) {
  const ax = Array.isArray(a) ? a[0] : a ? a.x : 0;
  const ay = Array.isArray(a) ? a[1] : a ? a.y : 0;
  const bx = Array.isArray(b) ? b[0] : b ? b.x : 0;
  const by = Array.isArray(b) ? b[1] : b ? b.y : 0;
  return ax === bx && ay === by;
}
function deepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  } else if (Array.isArray(b)) {
    return false;
  }
  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
      return false;
    }
    for (const key of aKeys) {
      if (!b.hasOwnProperty(key)) {
        return false;
      }
      if (!deepEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return false;
}

// node_modules/react-map-gl/dist/esm/mapbox/mapbox.js
var pointerEvents = {
  mousedown: "onMouseDown",
  mouseup: "onMouseUp",
  mouseover: "onMouseOver",
  mousemove: "onMouseMove",
  click: "onClick",
  dblclick: "onDblClick",
  mouseenter: "onMouseEnter",
  mouseleave: "onMouseLeave",
  mouseout: "onMouseOut",
  contextmenu: "onContextMenu",
  touchstart: "onTouchStart",
  touchend: "onTouchEnd",
  touchmove: "onTouchMove",
  touchcancel: "onTouchCancel"
};
var cameraEvents = {
  movestart: "onMoveStart",
  move: "onMove",
  moveend: "onMoveEnd",
  dragstart: "onDragStart",
  drag: "onDrag",
  dragend: "onDragEnd",
  zoomstart: "onZoomStart",
  zoom: "onZoom",
  zoomend: "onZoomEnd",
  rotatestart: "onRotateStart",
  rotate: "onRotate",
  rotateend: "onRotateEnd",
  pitchstart: "onPitchStart",
  pitch: "onPitch",
  pitchend: "onPitchEnd"
};
var otherEvents = {
  wheel: "onWheel",
  boxzoomstart: "onBoxZoomStart",
  boxzoomend: "onBoxZoomEnd",
  boxzoomcancel: "onBoxZoomCancel",
  resize: "onResize",
  load: "onLoad",
  render: "onRender",
  idle: "onIdle",
  remove: "onRemove",
  data: "onData",
  styledata: "onStyleData",
  sourcedata: "onSourceData",
  error: "onError"
};
var settingNames = [
  "minZoom",
  "maxZoom",
  "minPitch",
  "maxPitch",
  "maxBounds",
  "projection",
  "renderWorldCopies"
];
var handlerNames = [
  "scrollZoom",
  "boxZoom",
  "dragRotate",
  "dragPan",
  "keyboard",
  "doubleClickZoom",
  "touchZoomRotate",
  "touchPitch"
];
var Mapbox = class {
  constructor(MapClass, props, container) {
    this._map = null;
    this._internalUpdate = false;
    this._inRender = false;
    this._hoveredFeatures = null;
    this._deferredEvents = {
      move: false,
      zoom: false,
      pitch: false,
      rotate: false
    };
    this._onEvent = (e) => {
      const cb = this.props[otherEvents[e.type]];
      if (cb) {
        cb(e);
      }
    };
    this._onPointerEvent = (e) => {
      if (e.type === "mousemove" || e.type === "mouseout") {
        this._updateHover(e);
      }
      const cb = this.props[pointerEvents[e.type]];
      if (cb) {
        if (this.props.interactiveLayerIds && e.type !== "mouseover" && e.type !== "mouseout") {
          const features = this._hoveredFeatures || this._map.queryRenderedFeatures(e.point, {
            layers: this.props.interactiveLayerIds
          });
          if (!features.length) {
            return;
          }
          e.features = features;
        }
        cb(e);
        delete e.features;
      }
    };
    this._onCameraEvent = (e) => {
      if (!this._internalUpdate) {
        const cb = this.props[cameraEvents[e.type]];
        if (cb) {
          cb(e);
        }
      }
      if (e.type in this._deferredEvents) {
        this._deferredEvents[e.type] = false;
      }
    };
    this._MapClass = MapClass;
    this.props = props;
    this._initialize(container);
  }
  get map() {
    return this._map;
  }
  get transform() {
    return this._renderTransform;
  }
  setProps(props) {
    const oldProps = this.props;
    this.props = props;
    const settingsChanged = this._updateSettings(props, oldProps);
    if (settingsChanged) {
      this._renderTransform = this._map.transform.clone();
    }
    const sizeChanged = this._updateSize(props);
    const viewStateChanged = this._updateViewState(props, true);
    this._updateStyle(props, oldProps);
    this._updateStyleComponents(props, oldProps);
    this._updateHandlers(props, oldProps);
    if (settingsChanged || sizeChanged || viewStateChanged && !this._map.isMoving()) {
      this.redraw();
    }
  }
  static reuse(props, container) {
    const that = Mapbox.savedMaps.pop();
    if (!that) {
      return null;
    }
    const map = that.map;
    const oldContainer = map.getContainer();
    container.className = oldContainer.className;
    while (oldContainer.childNodes.length > 0) {
      container.appendChild(oldContainer.childNodes[0]);
    }
    map._container = container;
    if (props.initialViewState) {
      that._updateViewState(props.initialViewState, false);
    }
    map.resize();
    that.setProps({ ...props, styleDiffing: false });
    if (map.isStyleLoaded()) {
      map.fire("load");
    } else {
      map.once("styledata", () => map.fire("load"));
    }
    return that;
  }
  _initialize(container) {
    const { props } = this;
    const mapOptions = {
      ...props,
      ...props.initialViewState,
      accessToken: props.mapboxAccessToken || getAccessTokenFromEnv() || null,
      container,
      style: normalizeStyle(props.mapStyle)
    };
    const viewState = mapOptions.initialViewState || mapOptions.viewState || mapOptions;
    Object.assign(mapOptions, {
      center: [viewState.longitude || 0, viewState.latitude || 0],
      zoom: viewState.zoom || 0,
      pitch: viewState.pitch || 0,
      bearing: viewState.bearing || 0
    });
    if (props.gl) {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = () => {
        HTMLCanvasElement.prototype.getContext = getContext;
        return props.gl;
      };
    }
    const map = new this._MapClass(mapOptions);
    if (viewState.padding) {
      map.setPadding(viewState.padding);
    }
    if (props.cursor) {
      map.getCanvas().style.cursor = props.cursor;
    }
    this._renderTransform = map.transform.clone();
    const renderMap = map._render;
    map._render = (arg) => {
      this._inRender = true;
      renderMap.call(map, arg);
      this._inRender = false;
    };
    const runRenderTaskQueue = map._renderTaskQueue.run;
    map._renderTaskQueue.run = (arg) => {
      runRenderTaskQueue.call(map._renderTaskQueue, arg);
      this._onBeforeRepaint();
    };
    map.on("render", () => this._onAfterRepaint());
    const fireEvent = map.fire;
    map.fire = this._fireEvent.bind(this, fireEvent);
    map.on("resize", () => {
      this._renderTransform.resize(map.transform.width, map.transform.height);
    });
    map.on("styledata", () => this._updateStyleComponents(this.props, {}));
    map.on("sourcedata", () => this._updateStyleComponents(this.props, {}));
    for (const eventName in pointerEvents) {
      map.on(eventName, this._onPointerEvent);
    }
    for (const eventName in cameraEvents) {
      map.on(eventName, this._onCameraEvent);
    }
    for (const eventName in otherEvents) {
      map.on(eventName, this._onEvent);
    }
    this._map = map;
  }
  recycle() {
    Mapbox.savedMaps.push(this);
  }
  destroy() {
    this._map.remove();
  }
  redraw() {
    const map = this._map;
    if (!this._inRender && map.style) {
      if (map._frame) {
        map._frame.cancel();
        map._frame = null;
      }
      map._render();
    }
  }
  _updateSize(nextProps) {
    const { viewState } = nextProps;
    if (viewState) {
      const map = this._map;
      if (viewState.width !== map.transform.width || viewState.height !== map.transform.height) {
        map.resize();
        return true;
      }
    }
    return false;
  }
  _updateViewState(nextProps, triggerEvents) {
    if (this._internalUpdate) {
      return false;
    }
    const map = this._map;
    const tr = this._renderTransform;
    const { zoom, pitch, bearing } = tr;
    const changed = applyViewStateToTransform(tr, {
      ...transformToViewState(map.transform),
      ...nextProps
    });
    if (changed && triggerEvents) {
      const deferredEvents = this._deferredEvents;
      deferredEvents.move = true;
      deferredEvents.zoom || (deferredEvents.zoom = zoom !== tr.zoom);
      deferredEvents.rotate || (deferredEvents.rotate = bearing !== tr.bearing);
      deferredEvents.pitch || (deferredEvents.pitch = pitch !== tr.pitch);
    }
    if (!map.isMoving()) {
      applyViewStateToTransform(map.transform, nextProps);
    }
    return changed;
  }
  _updateSettings(nextProps, currProps) {
    const map = this._map;
    let changed = false;
    for (const propName of settingNames) {
      if (propName in nextProps && !deepEqual(nextProps[propName], currProps[propName])) {
        changed = true;
        map[`set${propName[0].toUpperCase()}${propName.slice(1)}`](nextProps[propName]);
      }
    }
    return changed;
  }
  _updateStyle(nextProps, currProps) {
    if (nextProps.cursor !== currProps.cursor) {
      this._map.getCanvas().style.cursor = nextProps.cursor;
    }
    if (nextProps.mapStyle !== currProps.mapStyle) {
      const options = {
        diff: nextProps.styleDiffing
      };
      if ("localIdeographFontFamily" in nextProps) {
        options.localIdeographFontFamily = nextProps.localIdeographFontFamily;
      }
      this._map.setStyle(normalizeStyle(nextProps.mapStyle), options);
      return true;
    }
    return false;
  }
  _updateStyleComponents(nextProps, currProps) {
    const map = this._map;
    let changed = false;
    if (map.style.loaded()) {
      if ("light" in nextProps && !deepEqual(nextProps.light, currProps.light)) {
        changed = true;
        map.setLight(nextProps.light);
      }
      if ("fog" in nextProps && !deepEqual(nextProps.fog, currProps.fog)) {
        changed = true;
        map.setFog(nextProps.fog);
      }
      if ("terrain" in nextProps && !deepEqual(nextProps.terrain, currProps.terrain)) {
        if (!nextProps.terrain || map.getSource(nextProps.terrain.source)) {
          changed = true;
          map.setTerrain(nextProps.terrain);
          this._renderTransform.elevation = map.transform.elevation;
        }
      }
    }
    return changed;
  }
  _updateHandlers(nextProps, currProps) {
    const map = this._map;
    let changed = false;
    for (const propName of handlerNames) {
      const newValue = nextProps[propName];
      if (!deepEqual(newValue, currProps[propName])) {
        changed = true;
        if (newValue) {
          map[propName].enable(newValue);
        } else {
          map[propName].disable();
        }
      }
    }
    return changed;
  }
  _updateHover(e) {
    const { props } = this;
    const shouldTrackHoveredFeatures = props.interactiveLayerIds && (props.onMouseMove || props.onMouseEnter || props.onMouseLeave);
    if (shouldTrackHoveredFeatures) {
      const eventType = e.type;
      const wasHovering = this._hoveredFeatures?.length > 0;
      let features;
      if (eventType === "mousemove") {
        try {
          features = this._map.queryRenderedFeatures(e.point, {
            layers: props.interactiveLayerIds
          });
        } catch {
          features = [];
        }
      } else {
        features = [];
      }
      const isHovering = features.length > 0;
      if (!isHovering && wasHovering) {
        e.type = "mouseleave";
        this._onPointerEvent(e);
      }
      this._hoveredFeatures = features;
      if (isHovering && !wasHovering) {
        e.type = "mouseenter";
        this._onPointerEvent(e);
      }
      e.type = eventType;
    } else {
      this._hoveredFeatures = null;
    }
  }
  _fireEvent(baseFire, event, properties) {
    const map = this._map;
    const tr = map.transform;
    const eventType = typeof event === "string" ? event : event.type;
    if (eventType === "move") {
      this._updateViewState(this.props, false);
    }
    if (eventType in cameraEvents) {
      if (typeof event === "object") {
        event.viewState = transformToViewState(tr);
      }
      if (this._map.isMoving()) {
        map.transform = this._renderTransform;
        baseFire.call(map, event, properties);
        map.transform = tr;
        return map;
      }
    }
    baseFire.call(map, event, properties);
    return map;
  }
  _onBeforeRepaint() {
    const map = this._map;
    this._internalUpdate = true;
    for (const eventType in this._deferredEvents) {
      if (this._deferredEvents[eventType]) {
        map.fire(eventType);
      }
    }
    this._internalUpdate = false;
    const tr = this._map.transform;
    this._map.transform = this._renderTransform;
    this._onAfterRepaint = () => {
      this._map.transform = tr;
    };
  }
};
Mapbox.savedMaps = [];
function getAccessTokenFromEnv() {
  let accessToken = null;
  if (typeof location !== "undefined") {
    const match = /access_token=([^&\/]*)/.exec(location.search);
    accessToken = match && match[1];
  }
  try {
    accessToken = accessToken || process.env.MapboxAccessToken;
  } catch {
  }
  try {
    accessToken = accessToken || process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
  } catch {
  }
  return accessToken;
}

// node_modules/react-map-gl/dist/esm/mapbox/create-ref.js
init_react();
var skipMethods = [
  "setMaxBounds",
  "setMinZoom",
  "setMaxZoom",
  "setMinPitch",
  "setMaxPitch",
  "setRenderWorldCopies",
  "setProjection",
  "setStyle",
  "addSource",
  "removeSource",
  "addLayer",
  "removeLayer",
  "setLayerZoomRange",
  "setFilter",
  "setPaintProperty",
  "setLayoutProperty",
  "setLight",
  "setTerrain",
  "setFog",
  "remove"
];
function createRef(mapInstance, mapLib) {
  if (!mapInstance) {
    return null;
  }
  const map = mapInstance.map;
  const result = {
    getMap: () => map,
    getCenter: () => mapInstance.transform.center,
    getZoom: () => mapInstance.transform.zoom,
    getBearing: () => mapInstance.transform.bearing,
    getPitch: () => mapInstance.transform.pitch,
    getPadding: () => mapInstance.transform.padding,
    getBounds: () => mapInstance.transform.getBounds(),
    project: (lnglat) => {
      return mapInstance.transform.locationPoint(mapLib.LngLat.convert(lnglat));
    },
    unproject: (point) => {
      return mapInstance.transform.pointLocation(mapLib.Point.convert(point));
    }
  };
  for (const key of getMethodNames(map)) {
    if (!(key in result) && !skipMethods.includes(key)) {
      result[key] = map[key].bind(map);
    }
  }
  return result;
}
function getMethodNames(obj) {
  const result = /* @__PURE__ */ new Set();
  let proto = obj;
  while (proto) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key[0] !== "_" && typeof obj[key] === "function" && key !== "fire" && key !== "setEventedParent") {
        result.add(key);
      }
    }
    proto = Object.getPrototypeOf(proto);
  }
  return Array.from(result);
}

// node_modules/react-map-gl/dist/esm/utils/use-isomorphic-layout-effect.js
init_react();
var import_react2 = __toESM(require_react());
var useIsomorphicLayoutEffect = typeof document !== "undefined" ? import_react2.useLayoutEffect : import_react2.useEffect;
var use_isomorphic_layout_effect_default = useIsomorphicLayoutEffect;

// node_modules/react-map-gl/dist/esm/utils/set-globals.js
init_react();
var globalSettings = [
  "baseApiUrl",
  "maxParallelImageRequests",
  "workerClass",
  "workerCount",
  "workerUrl"
];
function setGlobals(mapLib, props) {
  for (const key of globalSettings) {
    if (key in props) {
      mapLib[key] = props[key];
    }
  }
  if (props.RTLTextPlugin && mapLib.getRTLTextPluginStatus && mapLib.getRTLTextPluginStatus() === "unavailable") {
    mapLib.setRTLTextPlugin(props.RTLTextPlugin, (error) => {
      if (error) {
        console.error(error);
      }
    }, false);
  }
}

// node_modules/react-map-gl/dist/esm/components/map.js
var MapContext = React3.createContext(null);
var defaultProps = {
  minZoom: 0,
  maxZoom: 22,
  minPitch: 0,
  maxPitch: 60,
  scrollZoom: true,
  boxZoom: true,
  dragRotate: true,
  dragPan: true,
  keyboard: true,
  doubleClickZoom: true,
  touchZoomRotate: true,
  touchPitch: true,
  mapStyle: { version: 8, sources: {}, layers: [] },
  styleDiffing: true,
  projection: "mercator",
  renderWorldCopies: true,
  onError: (e) => console.error(e.error),
  RTLTextPlugin: "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js"
};
var Map = (0, import_react3.forwardRef)((props, ref) => {
  const mountedMapsContext = (0, import_react3.useContext)(MountedMapsContext);
  const [mapInstance, setMapInstance] = (0, import_react3.useState)(null);
  const containerRef = (0, import_react3.useRef)();
  const { current: contextValue } = (0, import_react3.useRef)({ mapLib: null, map: null });
  (0, import_react3.useEffect)(() => {
    const mapLib = props.mapLib;
    let isMounted = true;
    let mapbox;
    Promise.resolve(mapLib || import("/build/_shared/mapbox-gl-PN7PNKD7.js")).then((mapboxgl) => {
      if (!isMounted) {
        return;
      }
      if (!mapboxgl.Map) {
        mapboxgl = mapboxgl.default;
      }
      if (!mapboxgl || !mapboxgl.Map) {
        throw new Error("Invalid mapLib");
      }
      if (mapboxgl.supported(props)) {
        setGlobals(mapboxgl, props);
        if (props.reuseMaps) {
          mapbox = Mapbox.reuse(props, containerRef.current);
        }
        if (!mapbox) {
          mapbox = new Mapbox(mapboxgl.Map, props, containerRef.current);
        }
        contextValue.map = createRef(mapbox, mapboxgl);
        contextValue.mapLib = mapboxgl;
        setMapInstance(mapbox);
        mountedMapsContext?.onMapMount(contextValue.map, props.id);
      } else {
        throw new Error("Map is not supported by this browser");
      }
    }).catch((error) => {
      props.onError({
        type: "error",
        target: null,
        originalEvent: null,
        error
      });
    });
    return () => {
      isMounted = false;
      if (mapbox) {
        mountedMapsContext?.onMapUnmount(props.id);
        if (props.reuseMaps) {
          mapbox.recycle();
        } else {
          mapbox.destroy();
        }
      }
    };
  }, []);
  use_isomorphic_layout_effect_default(() => {
    if (mapInstance) {
      mapInstance.setProps(props);
    }
  });
  (0, import_react3.useImperativeHandle)(ref, () => contextValue.map, [mapInstance]);
  const style = (0, import_react3.useMemo)(() => ({
    position: "relative",
    width: "100%",
    height: "100%",
    ...props.style
  }), [props.style]);
  return React3.createElement("div", { id: props.id, ref: containerRef, style }, mapInstance && React3.createElement(MapContext.Provider, { value: contextValue }, props.children));
});
Map.displayName = "Map";
Map.defaultProps = defaultProps;
var map_default = Map;

// node_modules/react-map-gl/dist/esm/components/marker.js
init_react();
var React4 = __toESM(require_react());
var import_react_dom = __toESM(require_react_dom());
var import_react4 = __toESM(require_react());

// node_modules/react-map-gl/dist/esm/utils/apply-react-style.js
init_react();
var unitlessNumber = /box|flex|grid|column|lineHeight|fontWeight|opacity|order|tabSize|zIndex/;
function applyReactStyle(element, styles) {
  if (!element || !styles) {
    return;
  }
  const style = element.style;
  for (const key in styles) {
    const value = styles[key];
    if (Number.isFinite(value) && !unitlessNumber.test(key)) {
      style[key] = `${value}px`;
    } else {
      style[key] = value;
    }
  }
}

// node_modules/react-map-gl/dist/esm/components/marker.js
var defaultProps2 = {
  draggable: false,
  popup: null,
  rotation: 0,
  rotationAlignment: "auto",
  pitchAlignment: "auto"
};
function Marker(props) {
  const { map, mapLib } = (0, import_react4.useContext)(MapContext);
  const thisRef = (0, import_react4.useRef)({ props });
  thisRef.current.props = props;
  const marker = (0, import_react4.useMemo)(() => {
    let hasChildren = false;
    React4.Children.forEach(props.children, (el) => {
      if (el) {
        hasChildren = true;
      }
    });
    const options = {
      ...props,
      element: hasChildren ? document.createElement("div") : null
    };
    const mk = new mapLib.Marker(options).setLngLat([props.longitude, props.latitude]);
    mk.getElement().addEventListener("click", (e) => {
      thisRef.current.props.onClick?.({
        type: "click",
        target: mk,
        originalEvent: e
      });
    });
    mk.on("dragstart", (e) => {
      const evt = e;
      evt.lngLat = marker.getLngLat();
      thisRef.current.props.onDragStart?.(evt);
    });
    mk.on("drag", (e) => {
      const evt = e;
      evt.lngLat = marker.getLngLat();
      thisRef.current.props.onDrag?.(evt);
    });
    mk.on("dragend", (e) => {
      const evt = e;
      evt.lngLat = marker.getLngLat();
      thisRef.current.props.onDragEnd?.(evt);
    });
    return mk;
  }, []);
  (0, import_react4.useEffect)(() => {
    marker.addTo(map.getMap());
    return () => {
      marker.remove();
    };
  }, []);
  (0, import_react4.useEffect)(() => {
    applyReactStyle(marker.getElement(), props.style);
  }, [props.style]);
  if (marker.getLngLat().lng !== props.longitude || marker.getLngLat().lat !== props.latitude) {
    marker.setLngLat([props.longitude, props.latitude]);
  }
  if (props.offset && !arePointsEqual(marker.getOffset(), props.offset)) {
    marker.setOffset(props.offset);
  }
  if (marker.isDraggable() !== props.draggable) {
    marker.setDraggable(props.draggable);
  }
  if (marker.getRotation() !== props.rotation) {
    marker.setRotation(props.rotation);
  }
  if (marker.getRotationAlignment() !== props.rotationAlignment) {
    marker.setRotationAlignment(props.rotationAlignment);
  }
  if (marker.getPitchAlignment() !== props.pitchAlignment) {
    marker.setPitchAlignment(props.pitchAlignment);
  }
  if (marker.getPopup() !== props.popup) {
    marker.setPopup(props.popup);
  }
  return (0, import_react_dom.createPortal)(props.children, marker.getElement());
}
Marker.defaultProps = defaultProps2;
var marker_default = React4.memo(Marker);

// node_modules/react-map-gl/dist/esm/components/popup.js
init_react();
var React5 = __toESM(require_react());
var import_react_dom2 = __toESM(require_react_dom());
var import_react5 = __toESM(require_react());
function getClassList(className) {
  return new Set(className ? className.trim().split(/\s+/) : []);
}
function Popup(props) {
  const { map, mapLib } = (0, import_react5.useContext)(MapContext);
  const container = (0, import_react5.useMemo)(() => {
    return document.createElement("div");
  }, []);
  const thisRef = (0, import_react5.useRef)({ props });
  thisRef.current.props = props;
  const popup = (0, import_react5.useMemo)(() => {
    const options = { ...props };
    const pp = new mapLib.Popup(options).setLngLat([props.longitude, props.latitude]);
    pp.on("open", (e) => {
      thisRef.current.props.onOpen?.(e);
    });
    pp.on("close", (e) => {
      thisRef.current.props.onClose?.(e);
    });
    return pp;
  }, []);
  (0, import_react5.useEffect)(() => {
    popup.setDOMContent(container).addTo(map.getMap());
    return () => {
      if (popup.isOpen()) {
        popup.remove();
      }
    };
  }, []);
  (0, import_react5.useEffect)(() => {
    applyReactStyle(popup.getElement(), props.style);
  }, [props.style]);
  if (popup.isOpen()) {
    if (popup.getLngLat().lng !== props.longitude || popup.getLngLat().lat !== props.latitude) {
      popup.setLngLat([props.longitude, props.latitude]);
    }
    if (props.offset && !deepEqual(popup.options.offset, props.offset)) {
      popup.setOffset(props.offset);
    }
    if (popup.options.anchor !== props.anchor || popup.options.maxWidth !== props.maxWidth) {
      popup.options.anchor = props.anchor;
      popup.setMaxWidth(props.maxWidth);
    }
    if (popup.options.className !== props.className) {
      const prevClassList = getClassList(popup.options.className);
      const nextClassList = getClassList(props.className);
      for (const c of prevClassList) {
        if (!nextClassList.has(c)) {
          popup.removeClassName(c);
        }
      }
      for (const c of nextClassList) {
        if (!prevClassList.has(c)) {
          popup.addClassName(c);
        }
      }
      popup.options.className = props.className;
    }
  }
  return (0, import_react_dom2.createPortal)(props.children, container);
}
var popup_default = React5.memo(Popup);

// node_modules/react-map-gl/dist/esm/components/attribution-control.js
init_react();
var React6 = __toESM(require_react());
var import_react7 = __toESM(require_react());

// node_modules/react-map-gl/dist/esm/components/use-control.js
init_react();
var import_react6 = __toESM(require_react());
function useControl(onCreate, onRemove, opts) {
  const context = (0, import_react6.useContext)(MapContext);
  const ctrl = (0, import_react6.useMemo)(() => onCreate(context), []);
  (0, import_react6.useEffect)(() => {
    const { map } = context;
    if (!map.hasControl(ctrl)) {
      map.addControl(ctrl, (opts || onRemove)?.position);
    }
    return () => {
      if (typeof onRemove === "function") {
        onRemove(context);
      }
      if (map.hasControl(ctrl)) {
        map.removeControl(ctrl);
      }
    };
  }, []);
  return ctrl;
}

// node_modules/react-map-gl/dist/esm/components/attribution-control.js
function AttributionControl(props) {
  const ctrl = useControl(({ mapLib }) => new mapLib.AttributionControl(props), {
    position: props.position
  });
  (0, import_react7.useEffect)(() => {
    applyReactStyle(ctrl._container, props.style);
  }, [props.style]);
  return null;
}
var attribution_control_default = React6.memo(AttributionControl);

// node_modules/react-map-gl/dist/esm/components/fullscreen-control.js
init_react();
var React7 = __toESM(require_react());
var import_react8 = __toESM(require_react());
function FullscreenControl(props) {
  const ctrl = useControl(({ mapLib }) => new mapLib.FullscreenControl({
    container: props.containerId && document.getElementById(props.containerId)
  }), { position: props.position });
  (0, import_react8.useEffect)(() => {
    applyReactStyle(ctrl._controlContainer, props.style);
  }, [props.style]);
  return null;
}
var fullscreen_control_default = React7.memo(FullscreenControl);

// node_modules/react-map-gl/dist/esm/components/geolocate-control.js
init_react();
var React8 = __toESM(require_react());
var import_react9 = __toESM(require_react());
var GeolocateControl = (0, import_react9.forwardRef)((props, ref) => {
  const thisRef = (0, import_react9.useRef)({ props });
  const ctrl = useControl(({ mapLib }) => {
    const gc = new mapLib.GeolocateControl(props);
    gc.on("geolocate", (e) => {
      thisRef.current.props.onGeolocate?.(e);
    });
    gc.on("error", (e) => {
      thisRef.current.props.onError?.(e);
    });
    gc.on("outofmaxbounds", (e) => {
      thisRef.current.props.onOutOfMaxBounds?.(e);
    });
    gc.on("trackuserlocationstart", (e) => {
      thisRef.current.props.onTrackUserLocationStart?.(e);
    });
    gc.on("trackuserlocationend", (e) => {
      thisRef.current.props.onTrackUserLocationEnd?.(e);
    });
    return gc;
  }, { position: props.position });
  thisRef.current.props = props;
  (0, import_react9.useImperativeHandle)(ref, () => ({
    trigger: () => ctrl.trigger()
  }), []);
  (0, import_react9.useEffect)(() => {
    applyReactStyle(ctrl._container, props.style);
  }, [props.style]);
  return null;
});
GeolocateControl.displayName = "GeolocateControl";
var geolocate_control_default = React8.memo(GeolocateControl);

// node_modules/react-map-gl/dist/esm/components/navigation-control.js
init_react();
var React9 = __toESM(require_react());
var import_react10 = __toESM(require_react());
function NavigationControl(props) {
  const ctrl = useControl(({ mapLib }) => new mapLib.NavigationControl(props), {
    position: props.position
  });
  (0, import_react10.useEffect)(() => {
    applyReactStyle(ctrl._container, props.style);
  }, [props.style]);
  return null;
}
var navigation_control_default = React9.memo(NavigationControl);

// node_modules/react-map-gl/dist/esm/components/scale-control.js
init_react();
var React10 = __toESM(require_react());
var import_react11 = __toESM(require_react());
var defaultProps3 = {
  unit: "metric",
  maxWidth: 100
};
function ScaleControl(props) {
  const ctrl = useControl(({ mapLib }) => new mapLib.ScaleControl(props), {
    position: props.position
  });
  if (ctrl.options.unit !== props.unit || ctrl.options.maxWidth !== props.maxWidth) {
    ctrl.options.maxWidth = props.maxWidth;
    ctrl.setUnit(props.unit);
  }
  (0, import_react11.useEffect)(() => {
    applyReactStyle(ctrl._container, props.style);
  }, [props.style]);
  return null;
}
ScaleControl.defaultProps = defaultProps3;
var scale_control_default = React10.memo(ScaleControl);

// node_modules/react-map-gl/dist/esm/components/source.js
init_react();
var React11 = __toESM(require_react());
var import_react12 = __toESM(require_react());
var import_react13 = __toESM(require_react());

// node_modules/react-map-gl/dist/esm/utils/assert.js
init_react();
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// node_modules/react-map-gl/dist/esm/components/source.js
var sourceCounter = 0;
function createSource(map, id, props) {
  if (map.style && map.style._loaded) {
    const options = { ...props };
    delete options.id;
    delete options.children;
    map.addSource(id, options);
    return map.getSource(id);
  }
  return null;
}
function updateSource(source, props, prevProps) {
  assert(props.id === prevProps.id, "source id changed");
  assert(props.type === prevProps.type, "source type changed");
  let changedKey = "";
  let changedKeyCount = 0;
  for (const key in props) {
    if (key !== "children" && key !== "id" && !deepEqual(prevProps[key], props[key])) {
      changedKey = key;
      changedKeyCount++;
    }
  }
  if (!changedKeyCount) {
    return;
  }
  const type = props.type;
  if (type === "geojson") {
    source.setData(props.data);
  } else if (type === "image") {
    source.updateImage({ url: props.url, coordinates: props.coordinates });
  } else if ((type === "canvas" || type === "video") && changedKeyCount === 1 && changedKey === "coordinates") {
    source.setCoordinates(props.coordinates);
  } else if (type === "vector" && "setUrl" in source) {
    switch (changedKey) {
      case "url":
        source.setUrl(props.url);
        break;
      case "tiles":
        source.setTiles(props.tiles);
        break;
      default:
    }
  } else {
    console.warn(`Unable to update <Source> prop: ${changedKey}`);
  }
}
function Source(props) {
  const map = (0, import_react12.useContext)(MapContext).map.getMap();
  const propsRef = (0, import_react12.useRef)(props);
  const [, setStyleLoaded] = (0, import_react12.useState)(0);
  const id = (0, import_react12.useMemo)(() => props.id || `jsx-source-${sourceCounter++}`, []);
  (0, import_react12.useEffect)(() => {
    if (map) {
      const forceUpdate = () => setStyleLoaded((version) => version + 1);
      map.on("styledata", forceUpdate);
      forceUpdate();
      return () => {
        map.off("styledata", forceUpdate);
        setTimeout(() => {
          if (map.style && map.style._loaded && map.getSource(id)) {
            map.removeSource(id);
          }
        }, 0);
      };
    }
    return void 0;
  }, [map]);
  let source = map && map.style && map.getSource(id);
  if (source) {
    updateSource(source, props, propsRef.current);
  } else {
    source = createSource(map, id, props);
  }
  propsRef.current = props;
  return source && React11.Children.map(props.children, (child) => child && (0, import_react13.cloneElement)(child, {
    source: id
  })) || null;
}
var source_default = Source;

// node_modules/react-map-gl/dist/esm/components/layer.js
init_react();
var import_react14 = __toESM(require_react());
function updateLayer(map, id, props, prevProps) {
  assert(props.id === prevProps.id, "layer id changed");
  assert(props.type === prevProps.type, "layer type changed");
  if (props.type === "custom" || prevProps.type === "custom") {
    return;
  }
  const { layout = {}, paint = {}, filter, minzoom, maxzoom, beforeId } = props;
  if (beforeId !== prevProps.beforeId) {
    map.moveLayer(id, beforeId);
  }
  if (layout !== prevProps.layout) {
    const prevLayout = prevProps.layout || {};
    for (const key in layout) {
      if (!deepEqual(layout[key], prevLayout[key])) {
        map.setLayoutProperty(id, key, layout[key]);
      }
    }
    for (const key in prevLayout) {
      if (!layout.hasOwnProperty(key)) {
        map.setLayoutProperty(id, key, void 0);
      }
    }
  }
  if (paint !== prevProps.paint) {
    const prevPaint = prevProps.paint || {};
    for (const key in paint) {
      if (!deepEqual(paint[key], prevPaint[key])) {
        map.setPaintProperty(id, key, paint[key]);
      }
    }
    for (const key in prevPaint) {
      if (!paint.hasOwnProperty(key)) {
        map.setPaintProperty(id, key, void 0);
      }
    }
  }
  if (!deepEqual(filter, prevProps.filter)) {
    map.setFilter(id, filter);
  }
  if (minzoom !== prevProps.minzoom || maxzoom !== prevProps.maxzoom) {
    map.setLayerZoomRange(id, minzoom, maxzoom);
  }
}
function createLayer(map, id, props) {
  if (map.style && map.style._loaded && map.getSource(props.source)) {
    const options = { ...props, id };
    delete options.beforeId;
    map.addLayer(options, props.beforeId);
  }
}
var layerCounter = 0;
function Layer(props) {
  const map = (0, import_react14.useContext)(MapContext).map.getMap();
  const propsRef = (0, import_react14.useRef)(props);
  const [, setStyleLoaded] = (0, import_react14.useState)(0);
  const id = (0, import_react14.useMemo)(() => props.id || `jsx-layer-${layerCounter++}`, []);
  (0, import_react14.useEffect)(() => {
    if (map) {
      const forceUpdate = () => setStyleLoaded((version) => version + 1);
      map.on("styledata", forceUpdate);
      forceUpdate();
      return () => {
        map.off("styledata", forceUpdate);
        if (map.style && map.style._loaded) {
          map.removeLayer(id);
        }
      };
    }
    return void 0;
  }, [map]);
  const layer = map && map.style && map.getLayer(id);
  if (layer) {
    try {
      updateLayer(map, id, props, propsRef.current);
    } catch (error) {
      console.warn(error);
    }
  } else {
    createLayer(map, id, props);
  }
  propsRef.current = props;
  return null;
}
var layer_default = Layer;

// node_modules/react-map-gl/dist/esm/types/external.js
init_react();

// app/styles/mapType.css
var mapType_default = "/build/_assets/mapType-ZRZJ5I73.css";

// app/routes/__map/$mapType.tsx
var import_react15 = __toESM(require_react());
function links() {
  return [{ rel: "stylesheet", href: mapType_default }, { rel: "stylesheet", href: "https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css" }];
}
var dataLayer = {
  id: "data",
  type: "fill",
  paint: {
    "fill-color": {
      property: "percentile",
      stops: [
        [0, "#3288bd"],
        [1, "#66c2a5"],
        [2, "#abdda4"],
        [3, "#e6f598"],
        [4, "#ffffbf"],
        [5, "#fee08b"],
        [6, "#fdae61"],
        [7, "#f46d43"],
        [8, "#d53e4f"]
      ]
    },
    "fill-opacity": 0.8
  }
};
function Test() {
  const mapData = useLoaderData();
  const mapRef = (0, import_react15.useRef)();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", null, "Hier komt de map "), /* @__PURE__ */ React.createElement(map_default, {
    id: "map",
    ref: mapRef,
    initialViewState: {
      latitude: 40,
      longitude: -100,
      zoom: 3
    },
    mapStyle: "mapbox://styles/mapbox/light-v9",
    mapboxAccessToken: "pk.eyJ1IjoiYmFyYmFyb3NzbyIsImEiOiJja3VsbWRiancwNXVqMzFwMTZlbXh3Y3Q1In0.4BKvUDl3t6OSJbdMmu7tkg",
    interactiveLayerIds: ["data"]
  }, /* @__PURE__ */ React.createElement(source_default, {
    type: "geojson",
    data: mapData
  }, /* @__PURE__ */ React.createElement(layer_default, {
    ...dataLayer
  }))));
}
export {
  Test as default,
  links
};
//# sourceMappingURL=/build/routes/__map/$mapType-Z54UQ55N.js.map
