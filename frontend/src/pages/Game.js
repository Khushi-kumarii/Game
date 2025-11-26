import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWinner(b) {
  for (let [a,c,d] of WIN_LINES) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  }
  return b.includes(null) ? null : "draw";
}

function emptyIndexes(board) {
  return board.map((v,i) => v === null ? i : null).filter(v => v !== null);
}

function randomMove(board) {
  const empties = emptyIndexes(board);
  return empties[Math.floor(Math.random() * empties.length)];
}

// Block or win immediate: returns index or null
function findImmediateMove(board, player) {
  for (let i of emptyIndexes(board)) {
    const copy = board.slice();
    copy[i] = player;
    if (checkWinner(copy) === player) return i;
  }
  return null;
}

// Heuristic pick for medium: center > corners > sides
function heuristicMove(board) {
  if (board[4] === null) return 4;
  const corners = [0,2,6,8].filter(i => board[i] === null);
  if (corners.length) return corners[Math.floor(Math.random()*corners.length)];
  const sides = [1,3,5,7].filter(i => board[i] === null);
  if (sides.length) return sides[Math.floor(Math.random()*sides.length)];
  return randomMove(board);
}

// Minimax algorithm
function minimax(board, player, depthLimit = Infinity, depth = 0) {
  const winner = checkWinner(board);
  if (winner === 'X') return { score: -10 + depth };
  if (winner === 'O') return { score: 10 - depth };
  if (winner === 'draw') return { score: 0 };

  if (depth >= depthLimit) { // cutoff for shallower search
    return { score: 0 };
  }

  const moves = [];
  for (let i of emptyIndexes(board)) {
    const copy = board.slice();
    copy[i] = player;
    const result = minimax(copy, player === 'O' ? 'X' : 'O', depthLimit, depth + 1);
    moves.push({ index: i, score: result.score });
  }

  let best;
  if (player === 'O') { // AI tries to maximize
    best = moves.reduce((a,b) => (b.score > a.score ? b : a));
  } else { // human tries to minimize
    best = moves.reduce((a,b) => (b.score < a.score ? b : a));
  }
  return best;
}

export default function Game() {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true); // human X first
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState({ X:0, O:0, draw:0 });
  const [playing, setPlaying] = useState(true);
  const [aiThinking, setAiThinking] = useState(false);
