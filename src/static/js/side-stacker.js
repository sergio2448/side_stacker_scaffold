const BOARD_ROWS = 7;
const BOARD_COLUMNS = 7;

function createBoard(board) {
    const columnsHalf = Math.floor(BOARD_COLUMNS / 2)

    for (let row = 0; row < BOARD_ROWS; row++) {
        const rowElement = document.createElement("div");
        rowElement.className = "row";
        rowElement.dataset.row = row;
        for (let column = 0; column < BOARD_COLUMNS; column++) {
            let cellClassName = "cell empty";
            cellClassName += column < columnsHalf ? " left" : " right"
            const cellElement = document.createElement("div");
            cellElement.className = cellClassName;
            cellElement.dataset.row = row;
            rowElement.append(cellElement);
        }
        board.append(rowElement);
    }
}

function playMove(board, playerColor, move) {
    const row = parseInt(move[0], 10)
    const side = move[1]

    const rowElement = board.querySelectorAll(".row")[row];
    if (rowElement === undefined) {
        throw new RangeError(`row must be between 0 and ${BOARD_ROWS}.`);
    }

    const cells = rowElement.querySelectorAll(".cell.empty");
    const indexToSearch = side === "R" ? cells.length - 1 : 0
    const cellElement = cells[indexToSearch]
    if (cellElement === undefined) {
        throw new RangeError(`column must be between 0 and ${COLUMN_ROWS}.`);
    }
    // Place checker in cell.
    if (!cellElement.classList.replace("empty", playerColor)) {
        throw new Error("cell must be empty.");
    }
}

function sendMoves(board, websocket) {
    // When clicking a column, send a "play" event for a move in that column.
    board.addEventListener("click", ({ target }) => {
        const row = target.dataset.row;
        const side = target.className.includes("right") ? "R" : "L"

        // Ignore clicks outside a row.
        if (row === undefined) {
            return;
        }
        const event = {
            type: "play",
            username: window.location.pathname.split("/")[3],
            movement: row + side,
        };
        websocket.send(JSON.stringify(event));
    });
  }

function showMessage(message) {
    window.setTimeout(() => window.alert(message), 50);
}

function receiveMoves(board, websocket) {
    websocket.addEventListener("message", ({ data }) => {
        const event = JSON.parse(data);
        switch (event.type) {
            case "play":
                // Update the UI with the move.
                playMove(board, event.player_color, event.movement);
                break;
            case "win":
                showMessage(`Player ${event.player} wins!`);
                // No further messages are expected; close the WebSocket connection.
                websocket.close(1000);
                break;
            case "error":
                showMessage(event.message);
                break;
            default:
                throw new Error(`Unsupported event type: ${event.type}.`);
            }
    });
}

function joinGame(websocket) {
    websocket.addEventListener("open", () => {
        // Send a "join" event according to who is connecting.
        const pathArray = window.location.pathname.split("/");
        const gameKey = pathArray[2]
        const username = pathArray[3]
        const event = {type: "join", game_key: gameKey, username: username};
        websocket.send(JSON.stringify(event));
    });
}

export { createBoard, sendMoves, receiveMoves, joinGame };