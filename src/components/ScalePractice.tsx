import React, { useState } from "react";
import { Card, Typography, Select, Button, Radio, Layout, Space } from "antd";
import scalesData from "../lib/amebRequirements.json";
import scales from "../lib/scales.json";
import CustomScaleModal from "./CustomScaleModal";

const { Option } = Select;

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

const ScalePractice: React.FC = () => {
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<string>("1");
  const [currentScaleIndex, setCurrentScaleIndex] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [customScales, setCustomScales] = useState<string[]>([]);
  const currentScales = isCustom
    ? customScales
    : (scalesData as ScalesData)[selectedGrade].scales;
  const currentScaleName = currentScales[currentScaleIndex];
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
    setCurrentScaleIndex(nextScaleIndex);
    updateHint(nextScaleName);
  };

  const getAlteredScale = (
    scaleName: string,
    alteration: "harmonic" | "melodic"
  ) => {
    const scale = scaleName.replace(` ${alteration}`, "");
    let scaleNotes = (scales as Scales)[scale].split(" ");

    if (alteration === "harmonic") {
      const seventhNote = raiseNoteBySemitone(scaleNotes[6]);
      scaleNotes[6] = seventhNote;
    } if (alteration === "melodic") {
      const sixthNote = raiseNoteBySemitone(scaleNotes[5]);
      const seventhNote = raiseNoteBySemitone(scaleNotes[6]);
      scaleNotes[5] = sixthNote;
      scaleNotes[6] = seventhNote;
      // remove the extra "#" symbol in the sixth note
      scaleNotes[5] = scaleNotes[5].replace(/#+/g, "");
    }
    

    function raiseNoteBySemitone(note: string): string {
      if (note.includes("b")) {
        const naturalNote = note[0];
        return naturalNote + "#";
      } else {
        return note + "#";
      }
    }
    return scaleNotes.toString().replaceAll(",,", ",").replaceAll(" ", "");
  };

  const updateHint = (scaleName: string) => {
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
  const handleGradeChange = (value: string) => {
    if (value === "custom") {
      setIsCustom(true);
      setIsModalVisible(true);
    } else {
      setSelectedGrade(value);
      setIsCustom(false);
      setCurrentScaleIndex(0);
    }
  };
  const totalAmountOfScales = currentScales.length;
  const currentScaleNumber = currentScaleIndex + 1;

  return (
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
            <Option key="custom" value="custom">
              Custom{" "}
              <Button
                type="text"
                onClick={() => setIsModalVisible(true)}
                style={{ margin: "0", padding: "0", marginLeft: "4px" }}
              >
                Edit
              </Button>
            </Option>
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
                updateHint(currentScales[0]);
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
      <CustomScaleModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        customScales={customScales}
        setCustomScales={setCustomScales}
      />
    </Card>
  );
};

export default ScalePractice;
