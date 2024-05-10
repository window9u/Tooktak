import { Link } from "react-router-dom";

export function Menu({ children, logo }) {
  return (
    <aside className="menu">
      <figure class="image is-3by1">
        <img src={logo} alt="logo" />
      </figure>
      {children}
    </aside>
  );
}
export function MenuLabel({ label }) {
  return <p className="menu-label">{label}</p>;
}
export function MenuList({ children }) {
  return <ul className="menu-list ">{children}</ul>;
}

export function MenuItem({ path, name }) {
  return <Link to={path}>{name}</Link>;
}