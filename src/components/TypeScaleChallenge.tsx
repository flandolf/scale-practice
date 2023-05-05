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
  Col,
  Row,
  Radio,
  Modal,
  Tag,
  Checkbox,
} from "antd";
import { detect, get } from "@tonaljs/scale";
import scalesData from "../lib/amebRequirements.json";

const { Option } = Select;

const TypeScaleChallenge: React.FC = () => {
  const [customScales, setCustomScales] = useState<string[]>([]);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>("major");
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [currentScaleIndex, setCurrentScaleIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("1");
  const currentScales = isCustom
    ? customScales
    : (scalesData as any)[selectedGrade].scales;
  const currentScaleName = currentScales[currentScaleIndex];
  const [currentMode, setCurrentMode] = useState<string>("random");
  const [showScaleModal, setShowScaleModal] = useState<boolean>(false);
  const [isCustomModalVisible, setIsModalVisible] = useState<boolean>(false);
  const getArpeggio = (scaleName: string) => {
    const scale = get(scaleName);
    const arpeggioNotes = [scale.notes[0], scale.notes[2], scale.notes[4]];
    return arpeggioNotes;
  };
  
  const majors = get("C major")
    .notes.map((note) => `${note} major`)
    .sort();

  const minors = get("C minor")
    .notes.map((note) => `${note} minor`)
    .sort();

  const harmonics = get("C harmonic minor")
    .notes.map((note) => `${note} harmonic minor`)
    .sort();

  const melodic = get("C melodic minor")
    .notes.map((note) => `${note} melodic minor`)
    .sort();

  const blues = get("C blues")
    .notes.map((note) => `${note} blues`)
    .sort();

  const chromatic = get("C chromatic")
    .notes.map((note) => `${note} chromatic`)
    .sort();

  const handleModalOk = () => {
    setIsModalVisible(false);
    if (isCustom) {
      setSelectedGrade("custom");
      if (currentMode == "random") {
        const nextScaleIndex = Math.floor(Math.random() * currentScales.length);
        setCurrentScaleIndex(nextScaleIndex);
      } else {
        setCurrentScaleIndex((currentScaleIndex + 1) % currentScales.length);
      }
    }
  };

  const handleSubmit = () => {
    const detectedScales = detect(userInput.split(" "));

    if (detectedScales.includes(currentScaleName)) {
      messageApi.success("Correct!");
      if (currentMode === "random") {
        const nextScaleIndex = Math.floor(Math.random() * currentScales.length);
        setCurrentScaleIndex(nextScaleIndex);
      } else {
        setCurrentScaleIndex((currentScaleIndex + 1) % currentScales.length);
      }
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
      } else if (e.includes("b")) {
        hint.push(e);
      } else {
        return;
      }
    });
    if (hint.length === 0) {
      hint = ["No accidentals"];
    }

    messageApi.info(`Hint: ${hint.join(" ")}`);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };
  const showScales = () => {
    if (selectedGrade == "custom") {
      setIsModalVisible(true);
    } else {
      setShowScaleModal(true);
    }
  };
  const handleGradeChange = (value: string) => {
    if (value != "custom") {
      setSelectedGrade(value);
      setCurrentScaleIndex(0);
      setIsCustom(false);
    } else {
      setIsCustom(true);
      setIsModalVisible(true);
    }
  };
  return (
    <Card
      title={
        <Button
          type="text"
          onClick={() => {
            messageApi.info(
              "How to play: Enter the notes of the scale, separated by spaces. For example, C D E F G A B."
            );
          }}
        >
          Type Scale Challenge
        </Button>
      }
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
        <Space direction="vertical">
          <Col style={{ textAlign: "center" }}>
            <Typography.Text strong style={{ fontSize: "1.5rem" }}>
              {currentScaleName}{" "}
            </Typography.Text>
            <Typography.Text style={{ fontSize: "1rem" }}>
              ({correctAnswers}/{currentScales.length})
            </Typography.Text>
          </Col>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
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
              <Option value="custom" key="custom">
                Custom
              </Option>
            </Select>
            <Button
              type="primary"
              onClick={showScales}
              style={{ marginLeft: "0.5rem" }}
            >
              {isCustom ? "Edit" : "Show"}
            </Button>
          </div>

          <Input
            value={userInput}
            onChange={handleInputChange}
            onPressEnter={handleSubmit}
            placeholder="e.g C D E F G A B"
            style={{ width: "100%" }}
          />
          <Radio.Group
            buttonStyle="solid"
            optionType="button"
            defaultValue={currentMode}
            options={[
              { label: "Random", value: "random" },
              { label: "Ascending", value: "ascending" },
            ]}
            onChange={(e) => setCurrentMode(e.target.value)}
          />
          <Button type="primary" onClick={handleSubmit} block>
            Submit
          </Button>
          <Button onClick={showHint} type="primary" block>
            Hint
          </Button>
          <Button onClick={handleReset} type="primary" block danger>
            Reset
          </Button>
        </Space>
      </Layout>
      <Modal
        open={showScaleModal}
        onCancel={() => setShowScaleModal(false)}
        onOk={() => setShowScaleModal(false)}
      >
        <Typography.Title level={2}>Scales</Typography.Title>
        <Space direction="vertical">
          <Row gutter={[0, 4]}>
            {currentScales.sort().map((scale: string) => (
              <Col>
                <Tag color="magenta">{scale}</Tag>
              </Col>
            ))}
          </Row>
        </Space>
        <div style={{ height: "10px" }} />
        <Typography.Text>Total amount: {currentScales.length} </Typography.Text>
      </Modal>
      <Modal
        open={isCustomModalVisible}
        footer={[
          <div>
            <Button
              key="clear"
              onClick={() => {
                setCustomScales([]);
              }}
            >
              Clear
            </Button>
            <Button key="submit" type="primary" onClick={handleModalOk}>
              OK
            </Button>
          </div>,
        ]}
      >
        <Layout style={{ background: "none" }}>
          <Typography.Title level={2}> Scale Select </Typography.Title>
          <Select
            defaultValue={"Major"}
            onChange={(v) => {
              setCurrentView(v);
            }}
            options={[
              { value: "major", label: "Major" },
              { value: "minor", label: "Minor" },
              { value: "harmonic", label: "Harmonic Minor" },
              { value: "melodic", label: "Melodic Minor" },
              { value: "blues", label: "Blues" },
              { value: "chromatic", label: "Chromatic" },
            ]}
          />
          <div style={{ height: "10px" }} />
          {[
            { scales: majors, view: "major" },
            { scales: minors, view: "minor" },
            { scales: harmonics, view: "harmonic" },
            { scales: melodic, view: "melodic" },
            { scales: blues, view: "blues" },
            { scales: chromatic, view: "chromatic" },
          ].map(({ scales, view }) => (
            <Space direction="vertical">
              <Row gutter={[4, 4]}>
                {currentView === view &&
                  scales.map((scale) => (
                    <Col>
                      <Checkbox
                        checked={customScales.includes(scale)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCustomScales([...customScales, scale]);
                          } else {
                            setCustomScales(
                              customScales.filter((s) => s !== scale)
                            );
                          }
                        }}
                      >
                        {scale}
                      </Checkbox>
                    </Col>
                  ))}
              </Row>
            </Space>
          ))}
          <Typography.Title level={3}>Selected Scales</Typography.Title>
          <Space direction="vertical">
            <Row gutter={[0, 4]}>
              {customScales.map((scale) => (
                <Col>
                  <Tag
                    closable
                    onClose={() =>
                      setCustomScales(customScales.filter((s) => s !== scale))
                    }
                    color="magenta"
                  >
                    {scale}
                  </Tag>
                </Col>
              ))}
            </Row>
          </Space>
        </Layout>
      </Modal>
    </Card>
  );
};

export default TypeScaleChallenge;
