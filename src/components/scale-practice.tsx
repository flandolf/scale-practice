import React, { useEffect, useState } from "react";
import scalesData from "@/lib/scales.json";
import Scale, { get } from "@tonaljs/scale";
import Vex, { Accidental, Formatter, Renderer, StaveNote } from "vexflow";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "./ui/switch";
import { minorKey } from "@tonaljs/key";

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
  const [customScales, setCustomScales] = useState<string[]>([]);
  const currentScales = isCustom
    ? customScales
    : (scalesData as ScalesData)[selectedGrade].scales;
  const currentScaleName = currentScales[currentScaleIndex];
  const [showScale, setShowScale] = useState<boolean>(false);
  const [_scaleNotes, setScaleNotes] = useState<string>("");
  const [randomScale, setRandomScale] = useState<boolean>(false);

  const totalAmountOfScales = currentScales.length;
  const currentScaleNumber = currentScaleIndex + 1;

  // Function to render VexTab musical staff
  const renderVexFlow = () => {
    const vexflow = document.getElementById("vexbox") as
      | HTMLCanvasElement
      | HTMLDivElement;
    vexflow.innerHTML = "";
    if (!vexflow) return;
    const renderer = new Renderer(vexflow, Renderer.Backends.SVG);
    renderer.resize(720, 150); // Adjusted size for mobile
    const context = renderer.getContext();
    const stave = new Vex.Flow.Stave(10, 15, 700); // Adjusted stave dimensions
    stave.addClef("treble");
    if (currentScaleName.includes("minor")) {
      stave.addKeySignature(
        minorKey(get(currentScaleName).tonic ?? "C").relativeMajor,
      );
    } else {
      stave.addKeySignature(get(currentScaleName).tonic ?? "C");
    }

    stave.setContext(context).draw();
    let notes = [];
    let a = currentScaleName.split(" ");
    let n = [];

    if (
      currentScaleName.includes("harmonic") ||
      currentScaleName.includes("melodic")
    ) {
      n = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21,
      ].map(Scale.degrees(`${a[0]}3 ${a[1]} ${a[2]}`));
    } else {
      n = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21,
      ].map(Scale.degrees(`${a[0]}3 ${a[1]}`));
    }
    for (let i = 0; i < n.length; i++) {
      if (n[i].includes("#") || n[i].includes("b")) {
        n[i] = n[i].split("")[0] + n[i].split("")[1] + "/" + n[i].split("")[2];
      } else {
        n[i] = n[i].split("")[0] + "/" + n[i].split("")[1];
      }
    }
    for (let i = 0; i < n.length; i++) {
      notes.push(
        new StaveNote({
          keys: [n[i]],
          duration: "16",
        }),
      );
    }

    if (currentScaleName.includes("harmonic")) {
      notes[6].addModifier(new Accidental("#"));
      notes[12].addModifier(new Accidental("#"));
      notes[18].addModifier(new Accidental("#"));
    }

    if (currentScaleName.includes("melodic")) {
      notes[5].addModifier(new Accidental("#"));
      notes[6].addModifier(new Accidental("#"));

      notes[12].addModifier(new Accidental("#"));
      notes[13].addModifier(new Accidental("#"));

      notes[18].addModifier(new Accidental("#"));
      notes[19].addModifier(new Accidental("#"));
    }

    const beams = Vex.Flow.Beam.generateBeams(notes);
    Formatter.FormatAndDraw(context, stave, notes);
    beams.forEach((b) => b.setContext(context).draw());
  };

  useEffect(() => {
    renderVexFlow();
  }, [currentScaleName]);

  // Function to update scale notes based on currentScaleName
  const updateScale = (scaleName: string) => {
    const scale = get(scaleName);
    const scaleNotes = scale.notes.join(" ");
    setScaleNotes(scaleNotes);
  };

  // Handler for changing the selected grade
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

  // Handler for showing the scale notes
  const handleShowScale = () => {
    updateScale(currentScaleName);
    setShowScale(!showScale);
  };

  // Handler for navigating to the next scale
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

  // Handler for navigating to the previous scale
  const handleBack = () => {
    if (currentScaleIndex === 0) {
      setCurrentScaleIndex(totalAmountOfScales - 1);
      updateScale(currentScales[totalAmountOfScales - 1]);
    } else {
      setCurrentScaleIndex(currentScaleIndex - 1);
      updateScale(currentScales[currentScaleIndex - 1]);
    }
  };

  return (
    <div className="flex flex-col space-y-3 p-10">
      <h1 className="font-semibold sm:text-2xl md:text-8xl text-blue-400">
        Scale Practice
      </h1>
      <h2 className="sm:text-sm md:text-2xl">Exams Soon {">:("}</h2>
      <Select onValueChange={(value) => handleGradeChange(value)}>
        <SelectTrigger className="text-xl">
          <SelectValue placeholder="Select Grade" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(scalesData).map((grade) => (
            <SelectItem className="text-xl" key={grade} value={grade}>
              Grade {grade}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-row space-x-2">
        <Switch
          checked={randomScale}
          onCheckedChange={(checked) => {
            setRandomScale(checked);
          }}
        ></Switch>
        <p className="text-xl">Random</p>
      </div>
      <h1 className="sm:text-3xl md:text-7xl font-semibold pb-3">
        {currentScaleName}
        <span className="text-2xl font-normal">
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

      {/* Container for VexTab rendering */}
      <div
        id="vexbox"
        className="bg-white flex rounded-xl w-min p-5"
        style={{ display: showScale ? "flex" : "none" }}
      />
      <div>
        <p className="text-blue-300">&copy; 2024 Andy Wang</p>
        <p className="text-blue-300">Made with {"<3"} in Melbourne</p>
        <p className="text-blue-300">v3.5</p>
      </div>
    </div>
  );
};

export default ScalePractice;
