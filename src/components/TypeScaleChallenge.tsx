import React, { useState } from "react";
import {
  Input,
  Button,
  Typography,
  Space,
  message,
  Card,
  Layout,
  Select,
  Tooltip,
} from "antd";
import { detect, get } from "@tonaljs/scale";
import scalesData from "../lib/amebRequirements.json";

const { Option } = Select;

const TypeScaleChallenge: React.FC = () => {
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [currentScaleIndex, setCurrentScaleIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("1");
  const currentScales = (scalesData as any)[selectedGrade].scales;
  const currentScaleName = currentScales[currentScaleIndex];

  const handleSubmit = () => {
    const detectedScales = detect(userInput.split(" "));

    if (detectedScales.includes(currentScaleName)) {
      messageApi.success("Correct!");
      setCurrentScaleIndex((currentScaleIndex + 1) % currentScales.length);
      setCorrectAnswers(correctAnswers + 1);
      setUserInput("");
      if (correctAnswers === 9) {
        messageApi.success("You have completed the challenge!");
        handleReset();
      }
    } else {
      messageApi.error("Incorrect, please try again.");
    }
  };

  const handleReset = () => {
    setCurrentScaleIndex(0);
    setCorrectAnswers(0);
    setUserInput("");
  };

  const showHint = () => {
    const scale = get(currentScaleName);
    const scaleNotes = scale.notes as string[];
    let hint: string[] = [];
    scaleNotes.forEach((e) => {
        if (e.includes("#")) {
            hint.push(e);
        } else {
            return
        }
    })

    messageApi.info(`Hint: ${hint.join(" ")}`);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value);
    setCurrentScaleIndex(0);
  };

  return (
    <Card 
      title={<Button type="text" onClick={() => {
        messageApi.info("How to play: Enter the notes of the scale, separated by spaces. For example, C D E F G A B.")
      }}>Type Scale Challenge</Button>}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      {contextHolder}
      <Layout style={{ background: "none" }}>
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
        <Typography.Text strong style={{ fontSize: "1.5rem" }}>
          {currentScaleName} ({correctAnswers}/10)
        </Typography.Text>
        <Space>
          <Input
            value={userInput}
            onChange={handleInputChange}
            onPressEnter={handleSubmit}
            style={{ width: "300px" }}
          />
          <Button type="primary" onClick={handleSubmit}>Submit</Button>
          <Button onClick={handleReset}>Reset</Button>
          <Tooltip title="Show hint">
            <Button onClick={showHint}>Hint</Button>
          </Tooltip>
        </Space>
      </Layout>
    </Card>
  );
};

export default TypeScaleChallenge;
