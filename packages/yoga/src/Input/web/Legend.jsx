import React from 'react';
import styled from 'styled-components';
import { node } from 'prop-types';

const StyledLegend = styled.legend`
  position: relative;
  padding: 0;
  max-width: 0;
  width: auto;
  height: 0;
  visibility: hidden;
  transition-property: max-width, padding;

  ${({
    theme: {
      yoga: {
        baseFont,
        components: { input },
      },
    },
  }) => `
    font-family: ${baseFont.family};
    font-size: ${input.label.font.size.typed}px;
    font-weight: ${input.label.font.weight};
    line-height: ${input.label.font.lineHeight.typed}px;
    letter-spacing: normal;

    transition-duration: 100ms;
  `}
`;

const HiddenSpan = styled.span`
  ${({
    theme: {
      yoga: {
        components: { input },
      },
    },
  }) => `
    padding-left: ${input.label.padding.left}px;
    padding-right: ${input.label.padding.right}px;
  `}
`;

const Legend = React.forwardRef(({ children, ...props }, ref) => (
  <StyledLegend ref={ref} {...props}>
    <HiddenSpan>{children}</HiddenSpan>
  </StyledLegend>
));

Legend.propTypes = {
  children: node.isRequired,
};

export default Legend;
