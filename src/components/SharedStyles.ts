import styled from "styled-components";

export const Hint = styled.p`
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceElevated};
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.94rem;
`;

export const Label = styled.label`
  display: inline-block;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;
