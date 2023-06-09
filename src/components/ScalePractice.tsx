import React, { useState } from "react";
import { Card, Typography, Select, Button, Radio, Layout, Space } from "antd";
import scalesData from "../lib/amebRequirements.json";
import CustomScaleModal from "./CustomScaleModal";
import { get } from "@tonaljs/scale";
const { Option } = Select;

type ScalesData = {
  [grade: string]: {
    scales: string[];
    chromatic: string;
    arpeggios: string[];
    blues?: string;
  };
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
  const [showScale, setShowScale] = useState<boolean>(false);
  const [scaleNotes, setScaleNotes] = useState<string>("");
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
    updateScale(nextScaleName);
  };

  const updateScale = (scaleName: string) => {
    const scale = get(scaleName);
    const scaleNotes = scale.notes.join(" ");
    setScaleNotes(scaleNotes);
  };
  const handleShowScale = () => {
    updateScale(currentScaleName);
    setShowScale(!showScale);
  };
  const handleGradeChange = (value: string) => {
    if (value === "custom") {
      setIsCustom(true);
      setIsModalVisible(true);
    } else {
      setSelectedGrade(value);
      setIsCustom(false);
      setCurrentScaleIndex(0);
      const firstScaleName = (scalesData as ScalesData)[value].scales[0];
      updateScale(firstScaleName);
    }
  };

  const handleBack = () => {
    if (currentScaleIndex === 0) {
      setCurrentScaleIndex(totalAmountOfScales - 1);
      updateScale(currentScales[totalAmountOfScales - 1]);
    } else {
      setCurrentScaleIndex(currentScaleIndex - 1);
      updateScale(currentScales[currentScaleIndex - 1]);
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
          />
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
            <Button onClick={handleShowScale}>Show</Button>
            <Button onClick={handleNextScale}>Next</Button>
            <Button onClick={handleBack}>Back</Button>
            <Button
              onClick={() => {
                setCurrentScaleIndex(0);
                updateScale(currentScales[0]);
              }}
            >
              Reset
            </Button>
          </Space>
          {showScale && (
            <Typography.Text
              style={{
                fontSize: "1.5rem",
              }}
            >
              {scaleNotes}
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
