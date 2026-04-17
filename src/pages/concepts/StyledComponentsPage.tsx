import { useState } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';
import styled, { css } from 'styled-components';

// ─── Styled Components ────────────────────────────────────────────────────────

// 1. Componente básico
const StyledCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

// 2. Componente con props dinámicas
interface ButtonProps {
  $variant?: 'primary' | 'secondary' | 'danger';
  $size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary: css`
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
    &:hover:not(:disabled) { background: #2563eb; }
  `,
  secondary: css`
    background: white;
    color: #374151;
    border-color: #d1d5db;
    &:hover:not(:disabled) { background: #f3f4f6; }
  `,
  danger: css`
    background: #ef4444;
    color: white;
    border-color: #ef4444;
    &:hover:not(:disabled) { background: #dc2626; }
  `,
};

const sizeStyles = {
  sm: css`padding: 4px 12px; font-size: 0.75rem;`,
  md: css`padding: 8px 16px; font-size: 0.875rem;`,
  lg: css`padding: 12px 24px; font-size: 1rem;`,
};

const StyledButton = styled.button<ButtonProps>`
  border-radius: 8px;
  border: 1px solid;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  ${({ $variant = 'primary' }) => variantStyles[$variant]}
  ${({ $size = 'md' }) => sizeStyles[$size]}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// 3. Componente que extiende otro
const PillButton = styled(StyledButton)`
  border-radius: 9999px;
`;

// 4. Componente con animación
const PulseIndicator = styled.span<{ $active: boolean }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? '#22c55e' : '#d1d5db')};
  transition: background 0.3s ease;

  ${({ $active }) =>
    $active &&
    css`
      animation: pulse 1.5s infinite;
    `}

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.7; }
  }
`;

// 5. Badge con tema dinámico
interface BadgeProps {
  $color: 'green' | 'red' | 'yellow' | 'blue';
}

const colorMap = {
  green: { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
  red: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
  yellow: { bg: '#fefce8', text: '#854d0e', border: '#fef08a' },
  blue: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
};

const StatusBadge = styled.span<BadgeProps>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $color }) => colorMap[$color].bg};
  color: ${({ $color }) => colorMap[$color].text};
  border: 1px solid ${({ $color }) => colorMap[$color].border};
`;

export function StyledComponentsPage() {
  const [isActive, setIsActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-blue-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.CONCEPTS_REDUX} className="text-blue-600 hover:underline">← Redux Toolkit</Link>
            <Link to={appRoutes.FORMS_CONTROLLED} className="text-blue-600 hover:underline">Formularios →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">styled-components</h1>
          <p className="text-gray-500 text-sm mt-1">
            <code className="bg-gray-100 px-1 rounded">styled-components</code> es una librería de CSS-in-JS
            que permite escribir CSS real dentro de componentes React usando template literals.
          </p>
        </div>

        {/* Callout */}
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6 text-sm text-rose-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li><code className="bg-rose-100 px-1 rounded">styled.div`...`</code> crea un componente React con estilos encapsulados.</li>
            <li>Los props con prefijo <code className="bg-rose-100 px-1 rounded">$</code> (transient props) controlan estilos sin pasar al DOM.</li>
            <li><code className="bg-rose-100 px-1 rounded">styled(OtroComponente)</code> extiende un componente existente.</li>
            <li>Se puede usar <code className="bg-rose-100 px-1 rounded">css</code> helper para crear bloques de estilos reutilizables.</li>
            <li>Los estilos se generan en tiempo de ejecución y se inyectan en el <code className="bg-rose-100 px-1 rounded">&lt;head&gt;</code>.</li>
            <li>Soporta animaciones con <code className="bg-rose-100 px-1 rounded">@keyframes</code>, pseudo-selectores, media queries, etc.</li>
          </ul>
        </div>

        {/* Code preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-rose-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver código de los styled components ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`// Componente básico
