import { Link, Outlet } from "remix";

export default function Index() {
  return (
    <>
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
        <h1>Welcome to Remix</h1>
        <ul>
          <li>
            <Link to="/provinces">Provincies</Link>
          </li>
          <li>
            <Link to="/districts">Districts</Link>
          </li>
          <li>
            <Link to="/municipalities">Municipalities</Link>
          </li>
        </ul>
      </div>
      <div id="map">
        <Outlet />
      </div>
    </>
  );
}
