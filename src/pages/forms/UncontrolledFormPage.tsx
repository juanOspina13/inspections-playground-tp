import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  age?: string;
}

interface SubmittedData {
  name: string;
  email: string;
  age: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function UncontrolledFormPage() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const name = nameRef.current?.value ?? '';
    const email = emailRef.current?.value ?? '';
    const password = passwordRef.current?.value ?? '';
    const confirmPassword = confirmPasswordRef.current?.value ?? '';
    const age = ageRef.current?.value ?? '';

    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'El nombre es obligatorio.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres.';
    }

    if (!email.trim()) {
      newErrors.email = 'El correo es obligatorio.';
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (!age.trim()) {
      newErrors.age = 'La edad es obligatoria.';
    } else if (isNaN(Number(age)) || Number(age) < 18 || Number(age) > 120) {
      newErrors.age = 'Debes tener entre 18 y 120 años.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmittedData({ name, email, age });
      e.currentTarget.dispatchEvent(new Event('reset', { bubbles: true }));
    }
  }

  function handleReset() {
    setErrors({});
    setSubmittedData(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.DASHBOARD} className="text-blue-600 hover:underline">← Dashboard</Link>
            <Link to={appRoutes.FORMS_CONTROLLED} className="text-blue-600 hover:underline">← Controlado</Link>
            <Link to={appRoutes.FORMS_HOOK_FORM} className="text-blue-600 hover:underline">React Hook Form →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">Formulario No Controlado</h1>
          <p className="text-gray-500 text-sm mt-1">
            Los valores se leen directamente del DOM usando <code className="bg-gray-100 px-1 rounded">useRef</code>.
            React no controla el estado del input; la validación ocurre solo al hacer submit.
          </p>
        </div>

        {/* Callout */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li>Los inputs <strong>no</strong> tienen atributo <code className="bg-amber-100 px-1 rounded">value</code> ni <code className="bg-amber-100 px-1 rounded">onChange</code>.</li>
            <li>Cada <code className="bg-amber-100 px-1 rounded">useRef</code> apunta al nodo del DOM directamente.</li>
            <li>Al hacer submit, se leen los <code className="bg-amber-100 px-1 rounded">.current.value</code> para validar.</li>
            <li>No hay re-renders mientras el usuario escribe.</li>
          </ul>
        </div>

        {/* Success */}
        {submittedData ? (
          <div className="bg-green-50 border border-green-300 rounded-lg p-6 text-center">
            <p className="text-green-700 font-semibold text-lg">¡Formulario enviado con éxito! ✅</p>
            <p className="text-green-600 text-sm mt-1">
              Datos recibidos: <strong>{submittedData.name}</strong> ({submittedData.email})
            </p>
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
                ref={nameRef}
                type="text"
                defaultValue=""
                placeholder="Juan Pérez"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
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
                ref={emailRef}
                type="email"
                defaultValue=""
                placeholder="juan@ejemplo.com"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
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
                ref={ageRef}
                type="number"
                defaultValue=""
                placeholder="25"
                min={18}
                max={120}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
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
                ref={passwordRef}
                type="password"
                defaultValue=""
                placeholder="Mínimo 8 caracteres"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
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
                ref={confirmPasswordRef}
                type="password"
                defaultValue=""
                placeholder="Repite tu contraseña"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              Enviar
            </button>
          </form>
        )}

        {/* Key difference note */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4 text-xs text-amber-300 font-mono">
          <p className="text-gray-400 mb-2">// Los refs no causan re-renders al cambiar</p>
          <pre>{`// Acceso al DOM al hacer submit:
const name = nameRef.current?.value;
const email = emailRef.current?.value;
// React no "ve" estos cambios hasta el submit`}</pre>
        </div>
      </div>
    </div>
  );
}
