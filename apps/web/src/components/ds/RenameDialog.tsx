import React, { useEffect, useRef, useState } from "react";
import { socket } from "@utils/game-socket";

const prohibitedWords = [
  "abuse",
  "adult",
  "ass",
  "bastard",
  "bitch",
  "boob",
  "bullshit",
  "cock",
  "crap",
  "cunt",
  "damn",
  "dick",
  "dildo",
  "douche",
  "fag",
  "faggot",
  "fuck",
  "fucker",
  "fucking",
  "gay",
  "goddamn",
  "hell",
  "homo",
  "jerk",
  "kike",
  "lesbian",
  "masturbate",
  "motherfucker",
  "nigga",
  "nigger",
  "penis",
  "piss",
  "porn",
  "prick",
  "pussy",
  "queer",
  "rape",
  "rapist",
  "retard",
  "scrotum",
  "shit",
  "shitty",
  "slut",
  "spic",
  "tits",
  "twat",
  "vagina",
  "wank",
  "whore",
  "wop",
  "anal",
  "anus",
  "balls",
  "banging",
  "bareback",
  "beaver",
  "bestiality",
  "blowjob",
  "boner",
  "bukkake",
  "camgirl",
  "carpetmuncher",
  "chink",
  "circlejerk",
  "cleavage",
  "clit",
  "clitoris",
  "clusterfuck",
  "cockblock",
  "coitus",
  "cum",
  "cumming",
  "cunnilingus",
  "deepthroat",
  "dickhead",
  "dildo",
  "dyke",
  "fingering",
  "foreskin",
  "gangbang",
  "handjob",
  "hardcore",
  "humping",
  "jizz",
  "kike",
  "kink",
  "kinky",
  "kunt",
  "milf",
  "muff",
  "nazi",
  "orgasm",
  "pecker",
  "peeping",
  "penetration",
  "piss",
  "poop",
  "porno",
  "pound",
  "queef",
  "rimjob",
  "scat",
  "sex",
  "sexy",
  "shag",
  "shemale",
  "spunk",
  "strapon",
  "titties",
  "titty",
  "tranny",
  "vulva",
  "wank",
  "wetback",
  "wop",
  "uhmarlon",
  "marlon",
  "admin",
  "discord",
  "nigger",
  "nega",
  "hurensohn",
];

const isNameValid = (name: string): boolean => {
  if (name.length > 15) {
    return false;
  }
  for (const word of prohibitedWords) {
    if (name.toLowerCase().includes(word.toLowerCase())) {
      return false;
    }
  }
  return true;
};

const RenameDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newName: string) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newName.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    if (newName.length > 15) {
      setError("Name cannot be longer than 15 characters.");
      return;
    }
    if (!isNameValid(newName.trim())) {
      setError("Name contains prohibited words.");
      return;
    }
    onSubmit(newName.trim());
    socket.emit("rename", newName);
    setNewName("");
    setError("");
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800/50 backdrop-blur-lg flex justify-center items-center z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-gttpurple/60 rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Who are you?</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              id="newName"
              name="newName"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gttgold focus:outline-none focus:ring-2 focus:ring-gttgold focus:border-gttgold"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setError("");
              }}
              ref={inputRef}
              placeholder="Enter new name"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameDialog;
