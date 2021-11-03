import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        const boardForm = document.getElementById("form-board");
        boardForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const form = event.target;
            form.parentElement.parentElement.querySelector(".btn-close").click();
            const input = form.querySelector("#board-name");
            let newBoardName= input.value;
            input.value = '';
            dom.addBoard(newBoardName);
        });
    },
    addBoard: function (boardName) {
        const data = {
            title: boardName
        };
        dataHandler.createNewBoard(data);
    },
    loadBoards: function () {

        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        const boardList = document.querySelector(".container");
        boardList.innerHTML = "";
        const statuses = ["new", "in_progress", "testing", "done"];

        for (let board of boards) {
            boardList.insertAdjacentHTML(
                "beforeend",
                `<div class="board" id=board_${board.id}>${board.title}</div>`
            );
            const button = document.createElement("button");
            button.innerText = "add card";
            button.dataset.id = `board_${board.id}`;
            button.dataset.bsToggle = "modal";
            button.dataset.bsTarget = "#exampleModal";

            button.addEventListener("click", (e) => {
                e.preventDefault();
                this.showModal(board.id);
            });
            document.getElementById(`board_${board.id}`).appendChild(button);

            const dropDownButton = document.createElement("button");
            dropDownButton.innerText = "v";
            dropDownButton.className = "dropDownButton";
            dropDownButton.dataset.cards = `board_${board.id}`;
            dropDownButton.addEventListener("click", (e) => {
                e.preventDefault();
                document
                    .getElementById(`board_${board.id}_status_container`)
                    .classList.toggle("hidden");
            });
            document
                .getElementById(`board_${board.id}`)
                .appendChild(dropDownButton);
            let boardElem = document.getElementById(`board_${board.id}`);
            let statusContainer = document.createElement("div");
            statusContainer.className = "statusesContainer";
            statusContainer.id = `board_${board.id}_status_container`;
            boardElem.appendChild(statusContainer);

            for (let status of statuses) {
                statusContainer.insertAdjacentHTML(
                    "beforeend",
                    `<div class="statusColumn" id=status_${status} data-board-id=board_${board.id}>${status}</div>`
                );
            }
        }

        dom.loadCards(boards);
    },
    loadCards: function (boards) {
        for (let board of boards) {
            dataHandler.getCardsByBoardId(board.id, (cards) => {
                dom.showCards(cards, board.id);
            });
        }
    },
    showCards: function (cards, boardId) {
        const statuses = ["new", "in_progress", "testing", "done"];
        console.log(cards);
        const board = document.getElementById(`board_${boardId}`);
        console.log(board)
        for (let c in cards) {
            for (let status of statuses) {
                if (cards[c].status_id === status) {
                    const card = document.createElement("div");
                    card.classList.add("card");
                    card.id = `card_${cards[c].id}`;

                    const span = document.createElement("span");
                    span.innerText = cards[c].title;

                    const btn = document.createElement("button");
                    btn.dataset.id = cards[c].id;
                    btn.innerHTML = "&times;";

                    btn.addEventListener("click", (e) => {
                        e.preventDefault();
                        dataHandler.deleteCard(e.target.dataset.id);
                        console.log(e.target.dataset.id);
                        card.parentElement.removeChild(card);
                    });
                    var elem = board.querySelector(
                        `[data-board-id=board_${CSS.escape(boardId)}][id=status_${CSS.escape(status)}]`
                    );
                    elem.appendChild(card);
                    card.appendChild(span);
                    card.appendChild(btn);
                }
            }
        }
    },
    submitModal: function (e) {
        // e.preventDefault();
        const data = {
            title: e.target.elements.boardtitle.value,
            boardid: e.target.dataset.boardid,
        };
        dataHandler.addCard(parseInt(e.target.dataset.boardid, 10), data);

        const modal = document.querySelector(".modal-card form");
        modal.removeEventListener("submit", this.submitModal);
        modal.querySelector("textarea").value = "";

        document.querySelector(".modal .btn-close").click();
        dom.loadBoards();
    },
    showModal: function (id) {
        const modal = document.querySelector(".modal-card form");
        modal.dataset.boardid = id;
        modal.querySelector("textarea").value = "";
        modal.addEventListener("submit", this.submitModal);
    },
};
