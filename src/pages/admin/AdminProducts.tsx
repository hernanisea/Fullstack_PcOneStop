// src/pages/admin/AdminProducts.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importar Link y useNavigate
import type { Product } from "../../interfaces/product.interfaces";
import { getAdminProducts, deleteAdminProduct } from "../../actions/admin.actions"; // Importar delete
import { formatCurrency } from "../../helpers/format-currency.helpers";
import { useApp } from "../../context/AppContext"; // Importar useApp

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook para navegación
  const { showToast, setIsLoading } = useApp(); // Hooks del contexto

  const loadProducts = () => {
    setLoading(true);
    getAdminProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  // Cargar productos al montar
  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (productId: string, productName: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${productName}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteAdminProduct(productId);
      showToast("Producto eliminado", "success");
      // Recargar la lista de productos
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      showToast("Error al eliminar el producto", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Gestión de Productos ({products.length})</h3>
        {/* Botón para crear nuevo */}
        <Link to="/admin/products/new" className="btn btn-primary">
          <i className="bi bi-plus-lg"></i> Crear Producto
        </Link>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            <div className="table-responsive">
              <table className="table admin-table align-middle">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => {
                    return (
                      <tr key={product.id}>
                        <td>
                          <img
                            src={product.image || "/logo.png"}
                            alt={product.name}
                            width="50"
                            height="50"
                            style={{ objectFit: 'contain' }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target.src !== `${window.location.origin}/logo.png`) {
                                target.src = "/logo.png";
                              }
                            }}
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(product.id, product.name)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};