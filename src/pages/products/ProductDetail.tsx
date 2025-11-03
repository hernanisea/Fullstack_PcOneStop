import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../actions/get-product-by-id.actions";
import type { Product } from "../../interfaces/product.interfaces";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../helpers/format-currency.helpers";

export const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useApp();

  useEffect(() => {
    if (id) getProductById(id).then(setProduct);
  }, [id]);

  if (!product) return <div className="container py-4">Cargando...</div>;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-6"><img className="img-fluid rounded" src={product.image} alt={product.name} /></div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">{product.category}</p>
          <h3 className="mt-3">{formatCurrency(product.price)}</h3>
          <p className="mt-3">{product.description}</p>
          <button className="btn btn-primary mt-3"
            onClick={() => addToCart({ productId: product.id, name: product.name, price: product.price, qty: 1 })}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};
