import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';

interface ContainerProps {
  toggled: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #b987e1;

  header {
    padding: 2em;
    display: flex;
    height: 100%;

    .firstRow {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
    }

    nav {
      a {
        color: #313c4e;
        font-size: 16px;
        text-decoration: none;
        transition: opacity 0.2s;

        &:hover {
          opacity: 0.6;
        }
      }
    }

    @media screen and (min-width: 1000px) {
      flex-direction: row;

      nav {
        a {
          margin-left: 3em;
        }
      }
    }

    @media screen and (max-width: 1000px) {
      flex-direction: column;

      nav {
        width: 100%;

        a {
          ${(props) =>
            !props.toggled &&
            css`
              display: none;
            `}

          ${(props) =>
            props.toggled &&
            css`
              margin-top: 32px;
              display: block;
              float: none;
              display: block;
              text-align: left;
            `}
        }
      }
    }
  }
`;

export const MenuButton = styled.div`
  display: none;

  @media screen and (max-width: 1000px) {
    float: right;
    display: block;
  }

  button {
    background: transparent;
    border: 0;

    svg {
      color: #fff;
      width: 20px;
      height: 20px;
    }

    &:hover {
      opacity: 0.6;
    }
  }
`;

const activeClassName = 'nav-item-active';

export const StyledLink = styled(NavLink).attrs({ activeClassName })`
  &.${activeClassName} {
    color: #fff;
    border-bottom: 2px solid #fff;
    padding-bottom: 10px;
  }
`;
