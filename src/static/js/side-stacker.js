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

    // Paint Join Key
    const joinText = document.querySelector(".join-text");
    const joinKey = joinText.children[0];
    joinKey.textContent = window.location.pathname.split("/")[2];
    joinText.style.display = "block";

    // Add events to clipboard button
    const copyButton = document.querySelector(".copy-clipboard");
    copyButton.addEventListener("click", copyToClipboard);
}

function copyToClipboard({ target }) {
    const joinKey = document.querySelector(".join-key").textContent;

    // Taken from: https://stackoverflow.com/a/65996386
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(joinKey);
    } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = joinKey;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            // here the magic happens
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    }
}

function playMove(board, playerColor, player, move) {
    const row = parseInt(move[0], 10);
    const side = move[1];

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

    // Add movement to player list
    document.querySelector(".moves-list").innerHTML += `<span class="move"> → (${player}, "${move}")</span>`;
}

function sendMoves(moveForm, websocket) {
    moveForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const moveInput = document.querySelector("#movement");
        const movement = moveInput.value;

        if (!movement) {
            showMessage("The movement can't be empty");
            return;
        }

        if (movement.length > 2 || isNaN(movement[0]) || movement[0].match(/[a-z]/i)) {
            showMessage("Movement has an unexpected format");
            return;
        }

        const websocketEvent = {
            type: "play",
            username: window.location.pathname.split("/")[3],
            movement: movement,
        };
        websocket.send(JSON.stringify(websocketEvent));
    })
}

function showMessage(message, redirect = false) {
    let messageWithRedirect = redirect ?  message + " Redirecting..." : message
    window.setTimeout(
        () => {
            window.alert(messageWithRedirect);
            if (redirect) {
                window.location.href = `${location.protocol}//${document.domain}:${location.port}/`;
            }
        },
        50
    );
}

function receiveMoves(board, websocket) {
    websocket.addEventListener("message", ({ data }) => {
        const event = JSON.parse(data);
        switch (event.type) {
            case "play":
                // Update the UI with the move.
                playMove(board, event.player_color, event.player, event.movement);
                break;
            case "win":
                showMessage(`Player ${event.player} wins!`, true);
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