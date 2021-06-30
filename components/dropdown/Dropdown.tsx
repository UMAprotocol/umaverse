import React, { FC, useEffect } from "react";

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

export type DropdownVariant = "default | coin";

export interface Props {
  items: OptionType[];
  // onChange: (selectedItem: string) => void;
  variant?: DropdownVariant;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  defaultValue?: OptionType;
}

const Dropdown: FC<Props> = ({
  items,
  setValue,
  defaultValue,
  variant = "default" as DropdownVariant,
}) => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({ items, defaultSelectedItem: defaultValue });

  // Expose value to parent component
  useEffect(() => {
    if (selectedItem) {
      setValue(selectedItem.value);
    } else {
      setValue("");
    }
  }, [selectedItem]);

  return (
    <DropdownContainer variant={variant}>
      <DropdownHeader
        variant={variant}
        {...getToggleButtonProps()}
        isOpen={isOpen}
      >
        {(selectedItem && <div>{selectedItem.label}</div>) || <span>---</span>}
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
