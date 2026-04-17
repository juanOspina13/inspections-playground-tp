import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logIn, logOut, setUserProfile, type UserProfile } from '@/redux/reducers/userReducer';
import { setSelectedInspection } from '@/redux/reducers/inspectionReducer';
import { mockInspections } from '@/data/mockData';

const sampleProfiles: UserProfile[] = [
  { id: 1, email: 'carlos@inspections.com', nombre: 'Carlos', apellido: 'Méndez', roles: ['ROLE_ADMIN', 'ROLE_INSPECTOR'] },
  { id: 2, email: 'ana@inspections.com', nombre: 'Ana', apellido: 'García', roles: ['ROLE_INSPECTOR'] },
  { id: 3, email: 'roberto@inspections.com', nombre: 'Roberto', apellido: 'Silva', roles: ['ROLE_VIEWER'] },
];

export function ReduxPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const inspection = useAppSelector((state) => state.inspection);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-blue-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.CONCEPTS_CUSTOM_HOOKS} className="text-blue-600 hover:underline">← Custom Hooks</Link>
            <Link to={appRoutes.CONCEPTS_STYLED_COMPONENTS} className="text-blue-600 hover:underline">styled-components →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">Redux Toolkit</h1>
          <p className="text-gray-500 text-sm mt-1">
            <code className="bg-gray-100 px-1 rounded">Redux Toolkit</code> es la forma moderna de usar Redux:
            estado global compartido entre cualquier componente con <code className="bg-gray-100 px-1 rounded">createSlice</code>,
            <code className="bg-gray-100 px-1 rounded">configureStore</code>, y hooks tipados.
          </p>
        </div>

        {/* Callout */}
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-6 text-sm text-violet-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li><code className="bg-violet-100 px-1 rounded">configureStore</code> crea el store combinando múltiples slices.</li>
            <li><code className="bg-violet-100 px-1 rounded">createSlice</code> define estado inicial, reducers y acciones en un solo lugar.</li>
            <li><code className="bg-violet-100 px-1 rounded">useAppDispatch()</code> retorna un dispatch tipado para enviar acciones.</li>
            <li><code className="bg-violet-100 px-1 rounded">useAppSelector(selector)</code> lee datos del store con tipado completo.</li>
            <li>Redux Toolkit usa <strong>Immer</strong> internamente: se puede "mutar" el estado directamente en los reducers.</li>
            <li>A diferencia de Context API, Redux es ideal para <strong>estado global</strong> compartido entre muchas partes de la app.</li>
          </ul>
        </div>

        {/* Code preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-violet-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver código del slice y store ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`// userReducer.ts
const userSlice = createSlice({
  name: 'user',
  initialState: { isLoggedIn: false, userProfile: null },
  reducers: {
    logIn(state) {
      state.isLoggedIn = true;  // ← Immer permite "mutación"
    },
    logOut(state) {
      state.isLoggedIn = false;
      state.userProfile = null;
    },
    setUserProfile(state, action: PayloadAction<UserProfile>) {
      state.userProfile = action.payload;
    },
  },
});

// store.ts
export const store = configureStore({
  reducer: {
    user: userReducer,
    inspection: inspectionReducer,
  },
});

// Hooks tipados
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Uso en componente:
const dispatch = useAppDispatch();
const user = useAppSelector(state => state.user);
dispatch(logIn());
dispatch(setUserProfile({ id: 1, nombre: 'Carlos', ... }));`}</pre>
        </details>

        {/* Estado actual del store */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Estado actual del Store</h2>
          <p className="text-sm text-gray-500 mb-4">
            <code className="bg-gray-100 px-1 rounded">useAppSelector</code> lee en tiempo real del store global.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">user slice:</h3>
              <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                <pre className="text-gray-700">{JSON.stringify(user, null, 2)}</pre>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">inspection slice:</h3>
              <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                <pre className="text-gray-700">
                  {JSON.stringify({
                    selectedInspection: inspection.selectedInspection
                      ? { id: inspection.selectedInspection.id, placa: inspection.selectedInspection.placa }
                      : null,
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones: User Slice */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Acciones: User Slice</h2>
          <p className="text-sm text-gray-500 mb-4">
            Cada botón hace <code className="bg-gray-100 px-1 rounded">dispatch(action)</code> que actualiza el store global.
          </p>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600 min-w-[80px] py-2">Sesión:</span>
              <button
                onClick={() => dispatch(logIn())}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                logIn()
              </button>
              <button
                onClick={() => dispatch(logOut())}
                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
              >
                logOut()
              </button>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600 block mb-2">Perfil:</span>
              <div className="flex flex-wrap gap-2">
                {sampleProfiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => dispatch(setUserProfile(profile))}
                    className="px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 text-sm"
                  >
                    {profile.nombre} {profile.apellido}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
            <p>
              Estado de sesión: {' '}
              <strong className={user.isLoggedIn ? 'text-green-600' : 'text-red-500'}>
                {user.isLoggedIn ? '✓ Conectado' : '✗ Desconectado'}
              </strong>
            </p>
            {user.userProfile && (
              <p className="mt-1">
                Perfil: <strong>{user.userProfile.nombre} {user.userProfile.apellido}</strong> — {user.userProfile.roles.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Acciones: Inspection Slice */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Acciones: Inspection Slice</h2>
          <p className="text-sm text-gray-500 mb-4">
            Selecciona una inspección para guardarla en el store global.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {mockInspections.slice(0, 5).map((insp) => (
              <button
                key={insp.id}
                onClick={() => dispatch(setSelectedInspection(insp))}
                className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                  inspection.selectedInspection?.id === insp.id
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {insp.id} — {insp.placa}
              </button>
            ))}
            <button
              onClick={() => dispatch(setSelectedInspection(null))}
              className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 text-sm"
            >
              Limpiar
            </button>
          </div>
          {inspection.selectedInspection && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p><strong>{inspection.selectedInspection.id}</strong> — {inspection.selectedInspection.marca} {inspection.selectedInspection.modelo}</p>
              <p className="text-gray-500">Placa: {inspection.selectedInspection.placa} | Inspector: {inspection.selectedInspection.inspector}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
