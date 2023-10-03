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
      <h1 className='text-4xl font-bold mb-6'>BaseRace by Bentot</h1>
      <p className='mb-2 text-xl'>
        Time left: <span className='font-bold'>{timer}</span> seconds
      </p>
      <ProgressBar timer={timer} />
      <p className='mb-4 text-xl mt-4'>
        Score: <span className='font-bold'>{score}</span>
      </p>
      <div className='mb-4'>
        Difficulty:
        <select
          className='ml-2 p-1 border rounded'
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value='easy'>Easy</option>
          <option value='medium'>Medium</option>
          <option value='hard'>Hard</option>
        </select>
      </div>
      <p className='mb-4 text-xl'>
        Convert <span className='font-bold'>{currentFormat}</span> {number} to{' '}
        <span className='font-bold'>{targetFormat}</span>
      </p>
      <div className='mb-4'>
        <input
          className='p-1 border rounded mr-4'
          type='text'
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          disabled={!isGameActive}
          className='py-1 px-4 bg-blue-500 text-white rounded hover:bg-blue-700'
          onClick={checkAnswer}
        >
          Submit
        </button>
        <p className='text-red-500 mt-2'>{feedback}</p>
        <button
          className='py-1 px-4 bg-green-500 text-white rounded hover:bg-green-700 mt-4'
          onClick={isGameActive ? resetGame : startGame}
        >
          {isGameActive ? 'Reset Game' : 'Start Game'}
        </button>
      </div>
    </div>
  );
}

function ProgressBar({ timer }) {
  return (
    <div className='w-[50%] bg-gray-300 h-4 rounded'>
      <div
        className='bg-red-500 h-4 rounded transition-all duration-1000'
        style={{ width: `${(timer / 60) * 100}%` }}
      ></div>
    </div>
  );
}
