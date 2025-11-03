import { Link, NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export const NavBar = () => {
  const { cart } = useApp();
  const count = cart.reduce((a, i) => a + i.qty, 0);

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">PC OneStop</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/products">Productos</NavLink></li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/cart">Carrito ({count})</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
