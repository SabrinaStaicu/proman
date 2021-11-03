// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
import { dom } from "./dom.js";

export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
    _api_get: function (url, callback) {
        fetch(url, {
            method: "GET",
            credentials: "same-origin",
        })
            .then((response) => response.json()) // parse the response as JSON
            .then((json_response) => callback(json_response)); // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((json_response) => callback(json_response));
    },
    init: function () {},
    getBoards: function (callback) {
        this._api_get("/get-boards", (response) => {
            this._data["boards"] = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: function (boardId, callback) {
        this._api_get("/get-cards/" + boardId, (response) => {
            this._data["cards"] = response;
            console.log(response);
            callback(response);
        });
    },
    getCard: function (cardId, callback) {
        this._api_get("/get-cards/" + cardId, (response) => {
            this._data["cards"] = response;
            console.log(response);
            callback(response);
        });
    },
    createNewBoard: function (data) {
        this._api_post("/add-board", data, (response) => {
            this._data["boards"] = response;
            dom.loadBoards();
        });
    },

    addCard: function (id, data) {
        this._api_post("/add-card", data, (response) => {
            this._data["cards"] = response;
            dom.showModal(id);
        });
    },

    deleteCard: function (id) {
        this._api_post("/delete-card/" + id, {}, (r) => {
            console.log(r.msg);
        });
    },

};


