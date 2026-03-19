import styled from 'styled-components';

export const SecondaryButton = styled.button`
  padding: 6px 14px;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid var(--gray-300);
  background: #fff;
  color: var(--gray-700);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: var(--gray-100);
    border-color: var(--gray-400);
  }

  &:active:not(:disabled) {
    background: var(--gray-200);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
