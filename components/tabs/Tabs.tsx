import React, { FC, useState } from "react";
import Tab from "./Tab";
import { TabList } from "./Tabs.styled";
interface Props {
  children: JSX.Element[];
}

const Tabs: FC<Props> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>(children[0].props.label);

  const onClickTabItem = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <TabList>
        {children.map((child) => {
          const { label } = child.props;

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
        {children.map((child) => {
          if (child.props.label !== activeTab) return undefined;
          return child.props.children;
        })}
      </div>
    </div>
  );
};

export default Tabs;
