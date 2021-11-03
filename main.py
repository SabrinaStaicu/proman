from flask import Flask, render_template, url_for, request
from util import json_response

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    boards = [
        dict(
            title=board.get("title"),
            id=board.get("id"),
            entries=get_cards_for_board(board.get("id")),
        )
        for board in data_handler.get_boards()
    ]
    # print(boards)
    return render_template("index.html", boards=boards)


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/add-card", methods=["POST"])
@json_response
def add_card():
    newData = {
        "board_id": request.json.get("boardid"),
        "card_title": request.json.get("title"),
    }
    return data_handler.add_new_card(newData)


@app.route("/add-board", methods=["Post"])
@json_response
def new_board():
    board_title = request.json.get("title")
    data_handler.add_new_board(board_title)
    response = data_handler.get_boards()
    return response


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


@app.route("/delete-card/<int:id>", methods=["POST"])
@json_response
def delete_card(id):
    return data_handler.delete_card(id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule(
            "/favicon.ico",
            redirect_to=url_for("static", filename="favicon/favicon.ico"),
        )


if __name__ == "__main__":
    main()
