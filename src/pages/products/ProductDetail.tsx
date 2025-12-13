import { Link, useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../helpers/format-currency.helpers";
import type { Product } from "../../interfaces/product.interfaces";
import type { Review } from "../../interfaces/review.interfaces";
import Rating from "../shared/Rating";
import { getProductById } from "../../actions/get-product-by-id.actions";
import { getReviewsByProductId, addReview } from "../../actions/reviews.actions";
import { reportProduct } from "../../actions/reports.actions"; 

// Función eliminada - ya no se necesita generar IDs localmente

export const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, user, showToast, products } = useApp();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Selector de cantidad
  
  // ---------- Reseñas ----------
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  
  const [rating, setRating] = useState<1|2|3|4|5>(5);
  const [comment, setComment] = useState("");
  
  const authorName = user ? (user.firstName || user.name || "Usuario") : "Anónimo";

  // ---------- Reporte de Producto ----------
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  // Cargar producto desde el backend
  useEffect(() => {
    if (!id) return;
    
    const loadProduct = async () => {
      setLoading(true);
      try {
        const productData = await getProductById(id);
        setProduct(productData);
        
        // Limitar cantidad máxima al stock disponible
        if (productData && productData.stock > 0) {
          if (quantity > productData.stock) {
            setQuantity(productData.stock);
          }
        } else {
          setQuantity(0);
        }
      } catch (error) {
        console.error("Error al cargar producto:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);

  // Cargar reseñas desde el backend
  useEffect(() => {
    if (!id) return;
    
    const loadReviews = async () => {
      setLoadingReviews(true);
      try {
        const reviewsData = await getReviewsByProductId(id);
        setReviews(reviewsData);
        
        // Si el usuario está logueado, buscar su reseña
        if (user) {
          const existingReview = reviewsData.find(r => r.userId === user.id?.toString());
          if (existingReview) {
            setUserReview(existingReview);
            setRating(existingReview.rating);
            setComment(existingReview.comment);
          } else {
            setUserReview(null);
            setRating(5);
            setComment("");
          }
        } else {
          setUserReview(null);
          setRating(5);
          setComment("");
        }
      } catch (error) {
        console.error("Error al cargar reseñas:", error);
      } finally {
        setLoadingReviews(false);
      }
    };
    
    loadReviews();
  }, [id, user]);

  // Productos relacionados (de la lista de productos cargados)
  const related = useMemo(
    () => products.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 4),
    [product, products]
  );

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2>Producto no encontrado</h2>
        <Link to="/products" className="btn btn-primary mt-3">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    if (!product || product.stock <= 0) {
      showToast("Este producto está agotado", 'error');
      return;
    }
    
    if (quantity <= 0 || quantity > product.stock) {
      showToast(`Solo puedes agregar hasta ${product.stock} unidades`, 'error');
      return;
    }
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: quantity,
      image: product.image || "/logo.png"
    });
    
    // Resetear cantidad a 1 después de agregar
    setQuantity(1);
  };
  
  const isOutOfStock = product?.stock === 0;
  const maxQuantity = product?.stock || 0;
  const isLowStock = product ? (product.stock > 0 && product.stock <= 5) : false;

  // Guardar reseña en el backend
  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast("Por favor, escribe un comentario.", 'error');
      return;
    }

    if (!product) return;

    try {
      const userId = user?.id ? (typeof user.id === 'number' ? user.id : parseInt(user.id)) : undefined;
      
      const newReview = await addReview({
        productId: product.id.toString(),
        userId: user?.id?.toString() || null,
        author: authorName,
        rating,
        comment: comment.trim(),
      }, userId);

      if (newReview) {
        // Recargar las reseñas desde el backend
        const updatedReviews = await getReviewsByProductId(product.id.toString());
        setReviews(updatedReviews);
        
        // Actualizar la reseña del usuario
        const userRev = updatedReviews.find(r => r.userId === user?.id?.toString());
        if (userRev) {
          setUserReview(userRev);
          setRating(userRev.rating);
          setComment(userRev.comment);
        } else {
          setUserReview(null);
          setRating(5);
          setComment("");
        }
        
        showToast("Reseña publicada con éxito", 'success');
      }
    } catch (error: any) {
      showToast(error.message || "Error al guardar la reseña", 'error');
    }
  };

  // Enviar reporte de producto
  const handleReportProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportReason.trim()) {
      showToast("Por favor, describe el motivo del reporte.", 'error');
      return;
    }

    if (!product || !user) {
      showToast("Debes iniciar sesión para reportar un producto.", 'error');
      return;
    }

    try {
      setReportLoading(true);
      const userId = typeof user.id === 'number' ? user.id : parseInt(user.id);
      const productId = typeof product.id === 'number' ? product.id : parseInt(product.id.toString());
      
      await reportProduct(productId, reportReason.trim(), userId);
      
      showToast("Reporte enviado exitosamente. Gracias por tu colaboración.", 'success');
      setReportReason("");
      setShowReportForm(false);
    } catch (error: any) {
      showToast(error.message || "Error al enviar el reporte", 'error');
    } finally {
      setReportLoading(false);
    }
  };

  const buttonText = userReview ? "Actualizar Reseña" : "Publicar Reseña";

  return (
    <div className="product-detail container py-5">
      {/* ----- SECCIÓN PRINCIPAL (sin cambios) ----- */}
      <div className="row g-4 align-items-center mb-5">
        <div className="col-md-6 text-center">
          <div className="product-image-wrapper shadow-sm rounded">
            <img
              src={product.image || "/logo.png"}
              alt={product.name}
              className="img-fluid"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== `${window.location.origin}/logo.png`) {
                  target.src = "/logo.png";
                }
              }}
            />
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold mb-2">{product.name}</h2>
          <p className="text-muted mb-1">
            {product.brand} • {product.category}
          </p>
          <h3 className="text-success mb-3">{formatCurrency(product.price)}</h3>
          {isOutOfStock ? (
            <div className="alert alert-danger mb-3">
              <i className="bi bi-x-circle-fill me-2"></i>
              <strong>Este producto está agotado</strong>
              <p className="mb-0 small mt-1">No hay unidades disponibles en este momento.</p>
            </div>
          ) : (
            <div className="stock-info mb-3">
              <p className={`fw-semibold ${isLowStock ? "text-warning" : "text-success"}`}>
                {isLowStock ? (
                  <>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    ⚠️ Últimas {product.stock} unidades disponibles
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle-fill me-2"></i>
                    ✓ En stock ({product.stock} unidades)
                  </>
                )}
              </p>
              {isLowStock && (
                <p className="text-warning small mb-0">
                  ⚠️ Quedan pocas unidades disponibles
                </p>
              )}
            </div>
          )}
          
          <p className="mt-3">{product.description}</p>
          
          {/* Selector de Cantidad - Solo si hay stock */}
          {!isOutOfStock && (
            <div className="quantity-selector mb-3">
              <label htmlFor="quantity" className="form-label fw-semibold">
                Cantidad:
              </label>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  id="quantity"
                  type="number"
                  className="form-control"
                  style={{ width: 100, textAlign: 'center' }}
                  min={1}
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value || "1", 10);
                    if (!isNaN(val) && val >= 1 && val <= maxQuantity) {
                      setQuantity(val);
                    }
                  }}
                  aria-label="Cantidad"
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                >
                  +
                </button>
                <span className="text-muted small ms-2">
                  Máximo: {maxQuantity}
                </span>
              </div>
            </div>
          )}
          
          <div className="d-flex gap-3 mt-4">
            {isOutOfStock ? (
              <button
                className="btn btn-secondary px-4"
                disabled
                title="Producto agotado - No hay unidades disponibles"
              >
                <i className="bi bi-x-circle-fill me-2"></i>
                Producto Agotado
              </button>
            ) : (
              <button
                className="btn btn-primary px-4"
                onClick={handleAdd}
              >
                <i className="bi bi-cart-plus-fill me-2"></i>
                Agregar al Carrito - {formatCurrency(product.price * quantity)}
              </button>
            )}
            <Link to="/products" className="btn btn-outline-light">
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>

      {/* ----- RESEÑAS ----- */}
      <section className="reviews-section py-4 border-top border-dark-subtle">
        <h4 className="fw-semibold mb-3">Opiniones de clientes</h4>

        {/* Formulario */}
        <form className="review-form p-3 rounded shadow-sm mb-4" onSubmit={submitReview}>
          
          {/* 12. Mostramos el nombre del autor en lugar de un input */}
          <div className="mb-3">
            <label className="form-label">Publicando como:</label>
            <p className="fw-bold fs-5" style={{ color: 'var(--color-text)' }}>{authorName}</p>
          </div>

          <div className="row g-3 align-items-center">
            {/* El input 'Tu nombre' se ha eliminado */}
            <div className="col-md-6">
              <label className="form-label d-block">Calificación</label>
              <Rating value={rating} onChange={(n) => setRating(n as any)} />
            </div>
            <div className="col-12">
              <label className="form-label">Comentario</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder={userReview ? "Edita tu comentario..." : "¿Qué tal te pareció el producto?"}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="col-12">
              {/* 13. Texto del botón dinámico */}
              <button type="submit" className="btn btn-success">
                {buttonText}
              </button>
            </div>
          </div>
        </form>

        {/* Lista (sin cambios) */}
        <div className="review-list d-flex flex-column gap-3">
          {reviews.map((r) => (
            <div key={r.id} className="review p-3 rounded shadow-sm bg-dark-subtle">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex flex-column">
                  <strong>{r.author}</strong>
                  <span className="small text-muted">
                    {new Date(r.date).toLocaleDateString()}
                  </span>
                </div>
                <Rating value={r.rating} />
              </div>
              <p className="mb-0 mt-2 small text-muted">{r.comment}</p>
            </div>
          ))}
          {reviews.length === 0 && (
            <p className="text-muted">Aún no hay reseñas para este producto.</p>
          )}
        </div>
      </section>

      {/* ----- REPORTAR PRODUCTO ----- */}
      <section className="report-section py-4 border-top border-dark-subtle">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-semibold mb-0">Reportar Problema</h4>
          {!showReportForm && (
            <button
              className="btn btn-outline-warning btn-sm"
              onClick={() => {
                if (!user) {
                  showToast("Debes iniciar sesión para reportar un producto.", 'error');
                  return;
                }
                setShowReportForm(true);
              }}
            >
              Reportar Producto
            </button>
          )}
        </div>

        {showReportForm && (
          <div className="card shadow-sm">
            <div className="card-body">
              <p className="text-muted small mb-3">
                Si encuentras algún problema con este producto (precio incorrecto, información errónea, etc.), 
                por favor repórtalo. Tu ayuda nos permite mejorar el catálogo.
              </p>
              
              <form onSubmit={handleReportProduct}>
                <div className="mb-3">
                  <label className="form-label">Motivo del reporte *</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Ej: El precio mostrado no coincide con el precio real, la descripción es incorrecta, el producto está mal categorizado..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    required
                    disabled={reportLoading}
                  />
                  <small className="text-muted">
                    Describe el problema que encontraste con este producto.
                  </small>
                </div>
                
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-warning"
                    disabled={reportLoading || !reportReason.trim()}
                  >
                    {reportLoading ? "Enviando..." : "Enviar Reporte"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowReportForm(false);
                      setReportReason("");
                    }}
                    disabled={reportLoading}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* ----- PRODUCTOS RELACIONADOS (sin cambios) ----- */}
      {related.length > 0 && (
        <section className="related-section py-5 border-top border-dark-subtle">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-semibold mb-0">Productos relacionados</h4>
            <Link to="/products" className="text-decoration-none small text-muted">
              Ver más
            </Link>
          </div>
          <div className="related-grid">
            {related.map((p) => (
              <div key={p.id} className="related-item">
                <div className="card bg-dark text-light border-0 shadow-sm h-100">
                  <img
                    src={p.image || "/logo.png"}
                    alt={p.name}
                    className="card-img-top p-3"
                    style={{ objectFit: "contain", height: 150 }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== `${window.location.origin}/logo.png`) {
                        target.src = "/logo.png";
                      }
                    }}
                  />
                  <div className="card-body">
                    <h6 className="card-title">{p.name}</h6>
                    <p className="small text-muted mb-2">{p.brand}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">{formatCurrency(p.price)}</span>
                      <Link
                        to={`/products/${p.id}`}
                        className="btn btn-sm btn-outline-light"
                      >
                        Ver
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};