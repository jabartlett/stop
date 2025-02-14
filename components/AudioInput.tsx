'use client';

import { useState, useEffect } from 'react';

const AudioInput = () => {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const source = context.createMediaStreamSource(stream);
      const analyzer = context.createAnalyser();
      
      source.connect(analyzer);
      
      setAudioStream(stream);
      setAudioContext(context);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      if (audioContext) {
        audioContext.close();
      }
      setAudioStream(null);
      setAudioContext(null);
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <div>
      <button 
        onClick={isRecording ? stopRecording : startRecording}
        className={`${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white px-4 py-2 rounded`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {isRecording && <div className="text-red-500 font-bold mt-2">Recording...</div>}
    </div>
  );
};

export default AudioInput; 