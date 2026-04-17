import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';

interface FormFields {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  age?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!fields.name.trim()) {
    errors.name = 'El nombre es obligatorio.';
  } else if (fields.name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres.';
  }

  if (!fields.email.trim()) {
    errors.email = 'El correo es obligatorio.';
  } else if (!EMAIL_REGEX.test(fields.email)) {
    errors.email = 'Ingresa un correo electrónico válido.';
  }

  if (!fields.password) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (fields.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres.';
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña.';
  } else if (fields.password !== fields.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  if (!fields.age.trim()) {
    errors.age = 'La edad es obligatoria.';
  } else if (isNaN(Number(fields.age)) || Number(fields.age) < 18 || Number(fields.age) > 120) {
    errors.age = 'Debes tener entre 18 y 120 años.';
  }

  return errors;
}

const INITIAL_FIELDS: FormFields = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: '',
};

export function ControlledFormPage() {
  const [fields, setFields] = useState<FormFields>(INITIAL_FIELDS);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate(fields);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
    }
  }

  function handleReset() {
    setFields(INITIAL_FIELDS);
    setErrors({});
    setSubmitted(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-blue-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.DASHBOARD} className="text-blue-600 hover:underline">Dashboard</Link>
            <Link to={appRoutes.FORMS_UNCONTROLLED} className="text-blue-600 hover:underline">Formulario No Controlado →</Link>
            <Link to={appRoutes.FORMS_HOOK_FORM} className="text-blue-600 hover:underline">React Hook Form →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">Formulario Controlado</h1>
          <p className="text-gray-500 text-sm mt-1">
            Cada campo está enlazado a un estado de React via <code className="bg-gray-100 px-1 rounded">useState</code>.
            Las validaciones se ejecutan al hacer submit.
          </p>
        </div>

        {/* Callout */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li>Cada <code className="bg-blue-100 px-1 rounded">input</code> tiene un <code className="bg-blue-100 px-1 rounded">value</code> y un <code className="bg-blue-100 px-1 rounded">onChange</code>.</li>
            <li>El estado se actualiza en cada cambio del usuario.</li>
            <li>Al hacer submit, la función <code className="bg-blue-100 px-1 rounded">validate()</code> revisa todos los campos.</li>
          </ul>
        </div>

        {/* Success */}
        {submitted ? (
          <div className="bg-green-50 border border-green-300 rounded-lg p-6 text-center">
            <p className="text-green-700 font-semibold text-lg">¡Formulario enviado con éxito! ✅</p>
            <p className="text-green-600 text-sm mt-1">Datos recibidos: <strong>{fields.name}</strong> ({fields.email})</p>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              Enviar otro
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={fields.name}
                onChange={handleChange}
                placeholder="Juan Pérez"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={fields.email}
                onChange={handleChange}
                placeholder="juan@ejemplo.com"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Edad
              </label>
              <input
                id="age"
                name="age"
                type="number"
                value={fields.age}
                onChange={handleChange}
                placeholder="25"
                min={18}
                max={120}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.age ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={fields.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={fields.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Enviar
            </button>
          </form>
        )}

        {/* State preview */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4 text-xs text-green-300 font-mono">
          <p className="text-gray-400 mb-2">// Estado actual del formulario (re-renderiza en cada cambio)</p>
          <pre>{JSON.stringify(fields, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
