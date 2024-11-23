// src/paginas/Perfil.jsx
import { useState } from 'react';
import { useAuth } from '../contexts/authcontext';
import Swal from 'sweetalert2';

export default function Perfil() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Validar contraseña actual
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = users.find(u => u.id === user.id);

    if (currentUser.password !== formData.currentPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña actual es incorrecta'
      });
      return;
    }

    // Validar nueva contraseña si se está cambiando
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Las nuevas contraseñas no coinciden'
        });
        return;
      }
    }

    // Actualizar usuario en localStorage
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return {
          ...u,
          nombre: formData.nombre,
          password: formData.newPassword || u.password
        };
      }
      return u;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Actualizar sesión actual
    const updatedUser = {
      ...user,
      nombre: formData.nombre
    };
    localStorage.setItem('login_success', JSON.stringify(updatedUser));

    await Swal.fire({
      icon: 'success',
      title: '¡Perfil actualizado!',
      text: 'Los cambios se han guardado correctamente'
    });

    setIsEditing(false);
    window.location.reload(); // Recargar para actualizar los datos en el header
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar cuenta?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar cuenta',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626'
    });

    if (result.isConfirmed) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = users.filter(u => u.id !== user.id);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      await logout();
      
      await Swal.fire({
        icon: 'success',
        title: 'Cuenta eliminada',
        text: 'Tu cuenta ha sido eliminada correctamente'
      });
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-primario hover:text-primario/80 font-medium"
              >
                Editar Perfil
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primario focus:border-primario"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50"
                    value={formData.email}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contraseña actual
                  </label>
                  <input
                    type="password"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primario focus:border-primario"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nueva contraseña (opcional)
                  </label>
                  <input
                    type="password"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primario focus:border-primario"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    type="password"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primario focus:border-primario"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-primario text-white py-2 px-4 rounded-md hover:bg-primario/90 transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Nombre</h2>
                <p className="mt-1 text-lg text-gray-900">{user?.nombre}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Email</h2>
                <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
              </div>
            </div>
          )}

          {!isEditing && (
            <div className="mt-8 pt-6 border-t">
              <button
                onClick={handleDeleteAccount}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Eliminar cuenta
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}