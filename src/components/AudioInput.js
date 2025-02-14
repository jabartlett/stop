import React, { useState, useEffect } from 'react';

const AudioInput = () => {
  const [audioStream, setAudioStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioContext, setAudioContext] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const source = context.createMediaStreamSource(stream);
      const analyzer = context.createAnalyser();
      
      source.connect(analyzer);
      // Comment out the following line if you don't want to hear the audio
      // analyzer.connect(context.destination);
      
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
    <div className="audio-input">
      <button 
        onClick={isRecording ? stopRecording : startRecording}
        className={`button ${isRecording ? 'recording' : ''}`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {isRecording && <div className="recording-indicator">Recording...</div>}
    </div>
  );
};

export default AudioInput; 