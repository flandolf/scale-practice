import { useState } from "react";
import ScalePractice from "./components/ScalePractice";
import TypeScaleChallenge from "./components/TypeScaleChallenge";
import { useDarkMode } from "./lib/darkModeContext";
import {
  Layout,
  Menu,
  theme,
  ConfigProvider,
  MenuProps,
  Typography,
  Switch,
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
  const [selectedComponent, setSelectedComponent] = useState("scalePractice");

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "1":
        return <ScalePractice />;
      case "2":
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
      <Layout>
        <div className="header">
          <Typography.Text style={{ fontSize: "1.5rem" }}>
            Scale Practice
          </Typography.Text>
          <Switch
            checked={darkMode}
            onChange={(checked) => setDarkMode(checked)}
          />
        </div>
        <Layout>
          <Sider width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              style={{ height: "100vh", borderRight: 0 }}
              items={items1}
              onSelect={(item) => setSelectedComponent(item.key)}
            />
          </Sider>
          <Layout>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                height: "100vh",
              }}
            >
              {renderSelectedComponent()}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
