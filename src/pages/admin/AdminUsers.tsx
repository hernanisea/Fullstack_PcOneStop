import { useState, useEffect } from "react";
import type { User } from "../../interfaces/user.interfaces";
import { getAdminUsers } from "../../actions/admin.actions";

export const AdminUsers = () => {
  const [users, setUsers] = useState<Omit<User, 'password'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // <-- Estado de error

  useEffect(() => {
    getAdminUsers()
      .then(setUsers)
      .catch((err) => {
        console.error("Error al cargar usuarios:", err);
        setError("No se pudieron cargar los usuarios.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h3 className="mb-4">Usuarios Registrados ({users.length})</h3>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : error ? ( // <-- Si hay un error, lo mostramos
            <div className="alert alert-danger">{error}</div>
          ) : (
            // Si no hay carga ni error, mostramos la tabla
            <div className="table-responsive">
              <table className="table admin-table align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.firstName || user.name || ""} {user.lastName || ""}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'ADMIN' ? 'bg-success' : 'bg-secondary'}`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};