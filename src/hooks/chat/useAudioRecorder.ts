import { useCallback, useRef, useState } from "react";

export interface AudioRecorderState {
  recording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  recordingSeconds: number;
}

export function useAudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
      };

      mr.start();
      setRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch {
      console.error("Microphone access denied");
    }
  }, []);

const stop = useCallback(() => {
  if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
    mediaRecorderRef.current.stop();
  }
  setRecording(false);
  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
}, []);
  const clear = useCallback(() => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingSeconds(0);
  }, []);

  return { recording, audioBlob, audioUrl, recordingSeconds, start, stop, clear };
}