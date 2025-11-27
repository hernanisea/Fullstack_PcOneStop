import { Link, useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { db } from "../../data/db";
import { useApp } from "../../context/AppContext"; // 1. Importar useApp
import { formatCurrency } from "../../helpers/format-currency.helpers";
import type { Product } from "../../interfaces/product.interfaces";
import type { Review } from "../../interfaces/review.interfaces"; // 2. Importar tipo actualizado
import Rating from "../shared/Rating";
// 3. Importar 'save' en lugar de 'add'
import { getReviewsFromLS, saveReviewsToLS } from "../../helpers/local-storage.helpers"; 

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

export const ProductDetail = () => {
  const { id } = useParams();
  // 4. Obtener 'user' y 'showToast' del contexto
  const { addToCart, user, showToast } = useApp();

  const product = useMemo(
    () => db.products.find((p) => p.id === id) as Product | undefined,
    [id]
  );

  const related = useMemo(
    () => db.products.filter((p) => p.category === product?.category && p.id !== product?.id),
    [product]
  );

  // ---------- Reseñas ----------
  const [reviews, setReviews] = useState<Review[]>([]);
  // 5. Nuevo estado para guardar la reseña del usuario actual (si existe)
  const [userReview, setUserReview] = useState<Review | null>(null);
  
  // Estados del formulario
  // const [author, setAuthor] = useState(""); // <-- ELIMINADO
  const [rating, setRating] = useState<1|2|3|4|5>(5);
  const [comment, setComment] = useState("");
  
  // 6. El nombre del autor se define por el login
  const authorName = user ? user.name : "Anónimo";

  // 7. Lógica de carga de reseñas actualizada
  useEffect(() => {
    if (!product) return;
    
    // Carga todas las reseñas
    const fromLS = getReviewsFromLS(product.id);
    setReviews(fromLS);

    // Si el usuario está logueado, busca su reseña
    if (user) {
      const existingReview = fromLS.find(r => r.userId === user.id);
      if (existingReview) {
        // Si la encuentra: guarda la reseña, y rellena el formulario
        setUserReview(existingReview);
        setRating(existingReview.rating);
        setComment(existingReview.comment);
      } else {
        // Si no la encuentra: resetea el formulario
        setUserReview(null);
        setRating(5);
        setComment("");
      }
    } else {
      // Si el usuario no está logueado, resetea todo
      setUserReview(null);
      setRating(5);
      setComment("");
    }
  }, [product, user]); // Se ejecuta cuando cambia el producto o el usuario

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

  const handleAdd = () =>
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      image: product.image || "/logo.png"
    });

  // 8. Lógica de envío de reseña (Añadir/Editar)
  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast("Por favor, escribe un comentario.", 'error');
      return;
    }

    const authorId = user ? user.id : null;
    let nextReviews: Review[];

    if (userReview) {
      // --- LÓGICA DE EDICIÓN ---
      nextReviews = reviews.map(r => 
        r.id === userReview.id 
        ? { ...r, rating, comment, date: new Date().toISOString() } // La reseña actualizada
        : r
      );
      
    } else {
      // --- LÓGICA DE AÑADIR NUEVA ---
      const newReview: Review = {
        id: uid(),
        productId: product!.id,
        userId: authorId,
        author: authorName,
        rating,
        comment: comment.trim(),
        date: new Date().toISOString(),
      };
      nextReviews = [newReview, ...reviews];
    }

    // 9. Guardamos la lista (nueva o actualizada) en LocalStorage
    saveReviewsToLS(product!.id, nextReviews);
    setReviews(nextReviews); // Actualizamos el estado de la página
    
    // 10. Actualizamos el estado 'userReview' y mostramos Toast
    if (userReview) {
      // Si acabamos de EDITAR, actualizamos 'userReview' con los nuevos datos
      setUserReview(nextReviews.find(r => r.id === userReview.id) || null);
      showToast("Reseña actualizada con éxito", 'success');
    } else if (user) {
      // Si acabamos de AÑADIR (y estamos logueados), buscamos la reseña recién creada y la guardamos
      setUserReview(nextReviews.find(r => r.userId === user.id) || null);
      showToast("Reseña publicada con éxito", 'success');
    } else {
      // El usuario es anónimo, solo reseteamos el formulario
      setComment("");
      setRating(5);
      showToast("Reseña anónima publicada", 'success');
    }
  };

  // 11. Texto del botón dinámico
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
            />
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold mb-2">{product.name}</h2>
          <p className="text-muted mb-1">
            {product.brand} • {product.category}
          </p>
          <h3 className="text-success mb-3">{formatCurrency(product.price)}</h3>
          {product.stock > 0 ? (
            <p className="text-success fw-semibold">En stock ({product.stock} unidades)</p>
          ) : (
            <p className="text-danger fw-semibold">Agotado</p>
          )}
          <p className="mt-3">{product.description}</p>
          <div className="d-flex gap-3 mt-4">
            <button
              className="btn btn-primary px-4"
              onClick={handleAdd}
              disabled={product.stock <= 0}
            >
              Agregar al carrito
            </button>
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