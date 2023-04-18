import {
  Card,
  ConfigProvider,
  Typography,
  theme,
  Select,
  Button,
  Radio,
  Layout,
  Space,
  Slider,
  Switch,
} from "antd";
import scalesData from "./lib/amebRequirements.json";
import scales from "./lib/scales.json";
import { useState } from "react";
import { useDarkMode } from "./lib/darkModeContext";

const { Option } = Select;
const { defaultAlgorithm, darkAlgorithm } = theme;

type ScalesData = {
  [grade: string]: {
    scales: string[];
    chromatic: string;
    arpeggios: string[];
    blues?: string;
  };
};

type Scales = {
  [scale: string]: string;
};

function App() {
  const [selectedGrade, setSelectedGrade] = useState<string>("1");
  const [currentScaleIndex, setCurrentScaleIndex] = useState<number>(0);
  const handleGradeChange = (value: string) => {
    setSelectedGrade(value);
    setCurrentScaleIndex(0); // reset scale index when grade changes
  };
  const { darkMode, setDarkMode } = useDarkMode();
  const currentScales = (scalesData as ScalesData)[selectedGrade].scales;
  const currentScaleName = currentScales[currentScaleIndex];
  const currentScale = (scales as Scales)[currentScaleName];
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hint, setHint] = useState<string>("");
  const [randomScale, setRandomScale] = useState<boolean>(false);
  const handleNextScale = () => {
    let nextScaleIndex;
    if (randomScale) {
      nextScaleIndex = Math.floor(Math.random() * currentScales.length);
      while (nextScaleIndex === currentScaleIndex) {
        nextScaleIndex = Math.floor(Math.random() * currentScales.length);
      }
    } else {
      nextScaleIndex = (currentScaleIndex + 1) % currentScales.length;
    }
    const nextScaleName = currentScales[nextScaleIndex];
    const nextScale = (scales as Scales)[nextScaleName];
    setCurrentScaleIndex(nextScaleIndex);
    updateHint(nextScaleName);
  };

  const getAlteredScale = (
    scaleName: string,
    alteration: "harmonic" | "melodic"
  ) => {
    // remove alteration from scale name
    const scale = scaleName.replace(` ${alteration}`, "");
    let scaleNotes = (scales as Scales)[scale].split(" ");

    if (alteration === "harmonic") {
      // raise the 7th by 1 semitone
      const seventhIndex = scaleNotes.findIndex((note) => note.endsWith("7"));
      if (seventhIndex !== -1) {
        const alteredNote = raiseNoteBySemitone(scaleNotes[seventhIndex]);
        scaleNotes[seventhIndex] = alteredNote;
      }
    } else if (alteration === "melodic") {
      // raise the 6th and 7th by 1 semitone
      const sixthIndex = scaleNotes.findIndex((note) => note.endsWith("6"));
      const seventhIndex = scaleNotes.findIndex((note) => note.endsWith("7"));
      if (sixthIndex !== -1) {
        const alteredNote = raiseNoteBySemitone(scaleNotes[sixthIndex]);
        scaleNotes[sixthIndex] = alteredNote;
      }
      if (seventhIndex !== -1) {
        const alteredNote = raiseNoteBySemitone(scaleNotes[seventhIndex]);
        scaleNotes[seventhIndex] = alteredNote;
      }
    }

    // function to raise a note by 1 semitone
    function raiseNoteBySemitone(note: string): string {
      if (note.includes("b")) {
        // if note has a flat, raise it to natural
        const naturalNote = note[0];
        return naturalNote + "#";
      } else {
        // if note is natural, raise it to sharp
        return note + "#";
      }
    }

    return scaleNotes.toString().replaceAll(",,", ",").replaceAll(" ", "");
  };

  const updateHint = (scaleName: string) => {
    console.log(scaleName);
    if (scaleName.includes("harmonic")) {
      setHint(getAlteredScale(scaleName, "harmonic"));
    } else if (scaleName.includes("melodic")) {
      setHint(getAlteredScale(scaleName, "melodic"));
    } else {
      setHint((scales as Scales)[scaleName].replaceAll(" ", ""));
    }
  };

  const handleHint = () => {
    updateHint(currentScaleName);
    setShowHint(!showHint);
  };

  const totalAmountOfScales = currentScales.length;
  const currentScaleNumber = currentScaleIndex + 1;

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
      <Card
        title={<Typography.Title level={2}>Scales Practice</Typography.Title>}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <Layout
          style={{
            background: "none",
          }}
        >
          <Space direction="vertical">
            <Select
              defaultValue={selectedGrade}
              onChange={handleGradeChange}
              style={{ width: "100%" }}
            >
              {Object.keys(scalesData).map((grade) => (
                <Option key={grade} value={grade}>
                  {grade}
                </Option>
              ))}
            </Select>

            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              onChange={(e) => setRandomScale(e.target.value)}
              value={randomScale}
              options={[
                { label: "Play in order", value: false },
                { label: "Play randomly", value: true },
              ]}
            ></Radio.Group>
            <Typography.Text
              strong
              style={{
                fontSize: "1.5rem",
              }}
            >
              {currentScaleName}{" "}
              <Typography.Text type="secondary">
                {currentScaleNumber}/{totalAmountOfScales}
              </Typography.Text>
            </Typography.Text>
            <Space>
              <Button onClick={handleHint}>Hint</Button>

              <Button onClick={handleNextScale}>Next</Button>
              <Button
                onClick={() => {
                  setCurrentScaleIndex(0);
                }}
              >
                Reset
              </Button>
            </Space>
            {showHint && (
              <Typography.Text
                style={{
                  fontSize: "1.5rem",
                }}
              >
                {hint}
              </Typography.Text>
            )}
          </Space>
        </Layout>
      </Card>
    </ConfigProvider>
  );
}

export default App;
