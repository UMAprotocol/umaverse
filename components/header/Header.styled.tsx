import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { BaseButton } from "../Button";
import { MaxWidthWrapper } from "../Wrapper";
import { QUERIES } from "../../utils";

export const Slice = styled(motion.div)`
  min-height: 2px;
  background-color: var(--black);
  position: absolute;
  left: 0;
  right: 0;
`;
export const Overlay = styled(motion(DialogOverlay))`
  position: fixed;
  top: 100px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--gray-transparent-dark);
`;
export const Content = styled(motion(DialogContent))`
  background-color: var(--white);
  display: flex;
  flex-direction: column;
  padding: 40px 12px 12px;
`;

export const CloseButton = styled(BaseButton)`
  width: 32px;
  height: 32px;
  position: relative;
`;

export const Wrapper = styled.header`
  position: sticky;
  height: 100px;
  padding: 40px 0 30px;
  @media ${QUERIES.laptopAndUp} {
    padding: 50px 0 55px;
    height: 140px;
  }
`;

export const MaxWidth = styled(MaxWidthWrapper)`
  display: flex;
  align-items: center;
`;

export const Navigation = styled.nav`
  display: none;
  margin-left: auto;
  @media ${QUERIES.laptopAndUp} {
    display: revert;
  }
`;

export const LinkList = styled.ol`
  display: inline-flex;
  flex-direction: column;
  font-weight: 600;
  @media ${QUERIES.laptopAndUp} {
    flex-direction: revert;
    & > *:not(:last-of-type) {
      margin-right: 32px;
    }
  }
  /* width: 100%; */
`;

export const ListItem = styled.li`
  width: fit-content;
  transition: all ease-in 0.1s;

  &:hover {
    box-shadow: 0px 3px 0px 0px var(--primary);
  }
  @media ${QUERIES.tabletAndDown} {
    width: 95%;
    margin: 0.5rem auto;
    box-shadow: 0px 2px 0px 0px var(--gray-300);
    padding-bottom: 0.5rem;
    &:hover {
      box-shadow: none;
    }
  }
`;

export const ImageItem = styled.li`
  opacity: 1;
  transition: all ease-in 0.1s;
  &:hover {
    opacity: 0.5;
  }
`;

export const SocialsList = styled(LinkList)`
  flex-direction: row;
  & > *:not(:last-of-type) {
    margin-right: 32px;
  }
  margin-top: 16px;
  @media ${QUERIES.laptopAndUp} {
    margin-left: 85px;
    margin-top: 0;
  }
`;

export const Dropdown = styled.div`
  overflow: hidden;
  width: 100%;
  button {
    font-size: 16px;
    border: none;
    outline: none;
    color: #000;
    font-weight: 600;
    background-color: inherit;
    font-family: inherit; /* Important for vertical align on mobile phones */
    margin: 0; /* Important for vertical align on mobile phones */
    border-bottom: 2px solid transparent;
    display: inline-block;
    height: 10px;
    margin-left: 6px;

    @media ${QUERIES.tabletAndDown} {
      margin-left: 0;
    }
  }
  &:hover {
    button {
      /* text-decoration: underline; */
      /* text-decoration-color: #ff4a4a; */
      text-underline-offset: 4px;
    }
  }
`;

export const DropdownContent = styled.div`
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 260px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  transform: translateX(-60px);
  margin-top: 8px;
  @media ${QUERIES.tabletAndDown} {
    transform: translateX(0);
    position: relative;
    width: 100%;
    background-color: #ffffff;
  }
  &.open {
    display: block;
    z-index: 999999;
    @media ${QUERIES.tabletAndDown} {
      display: block;
      width: 100%;
    }
    /* @include breakpoint-down(tablet) {

      } */
  }
  /* @include breakpoint-down(tablet) {
      display: inline-block;
      width: 100%;
      position: relative;
    } */

  a {
    float: none;
    color: #000;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: left;
    font-weight: 400;
    z-index: 99999;
    border-bottom: 1px solid #e5e5e5;
    &:hover {
      background-color: #f5f5f5;
      color: #ff4a4a;
    }
    &:last-of-type {
      border-bottom: none;
    }
  }
`;

/*
<li class="dropdown-item">
<div class="dropdown">
  <button class="drop-btn">
    Products
    <i class="fas fa-angle-down angle-down"></i>
  </button>
  <div class="dropdown-content">
    <a href="optimistic-oracle.html">Optimistic Oracle</a>
    <a href="lsp.html">Long Short Pair (LSP)</a>
    <a href="call-put.html">Call/Put Options</a>
    <a href="range-tokens.html">Range Tokens</a>
    <a href="kpi-options.html">KPI Options</a>
  </div>
</div>
</li>
<li class="dropdown-item-mobile">
<div class="dropdown-mobile">
  <button class="drop-btn-mobile">
    Products
    <i class="fas fa-angle-down angle-down-mobile"></i>
  </button>
  <div class="dropdown-content-mobile">
    <a href="optimistic-oracle.html">Optimistic Oracle</a>
    <a href="lsp.html">Long Short Pair (LSP)</a>
    <a href="call-put.html">Call/Put Options</a>
    <a href="range-tokens.html">Range Tokens</a>
    <a href="kpi-options.html">KPI Options</a>
  </div>
</div>
</li>
*/

export const MobileNavigation = motion(styled(Navigation)`
  display: revert;
  @media ${QUERIES.laptopAndUp} {
    display: none;
  }
`);
