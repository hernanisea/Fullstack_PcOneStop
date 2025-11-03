import type { Product } from "../../interfaces/product.interfaces";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../helpers/format-currency.helpers";
import { Link } from "react-router-dom";

type Props = { product: Product };

export const ProductCard = ({ product }: Props) => {
  const { addToCart } = useApp();
  const outOfStock = product.stock <= 0;

  const handleAdd = () =>
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      image: ""
    });

  return (
    <div className="product-card card h-100 border-0 shadow-sm">
      <div className="product-thumb position-relative">
        <img
          src={product.image || "/logo.png"}
          alt={product.name}
          loading="lazy"
          className="w-100 h-100"
        />

        <span
          className={`product-badge badge ${
            outOfStock ? "bg-secondary" : "bg-success"
          }`}
        >
          {outOfStock ? "Agotado" : "En stock"}
        </span>
      </div>

      <div className="card-body d-flex flex-column gap-2">
        <Link
          to={`/products/${product.id}`}
          className="stretched-link text-decoration-none"
        >
          <h6 className="mb-1 text-white line-clamp-2">{product.name}</h6>
        </Link>

        <div className="text-muted small">{product.brand} • {product.category}</div>

        <div className="mt-auto d-flex align-items-center justify-content-between">
          <strong className="price-text">{formatCurrency(product.price)}</strong>

          <button
            className="btn btn-outline-primary btn-sm product-add-btn"
            onClick={handleAdd}
            disabled={outOfStock}
            aria-disabled={outOfStock}
          >
            {outOfStock ? "Sin stock" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};
