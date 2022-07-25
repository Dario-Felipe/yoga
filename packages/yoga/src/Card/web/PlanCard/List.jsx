import React, { isValidElement } from 'react';
import styled, { css, withTheme } from 'styled-components';
import { string, node, shape, oneOfType, func } from 'prop-types';

import Text from '../../../Text';
import theme from '../../../Theme/helpers/themeReader';

const { card, cardweb } = theme.components;

const truncateStyle = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const List = styled.ul`
  margin: ${cardweb.plan.list.margin.top}px 0 0;
  padding: 0;

  list-style: none;
`;

const IconWrapper = styled.div`
  display: flex;
  margin-right: ${cardweb.plan.list.item.icon.margin.right}px;
`;

const Item = styled.li`
  margin-bottom: ${card.plan.list.item.margin.bottom}px;
`;

const Wrapper = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;

  svg {
    flex-shrink: 0;
  }
`;

const ItemText = styled(Text.Small)`
  display: inline-block;
  height: 100%;
  vertical-align: middle;

  color: ${card.plan.list.item.font.color};

  ${truncateStyle}
`;

const Button = styled.button`
  display: block;
  padding: 0;
  margin-top: ${card.plan.list.button.margin.top}px;

  width: 100%;

  letter-spacing: normal;

  background-color: transparent;
  border: none;

  font-family: ${theme.baseFont.family};
  font-size: ${card.plan.list.button.font.size}px;
  font-weight: ${card.plan.list.button.font.weight};
  color: ${card.plan.list.button.font.color};

  cursor: pointer;
  text-decoration: none;
  text-align: left;
  outline: none;

  ${truncateStyle}
`;

const ListItem = withTheme(
  ({ text, icon: Icon, buttonProps, theme: yogaTheme }) => (
    <Item>
      <Wrapper>
        {Icon && (
          <IconWrapper>
            {isValidElement(Icon) ? (
              Icon
            ) : (
              <Icon
                width={16}
                height={16}
                fill={yogaTheme.yoga.colors.text.primary}
              />
            )}
          </IconWrapper>
        )}
        <ItemText as="span">{text}</ItemText>
      </Wrapper>
      {Boolean(Object.keys(buttonProps).length) && <Button {...buttonProps} />}
    </Item>
  ),
);

List.displayName = 'PlanCard.List';
ListItem.displayName = 'PlanCard.ListItem';
Button.displayName = 'PlanCard.ListButton';

ListItem.propTypes = {
  text: string.isRequired,
  /** an icon to be displayed on the begin of the item */
  icon: oneOfType([node, func]),
  /** if provided displays a button below the item text. It accepts all button
   * element props */
  buttonProps: shape({}),
};

ListItem.defaultProps = {
  icon: undefined,
  buttonProps: {},
};

export { List, ListItem };
