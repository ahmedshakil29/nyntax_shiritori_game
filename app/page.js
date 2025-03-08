"use client";
import React, { useRef, useState } from "react";

const Home = () => {
  const [usedWords, setUsedWords] = useState([]);
  const [playerActive, setPlayerActive] = useState(1);
  const [currentWord, setCurrentWord] = useState("");
  const [error, setError] = useState("");
  const [scores, setScores] = useState({ 1: 0, 2: 0 });

  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);

  const getLastLetter = () => {
    if (usedWords.length === 0) return "";
    return usedWords[usedWords.length - 1].slice(-1).toUpperCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${currentWord}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const lowerWord = currentWord.toLowerCase();
          const lastWord = usedWords[usedWords.length - 1];
          const lastLetter = lastWord ? lastWord.slice(-1) : null;

          const points = lastLetter && lowerWord.startsWith(lastLetter) ? 5 : 3;
          setScores((prevScores) => ({
            ...prevScores,
            [playerActive]: prevScores[playerActive] + points,
          }));

          setUsedWords((prevWords) => [...prevWords, lowerWord]);
          setCurrentWord("");
          setError("");

          setPlayerActive(playerActive === 1 ? 2 : 1);
        } else {
          alert("This word does not exist in the dictionary");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="mb-4">
          <h2 className="text-xl font-bold mb-2">
            Player 1 (Score: {scores[1]})
          </h2>
          <input
            placeholder={playerActive === 1 ? getLastLetter() : ""}
            disabled={playerActive !== 1}
            className="w-full p-2 border rounded-md mb-2"
            value={playerActive === 1 ? currentWord : ""}
            type="text"
            ref={inputRef1}
            onChange={(e) => setCurrentWord(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white p-2 rounded-md"
            type="submit"
          >
            Submit
          </button>
          {playerActive === 1 && error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </form>
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mt-5">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-2">
            Player 2 (Score: {scores[2]})
          </h2>
          <input
            placeholder={playerActive === 2 ? getLastLetter() : ""}
            disabled={playerActive !== 2}
            className="w-full p-2 border rounded-md mb-2"
            value={playerActive === 2 ? currentWord : ""}
            type="text"
            ref={inputRef2}
            onChange={(e) => setCurrentWord(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white p-2 rounded-md"
            type="submit"
          >
            Submit
          </button>
          {playerActive === 2 && error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </form>
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mt-5">
        <h3 className="text-lg font-bold mb-2">Used Words</h3>
        <ul className="list-disc list-inside">
          {usedWords.map((word, index) => (
            <li key={index} className="text-gray-700">
              {word}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
