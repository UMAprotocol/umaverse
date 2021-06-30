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
  img?: JSX.Element;
}

export type DropdownVariant = "default | coin";

export interface Props {
  items: OptionType[];
  // onChange: (selectedItem: string) => void;
  variant?: DropdownVariant;
}

const Dropdown: FC<Props> = ({
  items,
  variant = "default" as DropdownVariant,
}) => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({ items });

  return (
    <DropdownContainer variant={variant}>
      <DropdownHeader
        variant={variant}
        {...getToggleButtonProps()}
        isOpen={isOpen}
      >
        {(selectedItem && selectedItem.label) || "---"}
        {isOpen ? (
          <UpArrow variant={variant}>
            <FontAwesomeIcon icon={faAngleUp} />
          </UpArrow>
        ) : (
          <DownArrow variant={variant}>
            <FontAwesomeIcon icon={faAngleDown} />
          </DownArrow>
        )}
      </DropdownHeader>
      <DropdownList variant={variant} {...getMenuProps()} isOpen={isOpen}>
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
