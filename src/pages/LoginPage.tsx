import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { LoginCredentials } from '../types';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState<LoginCredentials>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'El correo no es válido';
    }

    if (!form.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(form);

      // Redirigir según de dónde vino el usuario
      const from = (location.state as any)?.from || '/';
      navigate(from);
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || 'Credenciales inválidas. Verifica tu correo y contraseña.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-dark-text">Inicia sesión</h1>
        <p className="mt-2 text-sm text-gray-600">
          Accede a tu cuenta para continuar con tu pedido
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {errors.submit && (
            <div className="rounded-full bg-red-50 px-4 py-2 text-sm text-red-600">
              {errors.submit}
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-dark-text" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`mt-1 w-full rounded-full border px-4 py-2 text-sm outline-none ${
                errors.email ? 'border-red-500' : 'border-gray-200 focus:border-primary'
              }`}
              placeholder="nombre@correo.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-dark-text" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`mt-1 w-full rounded-full border px-4 py-2 text-sm outline-none ${
                errors.password ? 'border-red-500' : 'border-gray-200 focus:border-primary'
              }`}
              placeholder="********"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-secondary py-3 text-sm font-semibold text-white transition hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="font-semibold text-secondary hover:text-primary">
              Regístrate aquí
            </Link>
          </p>
        </form>

        <div className="mt-6 rounded-2xl bg-secondary/10 p-4">
          <p className="text-center text-xs text-gray-600">
            Para testing, usa cualquier correo y contraseña (mínimo 6 caracteres)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
