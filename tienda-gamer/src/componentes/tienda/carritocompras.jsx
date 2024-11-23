// src/componentes/tienda/CarritoCompras.jsx
import { useState } from 'react';
import { useCart } from '../../contexts/carrito';
import Swal from 'sweetalert2';
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function CarritoCompras({ visible, onClose }) {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    getTotal,
    clearCart 
  } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = async () => {
    const result = await Swal.fire({
      title: 'Confirmar compra',
      text: `Total a pagar: ${formatPrice(getTotal())}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar Compra',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      // Aquí iría la lógica de procesamiento de pago
      await Swal.fire({
        title: '¡Compra exitosa!',
        text: 'Gracias por tu compra',
        icon: 'success'
      });
      clearCart();
      onClose();
    }
  };

  const handleRemoveItem = async (item) => {
    const result = await Swal.fire({
      title: '¿Eliminar item?',
      text: `¿Deseas eliminar ${item.titulo} del carrito?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      removeFromCart(item.id);
    }
  };

  return (
    <div 
      className={`fixed right-0 top-0 h-screen w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        visible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="bg-primario text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Carrito de Compras</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-primario/80 rounded-full transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Lista de items */}
      <div className="p-4 overflow-y-auto h-[calc(100vh-180px)]">
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg mb-2">Tu carrito está vacío</p>
            <p className="text-sm">¡Agrega algunos juegos geniales!</p>
          </div>
        ) : (
          cart.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg"
            >
              <img
                src={item.imagen}
                alt={item.titulo}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-800">{item.titulo}</h3>
                <p className="text-primario font-bold">
                  {formatPrice(item.precio)}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                    disabled={item.quantity <= 1}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleRemoveItem(item)}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer con total y botón de checkout */}
      {cart.length > 0 && (
        <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium">Total:</span>
            <span className="text-xl font-bold text-primario">
              {formatPrice(getTotal())}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-primario text-white py-3 rounded-lg hover:bg-primario/90 transition-colors font-medium"
          >
            Proceder al Pago
          </button>
        </div>
      )}
    </div>
  );
}