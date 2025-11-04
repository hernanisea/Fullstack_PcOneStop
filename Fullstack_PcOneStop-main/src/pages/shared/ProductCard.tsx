import type { Product } from "../../interfaces/product.interfaces";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../helpers/format-currency.helpers";
import { Link } from "react-router-dom";

type Props = { product: Product };

export const ProductCard = ({ product }: Props) => {
  const { addToCart } = useApp();
  const outOfStock = product.stock <= 0;

  // Si el producto está en oferta, calculamos el precio con descuento
  const discountedPrice = product.isOnSale && product.offer 
    ? product.price - (product.price * (product.offer.discount / 100))
    : product.price;

  const handleAdd = () =>
    addToCart({
      productId: product.id,
      name: product.name,
      price: discountedPrice,  // Usamos el precio con descuento si está en oferta
      qty: 1,
      image: product.image || "/logo.png"
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
          {/* Si está en oferta, mostramos el precio con descuento */}
          <strong className="price-text">
            {product.isOnSale ? formatCurrency(discountedPrice) : formatCurrency(product.price)}
          </strong>

          <button
            className="btn btn-outline-primary btn-sm product-add-btn"
            onClick={handleAdd}
            disabled={outOfStock}
            aria-disabled={outOfStock}
          >
            {outOfStock ? "Sin stock" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
};
