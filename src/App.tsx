import React, {useEffect, useState} from 'react';
import './App.css';

interface Vrsta {
  porodicaLat: string,
  porodicaHrv: string,
  nazivHrv: string,
  nazivLat: string,
  hrana: string,
  img: string,
  sortVal: number
}

const App = () => {

  const [veggies, setVeggies] = useState<Vrsta[]>([]);
  const [idx, setIdx] = useState<number> (0);
  const [revealAnswer, setRevealAnswer] = useState<boolean> (false);

  useEffect(() => {
    fetch('/data/veggies.json')
      .then(r => r.json())
      .then(r => {

        let arr: Vrsta[] = [];

        r.forEach((data: any) => {
          data.vrste.forEach((vrsta: any) => {
            for(let i = 1; i <= vrsta.numOfImages; ++i)
              arr.push({
                porodicaLat: data.porodica,
                porodicaHrv: data.name,
                nazivHrv: vrsta.name,
                nazivLat: vrsta.latinName,
                hrana: vrsta.food,
                img: `${data.porodica}/${vrsta.folderName}/${i}.jpg`,
                sortVal: Math.random()
              });
          })
        });

        setVeggies(arr.sort((a: Vrsta, b: Vrsta) => a.sortVal - b.sortVal));
      });
  }, []);

  const showAnswer = () => setRevealAnswer(true);
  const next = () => {

    if(idx + 1 >= veggies.length)
      setIdx(0);
    else
      setIdx(prevState => prevState + 1);

    setRevealAnswer(false);
  };

  if(veggies.length > 0)
    return (
      <div className="App">
        <img src={`assets/${veggies[idx].img}`} alt={veggies[idx].sortVal.toString()} />
        {
          revealAnswer &&
          <div className="veggie-data">
            <table>
              <tr><td>Porodica latinski: </td><td>{veggies[idx].porodicaLat}</td></tr>
              <tr><td>Porodica hrvatski: </td><td>{veggies[idx].porodicaHrv}</td></tr>
              <tr><td>Naziv latinski: </td><td>{veggies[idx].nazivLat}</td></tr>
              <tr><td>Naziv hrvatski: </td><td>{veggies[idx].nazivHrv}</td></tr>
              <tr><td>Cilj uzgoja: </td><td>{veggies[idx].hrana}</td></tr>
            </table>
          </div>
        }
        {
          !revealAnswer ?
            <button className="btn" onClick={() => showAnswer()}>Prikaži odgovor</button>
            :
            <button className="btn" onClick={() => next()}>Dalje</button>
        }
      </div>
    );
  else
    return (<>Loading</>)
}

export default App;
