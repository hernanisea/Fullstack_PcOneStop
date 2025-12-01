// src/pages/build/PcBuilderPage.tsx
import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { PcBuild } from '../../interfaces/build.interfaces';
import type { Product } from '../../interfaces/product.interfaces';
import { validateCompatibility } from '../../helpers/validate-compatibility.helpers';
import { formatCurrency } from '../../helpers/format-currency.helpers';
import { Link } from 'react-router-dom';

// Define las categorías para el builder
const BUILD_CATEGORIES: { id: keyof PcBuild; name: string; required: boolean; productCategory: string }[] = [
  { id: 'cpu', name: 'Procesador (CPU)', required: true, productCategory: 'CPU' },
  { id: 'mb', name: 'Placa Madre', required: true, productCategory: 'Placa madre' },
  { id: 'gpu', name: 'Tarjeta Gráfica (GPU)', required: true, productCategory: 'GPU' },
  { id: 'ram', name: 'Memoria RAM', required: true, productCategory: 'RAM' },
  { id: 'storage', name: 'Almacenamiento', required: true, productCategory: 'Almacenamiento' },
  { id: 'psu', name: 'Fuente de Poder (PSU)', required: true, productCategory: 'Fuente' },
  { id: 'case', name: 'Gabinete', required: true, productCategory: 'Gabinete' },
  { id: 'cooler', name: 'Cooler (Opcional)', required: false, productCategory: 'Cooler' }, // Asume que tienes una categoría 'Cooler'
];

export const PcBuilderPage = () => {
  const { products, addToCart, setIsLoading } = useApp();
  const [build, setBuild] = useState<PcBuild>({});
  const [validation, setValidation] = useState<{ ok: boolean; issues: string[] }>({ ok: true, issues: [] });
  const [validated, setValidated] = useState(false);
  const [showRequiredError, setShowRequiredError] = useState(false); // <-- NUEVO state para el error

  // Agrupamos productos por categoría para los <select>
  const productsByCategory = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    for (const product of products) {
      if (!groups[product.category]) {
        groups[product.category] = [];
      }
      groups[product.category].push(product);
    }
    return groups;
  }, [products]);

  const handleSelect = (categoryKey: keyof PcBuild, productId: string) => {
    setValidated(false); // Resetea la validación
    setShowRequiredError(false); // <-- NUEVO: Oculta el error de "campos vacíos" cuando el usuario interactúa
    setBuild(prev => ({
      ...prev,
      [categoryKey]: productId === '' ? undefined : productId,
    }));
  };

  // Verificamos si los campos requeridos están completos
  const isBuildComplete = BUILD_CATEGORIES.every(cat => cat.required ? !!build[cat.id] : true);

  const handleValidate = () => {
    // <-- MODIFICADO: Lógica de validación
    // 1. Revisa si faltan campos obligatorios
    if (!isBuildComplete) {
      setShowRequiredError(true); // Muestra el error de campos obligatorios
      setValidated(false); // Oculta cualquier mensaje de éxito/error de compatibilidad
      return; // Detiene la función
    }
    
    setShowRequiredError(false);
    const result = validateCompatibility(build);
    setValidation(result);
    setValidated(true);
  };
  
  const total = useMemo(() => {
    return Object.values(build).reduce((acc, productId) => {
      const product = products.find(p => p.id === productId);
      return acc + (product?.price || 0);
    }, 0);
  }, [build, products]);
  
  const handleAddToCart = () => {
    setIsLoading(true); 
    
    const itemsToAdd = Object.values(build)
      .map(productId => products.find(p => p.id === productId))
      .filter((p): p is Product => !!p); 
      
    itemsToAdd.forEach(product => {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        image: product.image || "/logo.png"
      });
    });
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); 
  };
  
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Arma tu PC</h2>

      <div className="row g-4">
        {/* Columna de selección */}
        <div className="col-lg-8">
          <div className="d-flex flex-column gap-3">
            {BUILD_CATEGORIES.map(cat => {
              const availableProducts = productsByCategory[cat.productCategory] || [];
              const selectedId = build[cat.id];
              const selectedProduct = products.find(p => p.id === selectedId);

              return (
                <div className="card shadow-sm" key={cat.id}>
                  <div className="card-body">
                    {/* Añadimos el '*' con CSS simple */}
                    <label className="form-label fw-bold">
                      {cat.name} 
                      {cat.required && <span style={{ color: 'red' }}> *</span>}
                    </label>
                    <select
                      className="form-select"
                      value={selectedId || ''}
                      onChange={(e) => handleSelect(cat.id, e.target.value)}
                    >
                      <option value="">{availableProducts.length > 0 ? 'Selecciona uno...' : 'No hay productos'}</option>
                      {availableProducts.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({formatCurrency(p.price)})
                        </option>
                      ))}
                    </select>

                    {selectedProduct && (
                      <div className="small text-muted mt-2">
                        Seleccionado: <Link to={`/products/${selectedProduct.id}`}>{selectedProduct.name}</Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna de resumen y validación */}
        <div className="col-lg-4">
          <div className="card shadow-sm summary-card-sticky" style={{top: '100px'}}>
            <div className="card-body">
              <h5 className="card-title">Resumen del Armado</h5>
              <div className="d-flex justify-content-between fs-5 mb-3">
                <span>Total Estimado:</span>
                <span className="fw-bold">{formatCurrency(total)}</span>
              </div>
              
              {/* Botón de validación (ya no está deshabilitado) */}
              <button type="button" className="btn btn-primary w-100" onClick={handleValidate}>
                Validar Compatibilidad
              </button>
              
              {/* <-- NUEVO: Mensaje de error para campos obligatorios --> */}
              {showRequiredError && (
                <div className="alert alert-danger mt-3 small p-2">
                  Faltan campos obligatorios. Por favor, completa todas las secciones marcadas con *.
                </div>
              )}
              
              {/* Mensajes de validación de compatibilidad (existentes) */}
              {validated && validation.issues.length > 0 && (
                <div className="alert alert-danger mt-3 small p-2">
                  <strong>Problemas encontrados:</strong>
                  <ul className="mb-0 ps-3">
                    {validation.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                  </ul>
                </div>
              )}
              {validated && validation.ok && (
                 <div className="alert alert-success mt-3 small p-2">
                   ¡Tu armado parece compatible!
                 </div>
              )}
              
              <button 
                className="btn btn-success w-100 mt-2" 
                // Deshabilitado si no se ha validado, si la validación falló, o si el total es 0
                disabled={!validated || !validation.ok || total === 0}
                onClick={handleAddToCart}
              >
                Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};