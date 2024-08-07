import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import scalesData from "@/lib/scales.json";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Scale, { get } from "@tonaljs/scale";
import { Switch } from "./ui/switch";
type ScalesData = {
  [grade: string]: {
    scales: string[];
    chromatic: string;
    arpeggios: string[];
    blues?: string;
  };
};

type TimeData = {
  time: number;
  scale: string;
};

const ArpeggioSpeedChallenge: React.FC = () => {
  const [currentGrade, setCurrentGrade] = useState<number>(0);
  const [currentScaleName, setCurrentScaleName] = useState<string>("");
  const [currentScale, setCurrentScale] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [times, setTimes] = useState<TimeData[]>([]);
  const [started, setStarted] = useState<boolean>(false);
  const [isRandom, setIsRandom] = useState<boolean>(false);

  useEffect(() => {
    const gradeData = (scalesData as ScalesData)[currentGrade];
    if (gradeData && gradeData.scales.length > 0) {
      setCurrentScale(gradeData.scales[0]);
    }
  }, [currentGrade]);

  useEffect(() => {
    if (currentScale) {
      setCurrentScaleName(currentScale);
    }
  }, [currentScale]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (startTime !== null) {
      timer = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100); // Update every 100 milliseconds
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(timer);
  }, [startTime]);

  const handleNext = () => {
    if (started) {
      setStartTime(Date.now());
    }
    const scales = (scalesData as ScalesData)[currentGrade].scales;
    const scaleIndex = scales.indexOf(currentScale);
    if (isRandom) {
      const randomIndex = Math.floor(Math.random() * scales.length);
      setCurrentScale(scales[randomIndex]);
    } else {
      if (scaleIndex === scales.length - 1) {
        setCurrentScale(scales[0]);
      } else {
        setCurrentScale(scales[scaleIndex + 1]);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (startTime === null && !started) {
      setStartTime(Date.now());
      setStarted(true);
    }
    let notes = [1, 3, 5].map(Scale.degrees(currentScaleName));
    if (event.target.value === notes.join(",").toLowerCase()) {
      const time = Date.now() - startTime!;
      setTimes((prev) => [...prev, { time, scale: currentScaleName }]);
      setStartTime(null);
      handleNext();
      event.target.value = "";
    }
  };

  return (
    <div className="p-10 flex flex-col w-full h-full space-y-3">
      <h1 className="text-4xl font-semibold">Arpeggio Speed Challenge</h1>
      <div className="flex flex-row space-x-3">
        <Switch
          onCheckedChange={(e) => {
            setIsRandom(e);
          }}
        />
        <p>Random?</p>
      </div>
      <Select onValueChange={(value) => setCurrentGrade(parseInt(value))}>
        <SelectTrigger className="text-xl">
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
      <h1 className="text-3xl font-semibold">{currentScaleName}</h1>
      <Input placeholder="Enter notes 1,3 and 5" onChange={handleInputChange} />
      <Button onClick={handleNext}>Next</Button>
      <Button
        onClick={() => {
          setTimes([]);
          setStarted(false);
          setStartTime(null);
        }}
      >
        Reset
      </Button>

      <div className="text-xl font-semibold">
        Time elapsed: {(elapsedTime / 1000).toFixed(2)} seconds
      </div>
      {times.map(
        (time, index) =>
          index < 5 && (
            <div key={index} className="text-xl text-blue-300">
              {index + 1}. {time.scale} {time.time / 1000} seconds
            </div>
          ),
      )}
    </div>
  );
};

export default ArpeggioSpeedChallenge;
