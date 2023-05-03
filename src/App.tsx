import React, { useState } from "react";
import { ConfigProvider, Switch, Radio } from "antd";
import { theme } from "antd";
import ScalePractice from "./components/ScalePractice";
import TypeScaleChallenge from "./components/TypeScaleChallenge";
import { useDarkMode } from "./lib/darkModeContext";

const { defaultAlgorithm, darkAlgorithm } = theme;

function App() {
  const { darkMode, setDarkMode } = useDarkMode();
  const [selectedComponent, setSelectedComponent] = useState("scalePractice");

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "scalePractice":
        return <ScalePractice />;
      case "typeScaleChallenge":
        return <TypeScaleChallenge />;
      default:
        return <ScalePractice />;
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: "#e96c90",
        },
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          margin: "0",
        }}
      >
        <Switch
          defaultChecked
          onChange={() => setDarkMode(!darkMode)}
          unCheckedChildren="Light"
          checkedChildren="Dark"
          style={{
            marginRight: "1rem",
          }}
        />
        <Radio.Group
          buttonStyle="solid"
          optionType="button"
          value={selectedComponent}
          onChange={(e) => setSelectedComponent(e.target.value)}
          options={[
            { label: "Scale Practice", value: "scalePractice" },
            { label: "Type Scale Challenge", value: "typeScaleChallenge" },
          ]}
        ></Radio.Group>
      </div>
      {renderSelectedComponent()}
    </ConfigProvider>
  );
}

export default App;
