import React, { useState, FC, useRef } from "react";
import { Dropdown, DropdownContent, ProductsButton } from "./Header.styled";
import { Link } from "../Link";
import useUserClickedOutsideElement from "../../hooks/useUserClickedOutsideElement";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
interface Props {
  links: IDropdownMenuLinks[];
}

export interface IDropdownMenuLinks {
  href: string;
  name: string;
}

const DropdownMenu: FC<Props> = ({ links }) => {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);
  useUserClickedOutsideElement(dropdownRef, () => setOpen(false));
  return (
    <Dropdown ref={dropdownRef}>
      <ProductsButton onClick={() => setOpen((prevState) => !prevState)}>
        Products
        <FontAwesomeIcon icon={faAngleDown} />
      </ProductsButton>
      <DropdownContent className={open ? "open" : ""}>
        {links.map(({ href, name }) => {
          return (
            <div key={name + href} onClick={() => setOpen(false)}>
              <Link target="_blank" href={href}>
                {name}
              </Link>
            </div>
          );
        })}
      </DropdownContent>
    </Dropdown>
  );
};

export default DropdownMenu;
