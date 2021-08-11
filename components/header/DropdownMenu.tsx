import React, { useState, FC, useRef } from "react";
import { Dropdown, DropdownContent } from "./Header.styled";
import { BaseButton } from "../Button";
import { Link } from "../Link";
import useUserClickedOutsideElement from "../../hooks/useUserClickedOutsideElement";

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
      <BaseButton onClick={() => setOpen((prevState) => !prevState)}>
        Products
      </BaseButton>
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
