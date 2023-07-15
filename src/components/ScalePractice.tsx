import React, { useEffect, useState } from "react";
import { Card, Typography, Select, Button, Radio, Layout, Space } from "antd";
import scalesData from "../lib/amebRequirements.json";
import CustomScaleModal from "./CustomScaleModal";
import Scale, { get } from "@tonaljs/scale";
import Note from "@tonaljs/note";
import { Accidental, StaveNote, Vex, Voice } from "vexflow";
import { useDarkMode } from "../lib/darkModeContext";
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
  const { darkMode } = useDarkMode();
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
      setCustomScales(["C major"]);
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setSelectedGrade(value);
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
  const convertToVexFlowNotes = (): StaveNote[] => {
    const notes = Scale.get(currentScaleName).notes;
    const interval = Scale.get(currentScaleName).intervals;
    let arr = [];
    for (let i = 0; i < notes.length; i++) {
      let note = Note.transpose(notes[0] + "4", interval[i]).toString();
      if (note.includes("b") || note.includes("#")) {
        note = note.split("")[0] + note.split("")[1] + "/" + note.split("")[2];
      } else {
        note = note.split("")[0] + "/" + note.split("")[1];
      }
      arr.push(note);
    }
    arr = arr.map((note) => {
      if (note.includes("b")) {
        return new Vex.Flow.StaveNote({
          clef: "treble",
          keys: [note],
          duration: "q",
          auto_stem: true,
        }).addModifier(new Accidental("b"));
      } else if (note.includes("#")) {
        return new Vex.Flow.StaveNote({
          clef: "treble",
          keys: [note],
          duration: "q",
          auto_stem: true,
        }).addModifier(new Accidental("#"));
      }
      return new Vex.Flow.StaveNote({
        clef: "treble",
        keys: [note],
        duration: "q",
        auto_stem: true,
      });
    });
    return arr;
  };

  useEffect(() => {
    const canvas = document.getElementById("vexflowout") as HTMLCanvasElement;
    const context = canvas.getContext("2d")!;
    canvas.width = 500;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const renderer = new Vex.Flow.Renderer(
      canvas,
      Vex.Flow.Renderer.Backends.CANVAS
    );

    const stave = new Vex.Flow.Stave(0, 0, 480);
    stave.addClef("treble").addTimeSignature("4/4");
    // change color if dark mode
    if (darkMode) {
      renderer.getContext().fillStyle = "white";
      renderer.getContext().strokeStyle = "white";
    } else {
      // change color to black
      renderer.getContext().fillStyle = "black";
      renderer.getContext().strokeStyle = "black";
    }

    if (!showScale) {
      canvas.style.display = "none";
    } else {
      canvas.style.display = "block";
    }

    stave.setContext(renderer.getContext()).draw();

    const notes = convertToVexFlowNotes();
    const voice = new Voice({ num_beats: notes.length, beat_value: 4 });
    voice.addTickables(notes);

    const formatter = new Vex.Flow.Formatter();
    formatter.joinVoices([voice]).format([voice], 400, { align_rests: true });
    voice.draw(renderer.getContext(), stave);
  }, [currentScaleName, darkMode, showScale]);
  return (
    <Card
      title={<Typography.Title level={2}>Scales Practice</Typography.Title>}
      style={{
        display: "flex",
        flexDirection: "column",
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
        <canvas
          id="vexflowout"
          style={{
            width: "500px",
          }}
        />
        <p>
          Please note when selecting custom scales, make sure to have at least{" "}
          <strong>1</strong> scale selected at any time or it will break. Sorry
          for the inconvenience. Fix coming soon {">:)"}
        </p>
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