const StyledCard = styled.div\`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
\`;

// Props dinámicas ($ = transient prop, no llega al DOM)
const StyledButton = styled.button<{ $variant: 'primary' | 'danger' }>\`
  background: \${({ $variant }) =>
    $variant === 'primary' ? '#3b82f6' : '#ef4444'};
  color: white;
\`;

// Extender otro componente
const PillButton = styled(StyledButton)\`
  border-radius: 9999px;
\`;

// Animación
const PulseIndicator = styled.span<{ $active: boolean }>\`
  animation: \${({ $active }) => $active ? 'pulse 1.5s infinite' : 'none'};
  @keyframes pulse {
    50% { transform: scale(1.4); opacity: 0.7; }
  }
\`;`}</pre>
        </details>

        {/* Demo 1: Botones con variantes */}
        <StyledCard>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Botones con props dinámicas</h2>
          <p className="text-sm text-gray-500 mb-4">
            El prop <code className="bg-gray-100 px-1 rounded">$variant</code> y <code className="bg-gray-100 px-1 rounded">$size</code> cambian los estilos del botón.
          </p>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 min-w-[80px]">Variantes:</span>
              <StyledButton $variant="primary" onClick={() => setClickCount((p) => p + 1)}>Primary</StyledButton>
              <StyledButton $variant="secondary" onClick={() => setClickCount((p) => p + 1)}>Secondary</StyledButton>
              <StyledButton $variant="danger" onClick={() => setClickCount((p) => p + 1)}>Danger</StyledButton>
              <StyledButton $variant="primary" disabled>Disabled</StyledButton>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 min-w-[80px]">Tamaños:</span>
              <StyledButton $variant="primary" $size="sm">Small</StyledButton>
              <StyledButton $variant="primary" $size="md">Medium</StyledButton>
              <StyledButton $variant="primary" $size="lg">Large</StyledButton>
            </div>
            <p className="text-xs text-gray-400">Clicks totales: {clickCount}</p>
          </div>
        </StyledCard>

        {/* Demo 2: Extensión */}
        <StyledCard>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Extensión de componentes</h2>
          <p className="text-sm text-gray-500 mb-4">
            <code className="bg-gray-100 px-1 rounded">PillButton</code> extiende <code className="bg-gray-100 px-1 rounded">StyledButton</code>
            agregando <code className="bg-gray-100 px-1 rounded">border-radius: 9999px</code>.
          </p>
          <div className="flex flex-wrap gap-2">
            <StyledButton $variant="primary">Normal</StyledButton>
            <PillButton $variant="primary">Pill</PillButton>
            <PillButton $variant="danger">Pill Danger</PillButton>
            <PillButton $variant="secondary">Pill Secondary</PillButton>
          </div>
        </StyledCard>

        {/* Demo 3: Animación */}
        <StyledCard>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Animaciones y estado</h2>
          <p className="text-sm text-gray-500 mb-4">
            El indicador tiene una animación <code className="bg-gray-100 px-1 rounded">pulse</code>
            condicional basada en el prop <code className="bg-gray-100 px-1 rounded">$active</code>.
          </p>
          <div className="flex items-center gap-4">
            <PulseIndicator $active={isActive} />
            <span className="text-sm text-gray-600">
              {isActive ? 'Activo (animando)' : 'Inactivo'}
            </span>
            <StyledButton $variant="secondary" $size="sm" onClick={() => setIsActive((p) => !p)}>
              Toggle
            </StyledButton>
          </div>
        </StyledCard>

        {/* Demo 4: Badges */}
        <StyledCard>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Badges con colores dinámicos</h2>
          <p className="text-sm text-gray-500 mb-4">
            El prop <code className="bg-gray-100 px-1 rounded">$color</code> selecciona un esquema de colores
            de un mapa predefinido.
          </p>
          <div className="flex flex-wrap gap-2">
            <StatusBadge $color="green">Aprobada</StatusBadge>
            <StatusBadge $color="red">Rechazada</StatusBadge>
            <StatusBadge $color="yellow">Pendiente</StatusBadge>
            <StatusBadge $color="blue">En Progreso</StatusBadge>
          </div>
        </StyledCard>
      </div>
    </div>
  );
}
