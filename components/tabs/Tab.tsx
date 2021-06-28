import React, { FC } from "react";
import { TabListItem } from "./Tabs.styled";

interface Props {
  activeTab: string;
  label: string;
  onClick: (tab: string) => void;
}

const Tab: FC<Props> = ({ onClick, label, activeTab }) => {
  const changeLabel = () => {
    onClick(label);
  };

  let className = "";

  if (activeTab === label) {
    className = "tab-list-active";
  }

  return (
    <TabListItem className={className} onClick={changeLabel}>
      {label}
    </TabListItem>
  );
};

export default Tab;
