// src/pages/admin/AdminProductForm.tsx
import { useState, useEffect } from "react";
import type { Product } from "../../interfaces/product.interfaces";

type Props = {
  initialData?: Product; // Opcional, para editar
  onSubmit: (formData: Product) => Promise<void>; // Función para manejar el envío
  isSubmitting: boolean;
};

// Estado inicial para un producto vacío
const emptyProduct: Product = {
  id: "",
  name: "",
  category: "CPU", // Valor por defecto
  brand: "",
  model: "", // Campo obligatorio del backend
  price: 0,
  stock: 0,
  image: "",
  description: "",
  isOnSale: false,
};

// Función para normalizar los datos del producto y evitar null/undefined
const normalizeProduct = (product: Product | null | undefined): Product => {
  if (!product) return emptyProduct;
  
  return {
    id: product.id || "",
    name: product.name || "",
    category: product.category || "CPU",
    brand: product.brand || "",
    model: product.model || "",
    price: product.price || 0,
    stock: product.stock || 0,
    image: product.image || "",
    description: product.description || "",
    isOnSale: product.isOnSale || false,
    offer: product.offer || { discount: 0, startDate: "", endDate: "" },
  };
};

export const AdminProductForm = ({ initialData, onSubmit, isSubmitting }: Props) => {
  const [formData, setFormData] = useState<Product>(normalizeProduct(initialData));

  useEffect(() => {
    if (initialData) {
      setFormData(normalizeProduct(initialData));
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Maneja checkboxes (isOnSale)
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    // Maneja números (price, stock)
    if (type === 'number') {
      const numericValue = Math.max(0, Number(value));
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }
    
    // Maneja texto
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleOfferChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const discount = Number(e.target.value);
    setFormData(prev => ({
      ...prev,
      offer: {
        discount: discount,
        startDate: "", // Mock
        endDate: "" // Mock
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-body">
          <div className="row g-3">
            
            <div className="col-md-8">
              <label className="form-label">Nombre del Producto</label>
              <input type="text" className="form-control" name="name" value={formData.name || ''} onChange={handleChange} required />
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Marca</label>
              <input type="text" className="form-control" name="brand" value={formData.brand || ''} onChange={handleChange} required />
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Modelo</label>
              <input type="text" className="form-control" name="model" value={formData.model || ''} onChange={handleChange} required />
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Categoría</label>
              <select className="form-select" name="category" value={formData.category || 'CPU'} onChange={handleChange} required>
                {/* Estas categorías deben coincidir con tu PC Builder */}
                <option value="CPU">CPU</option>
                <option value="Placa madre">Placa madre</option>
                <option value="GPU">GPU</option>
                <option value="RAM">RAM</option>
                <option value="Almacenamiento">Almacenamiento</option>
                <option value="Fuente">Fuente</option>
                <option value="Gabinete">Gabinete</option>
                <option value="Cooler">Cooler</option>
              </select>
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Precio</label>
              <input type="number" className="form-control" name="price" value={formData.price || ''} onChange={handleChange} required />
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Stock</label>
              <input type="number" className="form-control" name="stock" value={formData.stock ||  ''} onChange={handleChange} required />
            </div>
            
            <div className="col-12">
              <label className="form-label">URL de la Imagen</label>
              <input type="text" className="form-control" name="image" value={formData.image || ''} onChange={handleChange} />
            </div>
            
            <div className="col-12">
              <label className="form-label">Descripción</label>
              <textarea className="form-control" name="description" rows={4} value={formData.description || ''} onChange={handleChange} />
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Descuento (%) Oferta</label>
              <input type="number" className="form-control" name="offer.discount" value={formData.offer?.discount || 0} onChange={handleOfferChange} />
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" name="isOnSale" id="isOnSale" checked={formData.isOnSale || false} onChange={handleChange} />
                <label className="form-check-label" htmlFor="isOnSale">¿Está en oferta?</label>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar Producto"}
        </button>
      </div>
    </form>
  );
};