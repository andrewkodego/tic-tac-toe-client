import { React, useState, useEffect, createContext, useContext } from "react";

const PlayerContext = createContext();

function TicTacToe(){

    const [player, setPlayer] = useState("X");
    const [moves, setMoves] = useState([{
        "box_1": 0,
        "box_2": 0,
        "box_3": 0,
        "box_4": 0,
        "box_5": 0,
        "box_6": 0,
        "box_7": 0,
        "box_8": 0,
        "box_9": 0,
    }]);

    const [winner, setWinner] = useState("");
    const [status, setStatus] = useState("");


    const togglePlayer = (field) =>{
        setMoves(values=>({...values, [field]: player == "O" ? 1 : -1}));
        setPlayer(player == "O" ? "X" : "O");
    }

    useEffect(() => { 
        doCheckMoves();
     }, [moves])

    const doCheckMoves = () => {
        if(status != 'end'){
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( moves )  
            };
            fetch("/checkmoves", options)
            .then((res) => res.json())
            .then((res) => {           
                let resStatus =  res.message;
                setWinner(resStatus);

                if(resStatus == "Player O win!" || resStatus == "Player X win!"){
                    setStatus('end');
                }

            });
        }
    }

    const restartGame=()=>{
        
    }

    return(
        <div>
            <PlayerContext.Provider value={{player, togglePlayer, status}}>
                <div>
                    <TicBox fieldName="box_1"/>
                    <TicBox fieldName="box_2"/>
                    <TicBox fieldName="box_3"/>
                </div>
                <div>
                    <TicBox fieldName="box_4"/>
                    <TicBox fieldName="box_5"/>
                    <TicBox fieldName="box_6"/>
                </div>
                <div>
                    <TicBox fieldName="box_7"/>
                    <TicBox fieldName="box_8"/>
                    <TicBox fieldName="box_9"/>
                </div>
            </PlayerContext.Provider>
            <div>{winner}</div>
            <div><button onClick={restartGame}>RESTART</button></div>
        </div>
    )
}

function TicBox({ fieldName }){

    const {player, togglePlayer, status} = useContext(PlayerContext);

    const [playerChar, setPlayerChar] = useState('');
    const [hasMoved, setHasMoved] = useState('');

    const onClickHandler = (event) => {
        if(playerChar == '' && status != 'end'){
            setPlayerChar(player);
            setHasMoved("hasMove");
            togglePlayer(event.currentTarget.dataset.field);
        }
    }

    return (
        <div className={"square " + hasMoved } onClick={onClickHandler} data-field={fieldName}>
            {playerChar}
        </div>
    )
}

export default TicTacToe;