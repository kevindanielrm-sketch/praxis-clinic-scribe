import { useState } from "react";
import { Button } from "@/components/ui/button";

export const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording simulation
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Store interval to clear later
      (window as any).recordingInterval = interval;
    } else {
      // Stop recording
      clearInterval((window as any).recordingInterval);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Clinical Recording</h2>
        <p className="text-muted-foreground">
          {isRecording 
            ? "Recording your clinical notes..." 
            : "Click to start recording your patient consultation"
          }
        </p>
      </div>

      <div className="relative mb-8">
        <button
          onClick={toggleRecording}
          className={`recording-button ${isRecording ? 'recording' : ''}`}
        >
          <span className="material-icons text-white text-3xl">
            {isRecording ? 'stop' : 'mic'}
          </span>
        </button>
        
        {isRecording && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        )}
      </div>

      {isRecording && (
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-accent mb-2">
            {formatTime(recordingTime)}
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Recording active</span>
          </div>
        </div>
      )}

      {!isRecording && recordingTime === 0 && (
        <div className="text-center max-w-md">
          <p className="text-sm text-muted-foreground mb-4">
            Speak naturally during your patient consultation. ClinicalNotes will automatically:
          </p>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <span className="material-icons text-accent text-sm">check_circle</span>
              <span>Transcribe conversation accurately</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons text-accent text-sm">check_circle</span>
              <span>Structure notes in SOAP format</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons text-accent text-sm">check_circle</span>
              <span>Suggest ICD-10 codes</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};