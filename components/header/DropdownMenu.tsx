import React, { useState } from "react";
import { Dropdown, DropdownContent } from "./Header.styled";
import { BaseButton } from "../Button";
import { Link } from "../Link";

const DropdownMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown>
      <BaseButton onClick={() => setOpen((prevState) => !prevState)}>
        Products
      </BaseButton>
      <DropdownContent className={open ? "open" : ""}>
        <Link href="/">Optimistic Oracle</Link>
        <Link href="/">Long Short Pair (LSP)</Link>
      </DropdownContent>
    </Dropdown>
  );
};

export default DropdownMenu;
