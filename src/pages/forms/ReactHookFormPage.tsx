import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';

// ─── Zod Schema ──────────────────────────────────────────────────────────────
const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'El nombre es obligatorio.')
      .min(2, 'El nombre debe tener al menos 2 caracteres.')
      .max(60, 'El nombre no puede superar 60 caracteres.'),
    email: z
      .string()
      .min(1, 'El correo es obligatorio.')
      .email('Ingresa un correo electrónico válido.'),
    age: z
      .number({ message: 'La edad debe ser un número.' })
      .min(18, 'Debes tener al menos 18 años.')
      .max(120, 'Edad no válida.'),
    role: z.enum(['admin', 'inspector', 'viewer'] as const, {
      message: 'Selecciona un rol válido.',
    }),
    password: z
      .string()
      .min(1, 'La contraseña es obligatoria.')
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula.')
      .regex(/[0-9]/, 'Debe contener al menos un número.'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña.'),
    acceptTerms: z.literal(true, {
      message: 'Debes aceptar los términos y condiciones.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden.',
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// ─── Helper component ─────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1">{message}</p>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function ReactHookFormPage() {
  const [submittedData, setSubmittedData] = useState<RegisterFormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      role: undefined,
      password: '',
      confirmPassword: '',
      acceptTerms: undefined,
    },
  });

  function onSubmit(data: RegisterFormData) {
    setSubmittedData(data);
  }

  function handleReset() {
    reset();
    setSubmittedData(null);
  }

  const inputBase =
    'w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500';
  const inputError = 'border-red-400 bg-red-50';
  const inputNormal = 'border-gray-300';

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.DASHBOARD} className="text-blue-600 hover:underline">← Dashboard</Link>
            <Link to={appRoutes.FORMS_CONTROLLED} className="text-blue-600 hover:underline">← Controlado</Link>
            <Link to={appRoutes.FORMS_UNCONTROLLED} className="text-blue-600 hover:underline">← No Controlado</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">React Hook Form + Zod</h1>
          <p className="text-gray-500 text-sm mt-1">
            <code className="bg-gray-100 px-1 rounded">react-hook-form</code> maneja el estado del formulario
            con re-renders mínimos. <code className="bg-gray-100 px-1 rounded">zod</code> define el esquema
            de validación con tipado completo.
          </p>
        </div>

        {/* Callout */}
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-6 text-sm text-violet-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li><code className="bg-violet-100 px-1 rounded">zodResolver</code> conecta el schema con <code className="bg-violet-100 px-1 rounded">useForm</code>.</li>
            <li><code className="bg-violet-100 px-1 rounded">register()</code> registra el input sin necesitar <code className="bg-violet-100 px-1 rounded">onChange</code> manual.</li>
            <li><code className="bg-violet-100 px-1 rounded">handleSubmit</code> valida antes de llamar <code className="bg-violet-100 px-1 rounded">onSubmit</code>.</li>
            <li>Los errores aparecen en <code className="bg-violet-100 px-1 rounded">formState.errors</code> con mensajes del schema Zod.</li>
            <li>El refinement <code className="bg-violet-100 px-1 rounded">.refine()</code> valida que las contraseñas coincidan.</li>
          </ul>
        </div>

        {/* Zod Schema preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-violet-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver schema de Zod ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  age: z.number().min(18).max(120),
  role: z.enum(['admin', 'inspector', 'viewer']),
  password: z.string().min(8)
    .regex(/[A-Z]/, 'Debe tener mayúscula')
    .regex(/[0-9]/, 'Debe tener número'),
  confirmPassword: z.string(),
  acceptTerms: z.literal(true),
}).refine(
  (d) => d.password === d.confirmPassword,
  { path: ['confirmPassword'], message: '...' }
);`}</pre>
        </details>

        {/* Success */}
        {submittedData ? (
          <div className="bg-green-50 border border-green-300 rounded-lg p-6 text-center">
            <p className="text-green-700 font-semibold text-lg">¡Registro exitoso! ✅</p>
            <p className="text-green-600 text-sm mt-1">
              Bienvenido <strong>{submittedData.name}</strong> con rol <strong>{submittedData.role}</strong>.
            </p>
            <pre className="mt-3 text-left text-xs bg-green-100 p-3 rounded text-green-800 overflow-x-auto">
              {JSON.stringify({ name: submittedData.name, email: submittedData.email, age: submittedData.age, role: submittedData.role }, null, 2)}
            </pre>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              Registrar otro
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="rhf-name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                id="rhf-name"
                type="text"
                placeholder="Juan Pérez"
                {...register('name')}
                className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
              />
              <FieldError message={errors.name?.message} />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="rhf-email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="rhf-email"
                type="email"
                placeholder="juan@ejemplo.com"
                {...register('email')}
                className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
              />
              <FieldError message={errors.email?.message} />
            </div>

            {/* Age */}
            <div>
              <label htmlFor="rhf-age" className="block text-sm font-medium text-gray-700 mb-1">
                Edad
              </label>
              <input
                id="rhf-age"
                type="number"
                placeholder="25"
                {...register('age', { valueAsNumber: true })}
                className={`${inputBase} ${errors.age ? inputError : inputNormal}`}
              />
              <FieldError message={errors.age?.message} />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="rhf-role" className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                id="rhf-role"
                {...register('role')}
                className={`${inputBase} ${errors.role ? inputError : inputNormal}`}
              >
                <option value="">Selecciona un rol...</option>
                <option value="admin">Administrador</option>
                <option value="inspector">Inspector</option>
                <option value="viewer">Visualizador</option>
              </select>
              <FieldError message={errors.role?.message} />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="rhf-password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="rhf-password"
                type="password"
                placeholder="Mín. 8 chars, 1 mayúscula, 1 número"
                {...register('password')}
                className={`${inputBase} ${errors.password ? inputError : inputNormal}`}
              />
              <FieldError message={errors.password?.message} />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="rhf-confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <input
                id="rhf-confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                {...register('confirmPassword')}
                className={`${inputBase} ${errors.confirmPassword ? inputError : inputNormal}`}
              />
              <FieldError message={errors.confirmPassword?.message} />
            </div>

            {/* Accept Terms */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('acceptTerms')}
                  className="mt-0.5 h-4 w-4 accent-violet-600"
                />
                <span className="text-sm text-gray-600">
                  Acepto los términos y condiciones
                </span>
              </label>
              <FieldError message={errors.acceptTerms?.message} />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Registrarse'}
            </button>

            {isDirty && (
              <button
                type="button"
                onClick={() => reset()}
                className="w-full py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Limpiar formulario
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
