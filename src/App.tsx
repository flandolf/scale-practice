import { ConfigProvider, Switch } from "antd";
import { theme } from "antd";
import ScalePractice from "./components/ScalePractice";
import { useDarkMode } from "./lib/darkModeContext";

const { defaultAlgorithm, darkAlgorithm } = theme;

function App() {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: "#e96c90",
        },
      }}
    >
      <Switch
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
        }}
        defaultChecked
        onChange={() => setDarkMode(!darkMode)}
        unCheckedChildren="Light"
        checkedChildren="Dark"
      />
      <ScalePractice />
    </ConfigProvider>
  );
}

export default App;
