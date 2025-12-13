// src/pages/admin/AdminProductEdit.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import type { Product } from "../../interfaces/product.interfaces";
import { getAdminProductById, updateAdminProduct } from "../../actions/admin.actions";
import { AdminProductForm } from "./AdminProductForm.tsx";

export const AdminProductEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setIsLoading, showToast, reloadProducts } = useApp();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Cargar el producto por su ID
    useEffect(() => {
        if (!id) {
            navigate("/admin/products");
            return;
        }

        getAdminProductById(id)
            .then(data => {
                if (data) {
                    // Normalizar los datos para evitar null/undefined
                    const normalizedProduct: Product = {
                        id: data.id || "",
                        name: data.name || "",
                        category: data.category || "CPU",
                        brand: data.brand || "",
                        model: data.model || "",
                        price: data.price || 0,
                        stock: data.stock || 0,
                        image: data.image || "",
                        description: data.description || "",
                        isOnSale: data.isOnSale || false,
                        offer: data.offer || { discount: 0, startDate: "", endDate: "" },
                    };
                    setProduct(normalizedProduct);
                } else {
                    showToast("Producto no encontrado", "error");
                    navigate("/admin/products");
                }
            })
            .finally(() => setLoading(false));
    }, [id, navigate, showToast]);

    // 2. Manejar el envío de la actualización
    const handleSubmit = async (formData: Product) => {
        if (!id) return;

        setIsSubmitting(true);
        setIsLoading(true);

        try {
            await updateAdminProduct(id, formData);
            // Recargar productos para actualizar el contexto
            await reloadProducts();
            showToast("Producto actualizado exitosamente", "success");
            navigate("/admin/products");
        } catch (err) {
            showToast("Error al actualizar el producto", "error");
        } finally {
            setIsSubmitting(false);
            setIsLoading(false);
        }
    };

    if (loading) {
        return <p>Cargando producto...</p>;
    }

    if (!product) {
        return <p>Producto no encontrado.</p>; // Seguridad por si acaso
    }

    return (
        <div>
            <h3 className="mb-4">Editar Producto: {product.name}</h3>
            <AdminProductForm
                initialData={product}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};