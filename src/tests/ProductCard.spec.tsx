import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../pages/shared/ProductCard'; 
import * as AppContext from '../context/AppContext'; 
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockProduct = {
  id: '1',
  name: 'Producto Test',
  category: 'CPU',
  brand: 'Intel',
  price: 1000,
  stock: 5,
  image: 'test.jpg',
  isOnSale: false,
  description: 'Desc'
};

describe('ProductCard Component', () => {
  let addToCartMock: any;

  beforeEach(() => {
    addToCartMock = vi.fn();
    vi.spyOn(AppContext, 'useApp').mockReturnValue({
      addToCart: addToCartMock,
      user: null,
      cart: [],
      products: [],
      setUser: vi.fn(),
      removeFromCart: vi.fn(),
      updateQty: vi.fn(),
      clearCart: vi.fn(),
      removeOutOfStockItems: vi.fn(),
      cartTotal: 0,
      toast: null,
      showToast: vi.fn(),
      hideToast: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
      reloadProducts: vi.fn()
    });
  });

  it('IE2.1.2 - Debería renderizar correctamente las propiedades del producto', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    expect(screen.getByText('Producto Test')).toBeInTheDocument();
  });

  it('IE2.2.1 - Debería llamar a la función addToCart al hacer clic', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    const button = screen.getByText('Agregar');
    fireEvent.click(button);
    expect(addToCartMock).toHaveBeenCalled();
  });
});