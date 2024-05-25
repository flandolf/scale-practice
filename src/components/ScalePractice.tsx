import React, { useEffect, useState } from "react";
import scalesData from "../lib/scales.json";
import Scale, { get } from "@tonaljs/scale";
import Vex from "vexflow";
const { Factory, EasyScore, System } = Vex.Flow;
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { transpose } from "@tonaljs/note";

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

  const totalAmountOfScales = currentScales.length;
  const currentScaleNumber = currentScaleIndex + 1;
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

  const renderVexTab = () => {
    const elem = document.getElementById("vexbox");
    if (elem) {
      elem.innerHTML = "";
    }
    const vf = new Factory({
      renderer: { elementId: "vexbox", width: 800, height: 150 },
    });
    const score = vf.EasyScore();
    const system = vf.System();
    score.set({ time: "7/4" });

    let scaleFN = get(currentScaleName).notes[0] + "3";

    switch (currentScaleName) {
      case "C melodic minor":
        scaleFN = "C4";
        break;
      case "C harmonic minor":
        scaleFN = "C4";
        break;
      case "C# harmonic minor":
        scaleFN = "C#4";
        break;
      case "C# melodic minor":
        scaleFN = "C#4";
        break;
      case "E major":
        scaleFN = "E4";
        break;
      case "Eb major":
        scaleFN = "Eb4";
        break;
      case "D major":
        scaleFN = "D4";
        break;
    }

    const interval = get(currentScaleName).intervals;
    let scale = [];
    scale.push(scaleFN);
    for (let i = 1; i < interval.length; i++) {
      scale.push(transpose(scaleFN, interval[i]));
    }

    let notes = scale
      .map((note, index) => {
        if (index === 0) {
          return `${note}/q`;
        } else {
          return `${note}`;
        }
      })
      .join(", ");

    system
      .addStave({
        voices: [score.voice(score.notes(notes, { stem: "up" }))],
      })
      .addClef("treble")
      .addTimeSignature("7/4")
      .addKeySignature("C");

    vf.getContext().fillStyle = "white";
    vf.getContext().strokeStyle = "white";
    vf.draw();
  };

  useEffect(() => {
    renderVexTab();
  }, [currentScaleName]);

  return (
    <div className="flex flex-col space-y-3 m-7">
      <h1 className="font-semibold text-5xl">Scale Practice</h1>
      <Select onValueChange={(value) => handleGradeChange(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select Grade" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(scalesData).map((grade) => (
            <SelectItem key={grade} value={grade}>
              Grade {grade}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <h1 className="text-3xl font-semibold">
        {currentScaleName}
        <span className="text-xl font-normal">
          {" "}
          ({currentScaleNumber}/{totalAmountOfScales})
        </span>
      </h1>
      <div className="flex space-x-3">
        <Button variant={"default"} onClick={handleBack}>
          Back
        </Button>
        <Button variant={"default"} onClick={handleNextScale}>
          Next
        </Button>
        <Button variant={"outline"} onClick={handleShowScale}>
          Show Scale
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            setCurrentScaleIndex(0);
            updateScale(currentScales[0]);
          }}
        >
          Reset
        </Button>
      </div>

      <div id="vexbox" style={{ display: showScale ? "block" : "none" }} />
      {showScale && (
        <div>
          <h1 className="text-2xl font-semibold">Scale Notes</h1>
          <p className="text-xl font-normal">{scaleNotes}</p>
        </div>
      )}

      <p className="absolute bottom-8 left-8">&copy; 2024 Andy Wang</p>
    </div>
  );
};

export default ScalePractice;
