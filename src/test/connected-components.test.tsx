/**
 * TEST SUITE 2: Connected Components (Redux)
 *
 * Los "connected components" son componentes que leen y escriben en el store
 * global de Redux. Para testearlos necesitamos:
 *
 *  1. Envolver el componente en un <Provider> con un store de prueba.
 *  2. Poder precargar el estado (preloadedState) para simular diferentes
 *     escenarios sin depender del estado por defecto.
 *  3. Verificar que el componente refleja el estado del store y que los
 *     dispatches producen los cambios esperados en la UI.
 *
 * Patrón: renderWithStore — factory helper que crea un store de prueba
 * y envuelve el componente en <Provider>. Reutilizable en todos los tests.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import userReducer, {
  logIn,
  logOut,
  setUserProfile,
  type UserProfile,
} from '@/redux/reducers/userReducer';
import inspectionReducer from '@/redux/reducers/inspectionReducer';

// ─── Tipo del store de prueba ────────────────────────────────────────────────
interface TestUserState {
  isLoggedIn: boolean;
  userProfile: UserProfile | null;
  rolePermissions: string | null;
}

interface TestPreloadedState {
  user?: TestUserState;
}

// ─── Helper: crea un store de prueba con estado precargado ───────────────────
function makeStore(preloadedState?: TestPreloadedState) {
  return configureStore({
    reducer: {
      user: userReducer,
      inspection: inspectionReducer,
    },
    preloadedState: preloadedState as Parameters<typeof configureStore>[0]['preloadedState'],
  });
}

type TestStoreState = ReturnType<ReturnType<typeof makeStore>['getState']>;

// ─── Helper: renderiza con Provider + store de prueba ─────────────────────────
function renderWithStore(ui: React.ReactElement, preloadedState?: TestPreloadedState) {
  const store = makeStore(preloadedState);
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return { ...render(ui, { wrapper: Wrapper }), store };
}

// ─── Componente bajo prueba: conectado a Redux ────────────────────────────────
function UserBadge() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((s: TestStoreState) => s.user.isLoggedIn);
  const userProfile = useSelector((s: TestStoreState) => s.user.userProfile);

  if (!isLoggedIn) {
    return (
      <div>
        <p data-testid="status">Sin sesión</p>
        <button onClick={() => dispatch(logIn())}>Iniciar sesión</button>
      </div>
    );
  }

  return (
    <div>
      <p data-testid="status">
        {userProfile ? `Hola, ${userProfile.nombre}` : 'Sesión activa'}
      </p>
      <button onClick={() => dispatch(logOut())}>Cerrar sesión</button>
    </div>
  );
}

// ─── Componente: muestra inspecciones del perfil de usuario ──────────────────
function UserRoleBadge() {
  const dispatch = useDispatch();
  const userProfile = useSelector((s: TestStoreState) => s.user.userProfile);

  const mockProfile: UserProfile = {
    id: 1,
    email: 'inspector@flota.com',
    nombre: 'Ana',
    apellido: 'Torres',
    roles: ['inspector', 'admin'],
  };

  return (
    <div>
      {userProfile ? (
        <ul data-testid="roles">
          {userProfile.roles.map((r: string) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      ) : (
        <button onClick={() => dispatch(setUserProfile(mockProfile))}>Cargar perfil</button>
      )}
    </div>
  );
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('Connected Components (Redux)', () => {
  // ── Lectura del estado ─────────────────────────────────────────────────────
  describe('UserBadge — refleja el estado del store', () => {
    it('muestra "Sesión activa" cuando isLoggedIn es true', () => {
      renderWithStore(<UserBadge />, {
        user: { isLoggedIn: true, userProfile: null, rolePermissions: null },
      });
      expect(screen.getByTestId('status')).toHaveTextContent('Sesión activa');
    });

    it('muestra "Sin sesión" cuando isLoggedIn es false', () => {
      renderWithStore(<UserBadge />, {
        user: { isLoggedIn: false, userProfile: null, rolePermissions: null },
      });
      expect(screen.getByTestId('status')).toHaveTextContent('Sin sesión');
    });

    it('muestra el nombre del usuario cuando hay perfil cargado', () => {
      renderWithStore(<UserBadge />, {
        user: {
          isLoggedIn: true,
          userProfile: {
            id: 42,
            email: 'juan@test.com',
            nombre: 'Juan',
            apellido: 'Pérez',
            roles: ['admin'],
          },
          rolePermissions: null,
        },
      });
      expect(screen.getByTestId('status')).toHaveTextContent('Hola, Juan');
    });
  });

  // ── Dispatching acciones ───────────────────────────────────────────────────
  describe('UserBadge — dispatches y cambios en la UI', () => {
    it('despacha logOut y actualiza la UI a "Sin sesión"', async () => {
      const user = userEvent.setup();
      renderWithStore(<UserBadge />, {
        user: { isLoggedIn: true, userProfile: null, rolePermissions: null },
      });
      await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
      expect(screen.getByTestId('status')).toHaveTextContent('Sin sesión');
    });

    it('despacha logIn desde estado desconectado y muestra "Sesión activa"', async () => {
      const user = userEvent.setup();
      renderWithStore(<UserBadge />, {
        user: { isLoggedIn: false, userProfile: null, rolePermissions: null },
      });
      await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
      expect(screen.getByTestId('status')).toHaveTextContent('Sesión activa');
    });
  });

  // ── Preloaded state con datos complejos ────────────────────────────────────
  describe('UserRoleBadge — carga perfil y muestra roles', () => {
    it('no muestra roles cuando no hay perfil', () => {
      renderWithStore(<UserRoleBadge />, {
        user: { isLoggedIn: true, userProfile: null, rolePermissions: null },
      });
      expect(screen.queryByTestId('roles')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cargar perfil' })).toBeInTheDocument();
    });

    it('despacha setUserProfile y renderiza los roles', async () => {
      const user = userEvent.setup();
      renderWithStore(<UserRoleBadge />, {
        user: { isLoggedIn: true, userProfile: null, rolePermissions: null },
      });
      await user.click(screen.getByRole('button', { name: 'Cargar perfil' }));
      expect(screen.getByTestId('roles')).toBeInTheDocument();
      expect(screen.getByText('inspector')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
    });

    it('muestra directamente los roles si el perfil viene en el preloadedState', () => {
      renderWithStore(<UserRoleBadge />, {
        user: {
          isLoggedIn: true,
          userProfile: {
            id: 1,
            email: 'ana@flota.com',
            nombre: 'Ana',
            apellido: 'Torres',
            roles: ['inspector', 'supervisor'],
          },
          rolePermissions: null,
        },
      });
      expect(screen.getByText('inspector')).toBeInTheDocument();
      expect(screen.getByText('supervisor')).toBeInTheDocument();
    });
  });
});
