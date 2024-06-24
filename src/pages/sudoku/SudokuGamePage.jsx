import React from "react";
import { useLocation } from "react-router-dom";
import {
  Segment,
  Header,
  Container,
  Grid,
  GridColumn,
} from "semantic-ui-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CSRFToken from "../../utils/CsrfToken";
import IsButton from "../../components/IsButton";
import PausedSudokuBoard from "./PausedBoardComponent";
import SudokuBoard from "./BoardComponent";
import SolutionBoard from "./SolutionBoardComponent";
import Timer from "../../components/Timer";
import Cookies from "js-cookie";

const SudokuGame = () => {
  const location = useLocation();
  const puzzle = location.state ? location.state.current_state : [];
  const difficulty = location.state ? location.state.difficulty : "";
  const gameid = location.state ? location.state.gameid : "";
  const time = location.state ? location.state.time : 0;
  const user = location.state ? location.state.userid : "";
  const solution = location.state ? location.state.solution : [];
  const [showSolution, setShowSolution] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [timerTime, setTimerTime] = useState(time);
  const [currentBoard, setCurrentBoard] = useState(puzzle); // Initialize with the initial puzzle.
  const [stop, setStop] = useState(false);
  const navigate = useNavigate();
  var token = Cookies.get("csrftoken");

  const handleBoardChange = (newBoard) => {
    setCurrentBoard(newBoard);
  };

  const handleGiveUp = () => {
    setShowSolution(true);
    console.log(solution);
    console.log(puzzle)
    setStop(true);
    setIsTimerActive(false);
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/sudoku/giveUp`,
        {
          gameid: gameid,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Game given up:", response.data);
        console.log(response);
      })
      .catch((error) => {
        console.error("Failed to give up game:", error);
      });
  };

  useEffect(() => {
    if (isTimerActive) {
      const timerId = setInterval(() => {
        setTimerTime((timerTime) => timerTime + 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [isTimerActive]);

  const saveTime = () => {
    // console.log('Save time:', timerTime);
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/sudoku/updateTime`,
        {
          sudoku_id: gameid,
          time: timerTime,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        // console.log('Time saved:', response.data);
      })
      .catch((error) => {
        console.error("Failed to save time:", error);
      });
  };

  const saveGame = () => {
    console.log("Save game:", gameid);
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/sudoku/saveGame`,
        {
          gameid: gameid,
          userid: user,
          current_state: currentBoard,
          time: timerTime,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Game saved:", response.data);
      })
      .catch((error) => {
        console.error("Failed to save game:", error);
      });
  };

  const [errors, setErrors] = useState({ rows: [], columns: [], boxes: [] });
  useEffect(() => {
    if (
      errors &&
      (errors.rows.length || errors.columns.length || errors.boxes.length)
    ) {
      const errorTimeout = setTimeout(() => {
        // Clear the errors from state here if necessary
        setErrors({ rows: [], columns: [], boxes: [] });
      }, 1000); // Match this duration to your CSS animation

      return () => clearTimeout(errorTimeout);
    }
  }, [errors]);

  const checkSolution = () => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/sudoku/checkSolution`,
        {
          board: currentBoard, // Adjust with the correct format
        },
        {
          headers: { "Content-Type": "application/json", "X-CSRFToken": token },
          withCredentials: true,
        }
      )
      .then((response) => {
        const { status, isCorrect, errors } = response.data;
        console.log("Response:", response.data);
        console.log("Status:", status);
        console.log("Correct:", isCorrect ? "Yes" : "No");
        console.log("Errors:", errors);
        if (status === "success") {
          console.log("Solution checked:", isCorrect);

          if (isCorrect) {
            alert("Congratulations! Correct solution.");
          } else {
            alert("Incorrect solution.");
            setErrors(errors);
            console.log("Errors:", errors);
          }
          // handle game win logic here
        } else {
          console.log("Issue sending");
        }
      })
      .catch((error) => {
        console.error("Error checking solution:", error);
      });
  };

  const backToMenu = () => {
    console.log("Back to menu");
    navigate("/apps/sudoku");
  };

  const noop = () => {};

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  return (
    <>
      <Container
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Segment style={{ display: "flex", flexDirection: "column" }}>
          {!showSolution && (
            <>
              <Header as="h3">Game Controls</Header>
              <IsButton
                label="Check"
                color="green"
                style={{ marginBottom: "1em" }}
                onClick={checkSolution}
              ></IsButton>
              <IsButton
                label={isTimerActive ? "Pause" : "Resume"}
                color="grey"
                style={{ marginBottom: "1em" }}
                onClick={toggleTimer}
              ></IsButton>
              <IsButton
                label="Save Game"
                color="blue"
                style={{ marginBottom: "1em" }}
                onClick={saveGame}
              ></IsButton>
              <IsButton
                label="Give Up"
                color="red"
                onClick={handleGiveUp}
              ></IsButton>
            </>
          )}
          {showSolution && (
            <>
              <Header as="h3">Back to Menu</Header>
              <IsButton
                label="Back"
                color="blue"
                onClick={backToMenu}
              ></IsButton>
            </>
          )}
        </Segment>
        <Segment>
          {!showSolution && (
            <>
              <Grid
                columns={3}
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <GridColumn align="left">
                  <Header as="h3" style={{ textTransform: "capitalize" }}>
                    {difficulty} Sudoku
                  </Header>
                </GridColumn>
                <GridColumn></GridColumn>
                <GridColumn align="right">
                  <Timer
                    isActive={isTimerActive}
                    onStop={stop}
                    onTimeChange={saveTime}
                    initialTime={timerTime}
                  />
                </GridColumn>
              </Grid>
              {isTimerActive && (
                <SudokuBoard
                  current_state={puzzle}
                  onBoardChange={handleBoardChange}
                  errors={errors}
                />
              )}
              {!isTimerActive && (
                <>
                  <br />
                  <PausedSudokuBoard />
                </>
              )}
            </>
          )}
          <br />
          {showSolution && (
            <>
              <Grid
                columns={3}
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <GridColumn align="left">
                  <Header as="h3" style={{ textTransform: "capitalize" }}>
                    Game Over - Lost
                  </Header>
                </GridColumn>
                <GridColumn></GridColumn>
                <GridColumn align="right">
                  <Timer
                    isActive={isTimerActive}
                    onStop={stop}
                    onTimeChange={saveTime}
                    initialTime={timerTime}
                  />
                </GridColumn>
              </Grid>
              <br />
                <SolutionBoard puzzle={puzzle} solution={solution} />
            </>
          )}
        </Segment>
      </Container>
    </>
  );
};

export default SudokuGame;
