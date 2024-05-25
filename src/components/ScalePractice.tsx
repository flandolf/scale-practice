import React, { useEffect, useState } from "react";
import scalesData from "../lib/scales.json";
import Scale, { get } from "@tonaljs/scale";
import Note from "@tonaljs/note";
import { Accidental, StaveNote, Vex, Voice } from "vexflow";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
    canvas.width = 1920;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const renderer = new Vex.Flow.Renderer(
      canvas,
      Vex.Flow.Renderer.Backends.CANVAS
    );

    const stave = new Vex.Flow.Stave(0, 0, 480);
    stave.addClef("treble").addTimeSignature("4/4");
    
    renderer.getContext().fillStyle = "white";
    renderer.getContext().strokeStyle = "white";
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
  }, [currentScaleName, showScale]);
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
      <canvas id="vexflowout"></canvas>
      <p>&copy; 2024 Andy Wang</p>
    </div>
  );
};

export default ScalePractice;
