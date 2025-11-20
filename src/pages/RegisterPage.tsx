import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { RegisterData } from '../types';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!form.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'El correo no es válido';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{9}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'El teléfono debe tener 9 dígitos';
    }

    if (!form.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (form.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
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
      const registerData: RegisterData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password
      };

      await register(registerData);

      // Redirigir según de dónde vino el usuario
      const from = (location.state as any)?.from || '/';
      navigate(from);
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || 'Error al crear la cuenta. Intenta nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-8 px-6 py-10 lg:grid-cols-2">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-dark-text">Crea tu cuenta China Wok</h1>
        <p className="mt-2 text-sm text-gray-600">
          Disfruta de beneficios exclusivos y guarda tus direcciones favoritas.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {errors.submit && (
            <div className="rounded-full bg-red-50 px-4 py-2 text-sm text-red-600">
              {errors.submit}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-dark-text" htmlFor="firstName">
                Nombre
              </label>
              <input
                id="firstName"
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className={`mt-1 w-full rounded-full border px-4 py-2 text-sm outline-none ${
                  errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                }`}
                placeholder="Tu nombre"
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-dark-text" htmlFor="lastName">
                Apellido
              </label>
              <input
                id="lastName"
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className={`mt-1 w-full rounded-full border px-4 py-2 text-sm outline-none ${
                  errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                }`}
                placeholder="Tu apellido"
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
            </div>
          </div>

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
            <label className="text-sm font-semibold text-dark-text" htmlFor="phone">
              Teléfono de contacto
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={`mt-1 w-full rounded-full border px-4 py-2 text-sm outline-none ${
                errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-primary'
              }`}
              placeholder="999 999 999"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-dark-text" htmlFor="password">
                Crea tu contraseña
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
            <div>
              <label className="text-sm font-semibold text-dark-text" htmlFor="confirmPassword">
                Confirma tu contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className={`mt-1 w-full rounded-full border px-4 py-2 text-sm outline-none ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                }`}
                placeholder="********"
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-gray-500">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1"
            />
            <p>
              Acepto la política de privacidad y autorizo el uso de mis datos para recibir promociones
              y novedades de China Wok.
            </p>
          </div>
          {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-secondary py-3 text-sm font-semibold text-white transition hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-secondary hover:text-primary">
              Inicia sesión
            </Link>
          </p>
        </form>
      </section>

      <aside className="rounded-3xl bg-secondary/10 p-8 text-secondary">
        <h2 className="text-2xl font-semibold">Beneficios de registrarte</h2>
        <ul className="mt-4 space-y-3 text-sm">
          <li>• Guarda tus direcciones favoritas y pídelo más rápido.</li>
          <li>• Accede a promociones exclusivas y preventas.</li>
          <li>• Haz seguimiento a tus pedidos en tiempo real.</li>
        </ul>
        <div className="mt-8 rounded-3xl bg-white p-6 text-dark-text shadow-sm">
          <h3 className="text-lg font-semibold">¿Prefieres pedir sin registrarte?</h3>
          <p className="mt-2 text-sm text-gray-600">
            Solo necesitaremos tus datos de contacto al finalizar la compra. ¡Así de fácil!
          </p>
        </div>
      </aside>
    </div>
  );
};

export default RegisterPage;