const [tournamentResult,setTournamentResult] = useState(null);

  useEffect(() => {
    // If it's AI turn, compute AI move
    if (!xTurn && playing) {
      setAiThinking(true);
      const t = setTimeout(() => {
        const aiMoveIndex = pickAIMove(board.slice(), level);
        if (aiMoveIndex != null) handleMove(aiMoveIndex, false);
        setAiThinking(false);
      }, 350 + level*80); // slightly slower on higher levels
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [xTurn, playing, board, level]);

  function pickAIMove(b, lvl) {
    // lvl 1..5
    if (lvl === 1) return randomMove(b);
    // lvl 2: try to win, else block, else random
    if (lvl === 2) {
      let m = findImmediateMove(b, 'O'); if (m!=null) return m;
      m = findImmediateMove(b, 'X'); if (m!=null) return m;
      return randomMove(b);
    }
    // lvl 3: try to win, block, else heuristic
    if (lvl === 3) {
      let m = findImmediateMove(b, 'O'); if (m!=null) return m;
      m = findImmediateMove(b, 'X'); if (m!=null) return m;
      return heuristicMove(b);
    }
    // lvl 4: minimax with depth limit 4 (strong)
    if (lvl === 4) {
      let m = findImmediateMove(b, 'O'); if (m!=null) return m;
      m = findImmediateMove(b, 'X'); if (m!=null) return m;
      const best = minimax(b, 'O', 4); // limit depth
      return best.index != null ? best.index : randomMove(b);
    }
    // lvl 5: full minimax (unbeatable)
    if (lvl === 5) {
      const best = minimax(b, 'O', Infinity);
      return best.index != null ? best.index : randomMove(b);
    }
    return randomMove(b);
  }

  function handleMove(i, byHuman=true) {
    if (!playing || board[i]) return;
    const current = byHuman ? 'X' : 'O';
    const newBoard = board.slice();
    newBoard[i] = current;
    setBoard(newBoard);
    const result = checkWinner(newBoard);
    if (result) {
      setPlaying(false);
      if (result === 'X') setScore(s => ({...s, X: s.X + 1}));
      else if (result === 'O') setScore(s => ({...s, O: s.O + 1}));
      else setScore(s => ({...s, draw: s.draw + 1}));
      // show short message then progress
      setTimeout(() => {
        if (level < 5) {
          setLevel(l => l + 1);
          setBoard(Array(9).fill(null));
          setPlaying(true);
          setXTurn(true); // human starts every level
        } else {
          // tournament over
// tournament over
const finalWinner =
(score.X + (result==='X'?1:0) > score.O + (result==='O'?1:0)) ? 'You (X)' :
(score.X + (result==='X'?1:0) < score.O + (result==='O'?1:0)) ? 'Computer (O)' : 'Draw';

setTimeout(() => {
  setTournamentResult({
     you: score.X + (result==='X'?1:0),
     comp: score.O + (result==='O'?1:0),
     winner: finalWinner
  });
}, 800);
          // after showing, go back to home or restart
        }
      }, 500);
    } else {
      setXTurn(!xTurn);
    }
  }

  function handleCellClick(i) {
    if (!xTurn || aiThinking) return; // only human turn
    handleMove(i, true);
  }

  function restartTournament() {
    setBoard(Array(9).fill(null));
    setLevel(1);
    setScore({X:0,O:0,draw:0});
    setXTurn(true);
    setPlaying(true);
  }
return (
  <div className="min-h-screen w-full flex flex-col items-center justify-center 
    bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">

    <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg">
          ✦ Tic-Tac-Toe Tournament ✦
        </h1>
        <button onClick={()=>navigate('/')}
          className="px-3 py-1 text-sm font-semibold rounded-md bg-gradient-to-r from-red-500 to-red-700 hover:scale-110 transition">
          Logout
        </button>
      </div>

      {/* Level */}
      <div className="text-center mb-4">
        <p className="text-lg font-medium">Level <span className="text-yellow-400 font-bold">{level}/5</span></p>
        <p className="text-sm opacity-90 mt-1">Mode: 
           <span className="text-green-300 font-semibold">
            {['Random','Block','Heuristic','Hard','Unbeatable'][level-1]}
           </span>
        </p>
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-3 mx-auto mb-6">
        {board.map((cell,i)=>(
          <div key={i} onClick={()=>handleCellClick(i)}
            className="w-24 h-24 flex items-center justify-center rounded-xl cursor-pointer
            font-bold text-5xl bg-white/10 hover:bg-white/20 border border-white/30 hover:scale-105 
            transition select-none shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <span className={`${cell==='X'?'text-cyan-300 drop-shadow-[0_0_6px_cyan]':''}
                              ${cell==='O'?'text-pink-400 drop-shadow-[0_0_6px_hotpink]':''}`}>
              {cell}
            </span>
          </div>
        ))}
      </div>

      {/* Score & controls */}
      <div className="flex justify-between items-center text-sm">
        <div className="space-y-1">
          <p>You (X): <span className="text-cyan-300 font-bold">{score.X}</span></p>
          <p>Computer (O): <span className="text-pink-400 font-bold">{score.O}</span></p>
          <p>Draws: <span className="text-yellow-300 font-bold">{score.draw}</span></p>
        </div>

        <div>
          <button onClick={restartTournament}
            className="px-4 py-2 mr-2 rounded-lg font-semibold bg-gradient-to-br from-green-400 to-green-600 hover:scale-110 transition shadow-md">
            Reset Game
          </button>
          <button onClick={()=>{ setBoard(Array(9).fill(null)); setPlaying(true); setXTurn(true); }}
            className="px-4 py-2 rounded-lg font-semibold bg-gradient-to-br from-yellow-400 to-yellow-600 hover:scale-110 transition shadow-md">
            Reset Level
          </button>
        </div>
      </div>

      {aiThinking && <p className="text-center mt-3 animate-pulse text-gray-300">🤖 AI is thinking...</p>}
    </div>

    <p className="mt-4 text-xs text-gray-300 italic">You always play <span className="text-cyan-300">X</span>.</p>


    {/* WINNER MODAL (New UI instead of alert) */}
    {tournamentResult && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-white/10 border border-white/20 rounded-2xl p-8 w-[350px] text-center shadow-2xl">

          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-300 to-cyan-400 text-transparent bg-clip-text drop-shadow-lg">
            🏆 Tournament Completed!
          </h2>

          <div className="my-4 text-lg space-y-2">
            <p>You: <span className="font-bold text-cyan-300">{tournamentResult.you}</span></p>
            <p>Computer: <span className="font-bold text-pink-400">{tournamentResult.comp}</span></p>
            <p className="mt-2 text-xl font-bold text-yellow-300">Winner: {tournamentResult.winner}</p>
          </div>

          <button onClick={()=>{setTournamentResult(null); restartTournament();}}
            className="px-5 py-2 rounded-lg font-semibold text-lg
            bg-gradient-to-r from-purple-500 to-blue-600 hover:scale-110 transition-all mt-3 shadow-md text-white">
            Restart Tournament
          </button>

        </div>
      </div>
    )}

  </div>
);


}
