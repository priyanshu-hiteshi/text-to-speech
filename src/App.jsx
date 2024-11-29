import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import './index.css';
import bg from './assets/bg.jpg';

const App = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false); // New state to track speaking status

  // Fetch available voices from the SpeechSynthesis API
  useEffect(() => {
    const fetchVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name); // Set default voice
      }
    };

    // Safari needs this timeout for voice fetching
    fetchVoices();
    window.speechSynthesis.onvoiceschanged = fetchVoices;
  }, []);

  // Function to convert text to speech
  const handleTextToSpeech = () => {
    if (text.trim()) {
      const utterance = new SpeechSynthesisUtterance(text);
      console.log(utterance);
      

      // Set selected voice
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) utterance.voice = voice;

      // Set pitch and rate
      utterance.pitch = pitch;
      utterance.rate = rate;

      // Set isSpeaking state to true when speech starts
      setIsSpeaking(true);

      // Speak the text
      window.speechSynthesis.speak(utterance);

      // Event listener for when speech ends
      utterance.onend = () => {
        setIsSpeaking(false); // Set isSpeaking to false when speech ends
      };
    } else {
      alert('Please enter some text to convert to audio');
    }
  };

  return (
    <div className='flex justify-center items-center w-[100%] h-[100vh] bg-white' style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className='flex flex-col gap-4 justify-center items-center bg-white border shadow-xl px-10 w-[700px] h-[400px] rounded-[50px] p-4'>
        <h1 className="font-bold mb-8 text-xl text-black text-center font-poppins tracking-wide">Text to Audio Converter</h1>

        {/* MUI Input Field */}
        <div className='flex flex-row w-[100%] items-center justify-between'>
          <div className='w-[100%]'>
            <TextField
              label="Enter Text"
              variant="outlined"
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mb-4 w-[100%]"
            />
          </div>

          {/* Volume Icon with Three Dots Animation */}
          <div className='bg-white px-2 py-4 shadow-lg border rounded-xl ml-4 cursor-pointer' onClick={handleTextToSpeech}>
            <VolumeUpOutlinedIcon fontSize='20' />
             {/* Show Three Dots animation while speaking */}
        {isSpeaking && (
          <div className="text-xl font-semibold text-black mt-2">...</div>
        )}
          </div>
        </div>

       

        {/* Voice Selection Dropdown */}
        <FormControl fullWidth className="mb-4">
          <Select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
          >
            {voices.map((voice, index) => (
              <MenuItem key={index} value={voice.name}>
                {voice.name} {voice.lang && `(${voice.lang})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default App;
