// src/pages/admin/AdminProductNew.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import type { Product } from "../../interfaces/product.interfaces";
import { createAdminProduct } from "../../actions/admin.actions";
import { AdminProductForm } from "./AdminProductForm.tsx";

export const AdminProductNew = () => {
    const navigate = useNavigate();
    const { setIsLoading, showToast } = useApp();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData: Product) => {
        setIsSubmitting(true);
        setIsLoading(true);

        // Quitamos 'id' porque la acción lo genera
        const { id, ...productData } = formData;
        
        // Limpiar campos opcionales que no deben enviarse si están vacíos
        const cleanProductData: any = { ...productData };
        
        // Si no está en oferta, eliminar el campo offer
        if (!cleanProductData.isOnSale || !cleanProductData.offer || cleanProductData.offer.discount <= 0) {
          delete cleanProductData.offer;
          cleanProductData.isOnSale = false;
        }

        try {
            await createAdminProduct(cleanProductData);
            showToast("Producto creado exitosamente", "success");
            navigate("/admin/products");
        } catch (err) {
            showToast("Error al crear el producto", "error");
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