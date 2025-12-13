import type { Product } from "../../interfaces/product.interfaces";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../helpers/format-currency.helpers";
import { getStockBadgeClass, getStockMessage } from "../../helpers/stock.helpers";
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
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== `${window.location.origin}/logo.png`) {
              target.src = "/logo.png";
            }
          }}
        />
        <span
          className={`product-badge badge ${getStockBadgeClass(product.stock)}`}
          title={outOfStock ? "Producto agotado - No hay unidades disponibles" : `Stock disponible: ${product.stock} unidades`}
        >
          {getStockMessage(product.stock)}
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

        {/* --- SECCIÓN MODIFICADA --- */}
        {/* Quitamos 'd-flex justify-content-between' para apilar los elementos */}
        <div className="mt-auto">
        
          {/* 1. Precio (ahora es un bloque y tiene margen inferior) */}
          <strong className="price-text d-block mb-2">
            {product.isOnSale ? formatCurrency(discountedPrice) : formatCurrency(product.price)}
          </strong>

          {/* 2. Wrapper para los dos botones */}
          <div className="d-flex gap-2">
            
            {/* 3. NUEVO Botón de Detalles (Link) */}
            <Link
              to={`/products/${product.id}`}
              className="btn btn-outline-secondary btn-sm flex-grow-1" // Usamos 'flex-grow' para que ocupe el espacio
            >
              Detalles
            </Link>

            {/* 4. Botón de Agregar (modificado) */}
            <button
              className="btn btn-outline-primary btn-sm product-add-btn flex-grow-1"
              onClick={handleAdd}
              disabled={outOfStock}
              aria-disabled={outOfStock}
              // Hacemos el 'z-index' más alto para que el botón sea clickeable
              style={{ position: 'relative', zIndex: 2 }} 
            >
              {outOfStock ? "Sin stock" : "Agregar"} {/* Texto acortado */}
            </button>
          </div>
        </div>
        {/* --- FIN DE SECCIÓN MODIFICADA --- */}
        
      </div>
    </div>
  );
};