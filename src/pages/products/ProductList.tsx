import { useMemo, useState } from "react";
import { ProductCard } from "../shared/ProductCard";
import type { Product } from "../../interfaces/product.interfaces";
import { useApp } from "../../context/AppContext";

const CATEGORIES = ["CPU", "GPU", "RAM", "Almacenamiento", "Placa madre", "Fuente", "Gabinete", "Cooler"];

export const ProductList = () => {
  const { products } = useApp(); // Obtener productos desde el contexto (cargados desde el backend)
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | "">("");

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchText =
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.brand?.toLowerCase().includes(q.toLowerCase());
      const matchCat = category ? p.category === category : true;
      return matchText && matchCat;
    });
  }, [products, q, category]);

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <h2 className="m-0">Productos</h2>
        <span className="text-muted">({filtered.length})</span>
      </div>

      {/* Filtros */}
      <div className="product-filters mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o marca..."
          className="form-control"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-select"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p className="mb-1">No encontramos productos con esos filtros.</p>
          <small>Prueba con otra búsqueda o categoría.</small>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
