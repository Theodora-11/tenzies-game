import Die from './Die.jsx';
import React from 'react';
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import {useWindowSize} from 'react-use';


export default function App() {

  const [dices, setDices] = React.useState(() => generateAllNewDice());
  const {width, height} = useWindowSize();
  const buttonRef = React.useRef(null);

  const gameWon = (
    dices.every(dice => dice.isHeld) &&
    dices.every(dice => dice.value === dices[0].value)
  )

  React.useEffect(() => {
    if(gameWon) {buttonRef.current.focus()}
  }, [gameWon])
  
  function generateAllNewDice() {
    return new Array(10)
    .fill(1)
    .map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }))

  }

   const diceFaces = dices.map(numObj => 
    <Die 
      key={numObj.id} 
      value={numObj.value} 
      isHeld={numObj.isHeld}
      holdDice={() => holdDice(numObj.id)}
    />
  )

  function rollDices() {

    if(!gameWon) {
      setDices(prevDices=> (
        prevDices.map(dice => (
          dice.isHeld ? dice : {...dice, value: Math.ceil(Math.random() * 6)}
        ))
      ))

    } else {
      setDices(generateAllNewDice());
    }

  }


  return (
    <div className="wrapperProject">
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. 
      Click each die to freeze it at its current value between rolls.</p>
      <main className="main">
      {gameWon && 
      <Confetti 

        width={width} 
        height={height}
        numberOfPieces={250}
        gravity={0.2}
        opacity={0.9}
        drawShape={ctx => {
          const shape = Math.floor(Math.random() * 3);

          ctx.beginPath();
          switch (shape) {
            case 0: 
              ctx.arc(0, 0, 4, 0, 2 * Math.PI); 
              break;
            case 1:
              ctx.rect(-4, -4, 8, 8);
              break;
            case 2: 
              ctx.rect(-1.5, -8, 3, 16); 
              break;
          }
          ctx.fill();
        }}
            
      />}

        <div className="sr-only" aria-live="polite">
          {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
        </div>
        <div className="wrapper-buttons">
          {diceFaces}
        </div>

        <button 
          ref={buttonRef}
          className='roll-btn'
          onClick={rollDices}
        >{gameWon ? 'New game' : 'Roll'}</button>
      </main>
    </div>
  )
}