'use client';

import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

const AudioInput = () => {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    // Initialize TensorFlow.js
    tf.setBackend('webgl');
  }, []);

  const processAudioData = () => {
    if (!analyzerRef.current || !dataArrayRef.current) return;

    analyzerRef.current.getFloatTimeDomainData(dataArrayRef.current);
    
    // Convert audio data to tensor
    const tensor = tf.tensor1d(dataArrayRef.current);
    
    // Example processing: Calculate RMS (Root Mean Square) amplitude
    const rms = tf.sqrt(tf.mean(tf.square(tensor)));
    
    // Clean up tensor to prevent memory leaks
    tensor.dispose();
    
    if (isRecording) {
      requestAnimationFrame(processAudioData);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const source = context.createMediaStreamSource(stream);
      const analyzer = context.createAnalyser();
      
      analyzer.fftSize = 2048;
      source.connect(analyzer);
      
      analyzerRef.current = analyzer;
      dataArrayRef.current = new Float32Array(analyzer.frequencyBinCount);
      
      setAudioStream(stream);
      setAudioContext(context);
      setIsRecording(true);

      // Start processing audio data
      processAudioData();
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
      analyzerRef.current = null;
      dataArrayRef.current = null;
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