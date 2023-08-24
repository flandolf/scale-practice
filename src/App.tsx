import { useState } from "react";
import ScalePractice from "./components/ScalePractice";
import TypeScaleChallenge from "./components/TypeScaleChallenge";
import { useDarkMode } from "./lib/darkModeContext";
import {
  Layout,
  theme,
  ConfigProvider,
  MenuProps,
  Switch,
  Radio,
  Card,
} from "antd";

const { Header, Content, Sider } = Layout;
const { defaultAlgorithm, darkAlgorithm } = theme;
const items1: MenuProps["items"] = [
  {
    key: "1",
    label: "Scale Practice",
  },
  {
    key: "2",
    label: "Type Scale Challenge",
  },
];
function App() {
  const { darkMode, setDarkMode } = useDarkMode();
  const [selectedComponent, setSelectedComponent] = useState(1);

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 1:
        return <ScalePractice />;
      case 2:
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
          colorPrimary: "#e6649a",
        },
      }}
    >
      <Card 
      title="Scale Practice"
      style={{
        margin: "10px",
      }}>
        <Switch
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          checkedChildren="Dark"
          unCheckedChildren="Light"
          style={{
            margin: "10px",
          }}
        />

        <Radio.Group
          buttonStyle="solid"
          optionType="button"
          defaultValue={selectedComponent}
          options={[
            { label: "Scale Practice", value: 1 },
            { label: "Type Scale Challenge", value: 2 },
          ]}
          onChange={(e) => setSelectedComponent(e.target.value)}
        />
        {renderSelectedComponent()}
        <p>(c) 2023 andy wang</p>
      </Card>
    </ConfigProvider>
  );
}

export default App;
