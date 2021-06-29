import React, { FC } from "react";

import { useSelect } from "downshift";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownContainer,
  DropdownHeader,
  DropdownList,
  DropdownListItem,
  UpArrow,
  DownArrow,
} from "./Dropdown.styled";

interface OptionType {
  value: string;
  label: string;
}

export interface Props {
  items: OptionType[];
  // onChange: (selectedItem: string) => void;
}

const Dropdown: FC<Props> = ({ items }) => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({ items });

  return (
    <DropdownContainer>
      <DropdownHeader {...getToggleButtonProps()} isOpen={isOpen}>
        {(selectedItem && selectedItem.label) || "---"}
        {isOpen ? (
          <UpArrow>
            <FontAwesomeIcon icon={faAngleUp} />
          </UpArrow>
        ) : (
          <DownArrow>
            <FontAwesomeIcon icon={faAngleDown} />
          </DownArrow>
        )}
      </DropdownHeader>
      <DropdownList {...getMenuProps()} isOpen={isOpen}>
        {isOpen &&
          items.map((item, index) => (
            <DropdownListItem
              isHighlighted={highlightedIndex === index}
              key={`${item.value}${index}`}
              {...getItemProps({ item, index })}
            >
              {item.label}
            </DropdownListItem>
          ))}
      </DropdownList>
      <div tabIndex={0} />
    </DropdownContainer>
  );
};

export default Dropdown;
