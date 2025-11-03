import { useEffect, useState } from "react";
import { getProducts } from "../../actions/get-product.actions";
import type { Product } from "../../interfaces/product.interfaces";
import { ProductCard } from "../shared/ProductCard";

export const ProductList = () => {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => { getProducts().then(setItems); }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-3">Productos</h2>
      <div className="row g-3">
        {items.map(p => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
};
