import styled from "styled-components";

export const Hint = styled.div`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.success};
  animation: fadeIn 0.5s ease-out;
  margin: 0.5rem;
`;

export const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;