// src/pages/admin/AdminProductNew.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import type { Product } from "../../interfaces/product.interfaces";
import { createAdminProduct } from "../../actions/admin.actions";
import { AdminProductForm } from "./AdminProductForm.tsx";

export const AdminProductNew = () => {
    const navigate = useNavigate();
    const { setIsLoading, showToast, reloadProducts } = useApp();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData: Product) => {
        setIsSubmitting(true);
        setIsLoading(true);

        // Quitamos 'id' porque la acción lo genera
        const { id, ...productData } = formData;

        try {
            await createAdminProduct(productData);
            // Recargar productos para actualizar el contexto
            await reloadProducts();
            showToast("Producto creado exitosamente", "success");
            navigate("/admin/products");
        } catch (err: any) {
            const errorMessage = err.message || "Error al crear el producto";
            showToast(errorMessage, "error");
            console.error("Error detallado:", err);
        } finally {
            setIsSubmitting(false);
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h3 className="mb-4">Crear Nuevo Producto</h3>
            <AdminProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
    );
};