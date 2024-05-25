import React, { useState } from "react";
import { detect, get } from "@tonaljs/scale";
import scalesData from "../lib/scales.json";

const TypeScaleChallenge: React.FC = () => {
  const majors = get("C major")
    .notes.map((note) => `${note} major`)
    .sort();

  const minors = get("C major")
    .notes.map((note) => `${note} minor`)
    .sort();

  const harmonics = get("C major")
    .notes.map((note) => `${note} harmonic minor`)
    .sort();

  const melodic = get("C major")
    .notes.map((note) => `${note} melodic minor`)
    .sort();

  const blues = get("C blues")
    .notes.map((note) => `${note} blues`)
    .sort();

  const chromatic = get("C chromatic")
    .notes.map((note) => `${note} chromatic`)
    .sort();

  const [customScales, setCustomScales] = useState<string[]>([]);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>("major");
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
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
      if (currentMode === "random") {
        const nextScaleIndex = Math.floor(Math.random() * currentScales.length);
        setCurrentScaleIndex(nextScaleIndex);
      } else {
        setCurrentScaleIndex((currentScaleIndex + 1) % currentScales.length);
      }
      setCorrectAnswers(correctAnswers + 1);
      setUserInput("");
      if (correctAnswers === 9) {
        handleReset();
      }
    } else {
     
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
    <div
    >
    </div>
  );
};

export default TypeScaleChallenge;
