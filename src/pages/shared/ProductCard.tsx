import { Link } from "react-router-dom";
import { formatCurrency } from "../../helpers/format-currency.helpers";
import type { Product } from "../../interfaces/product.interfaces";

export const ProductCard = ({ product }: { product: Product }) => (
  <div className="card h-100">
    <img src={product.image} className="card-img-top" alt={product.name} />
    <div className="card-body d-flex flex-column">
      <h5 className="card-title">{product.name}</h5>
      <p className="text-muted small">{product.category}</p>
      <p className="fw-bold mt-auto">{formatCurrency(product.price)}</p>
      <Link className="btn btn-outline-primary mt-2" to={`/products/${product.id}`}>
        Ver detalle
      </Link>
    </div>
  </div>
);
