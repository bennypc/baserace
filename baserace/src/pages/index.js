import { useState, useEffect } from 'react';
import {
  decimalToBinary,
  decimalToHex,
  binaryToDecimal,
  hexToDecimal,
  getRandomNumber,
  getRandomFormat
} from '../lib/utils';

const difficulties = {
  easy: 16,
  medium: 256,
  hard: 4096
};

const getCorrectAnswer = (number, from, to) => {
  if (from === 'decimal') {
    if (to === 'binary') return decimalToBinary(number);
    if (to === 'hex') return decimalToHex(number);
  }
  if (from === 'binary') {
    if (to === 'decimal') return binaryToDecimal(number).toString();
    if (to === 'hex') return decimalToHex(binaryToDecimal(number));
  }
  if (from === 'hex') {
    if (to === 'decimal') return hexToDecimal(number).toString();
    if (to === 'binary') return decimalToBinary(hexToDecimal(number));
  }
  return '';
};

export default function Home() {
  const [number, setNumber] = useState(getRandomNumber(256));
  const [currentFormat, setCurrentFormat] = useState(getRandomFormat());
  const [targetFormat, setTargetFormat] = useState(getRandomFormat());
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [difficulty, setDifficulty] = useState('medium');
  const [feedback, setFeedback] = useState('');
  const [isGameActive, setIsGameActive] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isGameActive) {
      checkAnswer();
    }
  };

  const generateNewChallenge = () => {
    let newNum = getRandomNumber(difficulties[difficulty]);
    const newFormat = getRandomFormat();

    setCurrentFormat(newFormat);

    let newTarget = getRandomFormat();
    while (newTarget === newFormat) {
      newTarget = getRandomFormat();
    }
    setTargetFormat(newTarget);

    // Convert the new number to the respective format
    if (newFormat === 'binary') {
      newNum = decimalToBinary(newNum);
    } else if (newFormat === 'hex') {
      newNum = decimalToHex(newNum);
    }
    setNumber(newNum);
  };

  useEffect(() => {
    generateNewChallenge();
  }, [difficulty]);

  useEffect(() => {
    if (isGameActive && timer > 0) {
      const tick = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(tick);
    }
    if (timer === 0) {
      setIsGameActive(false);
    }
  }, [timer, isGameActive]);

  const checkAnswer = () => {
    const correctAnswer = getCorrectAnswer(number, currentFormat, targetFormat);
    if (userAnswer === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      setFeedback('Correct!');
      generateNewChallenge();
      setUserAnswer('');
    } else {
      setFeedback('Incorrect, try again.');
      setUserAnswer('');
    }
  };

  const startGame = () => {
    setIsGameActive(true);
    setScore(0);
    setTimer(60);
    generateNewChallenge();
  };

  const resetGame = () => {
    setIsGameActive(false);
    setTimer(60);
    setScore(0);
    setFeedback('');
  };

  return (
    <div className='p-10 bg-gray-100 h-screen flex flex-col justify-center items-center'>
      <div className='flex'>
        <img src='bentot1.svg' />
        <h1 className='text-4xl font-bold tracking-wider mx-8 mt-8'>
          BaseRace by Bentot
        </h1>{' '}
        <img src='bentot2.svg' />
      </div>

      <p className='mt-4 font-hanken text-xl uppercase tracking-wider'>
        How fast can you convert between hex, decimal, and binary?
      </p>

      <ProgressBar timer={timer} />

      <div className='flex mt-8 text-xl font-hanken font-bold'>
        <div className=''>DIFFICULTY</div>
        <p className='mx-40 text-xl font-hanken font-bold'>TIMER</p>
        <p className='mb-4 text-xl font-hanken font-bold'>SCORE</p>
      </div>

      <div className='flex'>
        <div className=''>
          <select
            className='ml-2 p-1 border rounded text-3xl'
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value='easy'>E</option>
            <option value='medium'>M</option>
            <option value='hard'>H</option>
          </select>
        </div>

        <p className='text-3xl mx-48'>
          <span className='font-bold'>{timer}</span>s
        </p>

        <p className='mb-4 text-3xl'>
          <span className='font-bold'>{score}</span>
        </p>
      </div>

      <p className='mb-4 text-3xl mt-12 tracking-wider font-hanken'>
        Convert <span className='font-bold'>{currentFormat}</span> {number} to{' '}
        <span className='font-bold'>{targetFormat}</span>
      </p>
      <div className='mb-4'>
        {/* Increase the width of the input field */}
        <input
          className='p-1 border rounded w-[40rem] mr-4 font-hanken text-3xl' // <-- Adjusted width using `w-60`
          type='text'
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <p className='text-red-500 mt-2'>{feedback}</p>
        <div className='flex justify-center w-full mt-4'>
          {' '}
          {/* <-- Centered the button */}
          <button
            className='py-2 px-32 mt-4 text-lg bg-[#4E80EE] text-white font-hanken font-medium tracking-wider rounded-xl hover:bg-blue-700'
            onClick={isGameActive ? resetGame : startGame}
          >
            {isGameActive ? 'RESET GAME' : 'START GAME'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ timer }) {
  return (
    <div className='w-[50%] bg-gray-300 h-6 rounded-3xl mt-8'>
      <div
        className='bg-blue-500 h-6 rounded-3xl transition-all duration-1000'
        style={{ width: `${(timer / 60) * 100}%` }}
      ></div>
    </div>
  );
}
