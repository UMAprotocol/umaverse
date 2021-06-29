import React, { FC, useState } from "react";
import Tab from "./Tab";
import { TabList } from "./Tabs.styled";
import { ITab } from "./Tab";
interface Props {
  tabs: ITab[];
}

const Tabs: FC<Props> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].label);

  const onClickTabItem = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <TabList>
        {tabs.map(({ label }) => {
          return (
            <Tab
              key={label}
              activeTab={activeTab}
              label={label}
              onClick={onClickTabItem}
            />
          );
        })}
      </TabList>
      <div className="tab-content">
        {tabs.map(({ label, element }) => {
          if (label !== activeTab) return undefined;
          return element;
        })}
      </div>
    </div>
  );
};

export default Tabs;
