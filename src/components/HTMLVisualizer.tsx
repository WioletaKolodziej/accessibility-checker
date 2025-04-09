import React from "react";
import styled from "styled-components";
import { Hint, Label } from "./sharedStyles";


const PreviewContainer = styled.div`
  width: 100%;
  background-color: #fff;
  color: #000;
  border: 1px solid #ccc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  border-radius: 2px;
  overflow: auto;
`;

interface HTMLVisualizerProps {
  html: string;
}

const HTMLVisualizer: React.FC<HTMLVisualizerProps> = ({ html }) => {
  return (
    <div>
      <Hint>
      💡 The rendered HTML below reflects the markup you provided. It is displayed as it would be rendered by a browser.
      </Hint>
      <Label>HTML Preview</Label>
      <PreviewContainer>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </PreviewContainer>
    </div>
  );
};

export default HTMLVisualizer;
