import persistence


def add_new_board(board_title):
    f = persistence.BOARDS_FILE
    new_data = {"id": persistence.generate_id_by_file(f), "title": board_title}

    persistence._write_csv(
        file_name=persistence.BOARDS_FILE,
        field_names=persistence.BOARDS_FIELDS,
        new_data=new_data,
    )


def edit_board_title(id, board_title):
    data = get_boards()
    new_data = []

    for row in data:
        if str(row.get("id")) == str(id):
            new_data.append({"id": id, "title": board_title})
        else:
            new_data.append(row)

    persistence._write_csv(
        file_name=persistence.BOARDS_FILE,
        field_names=persistence.BOARDS_FIELDS,
        new_data=new_data,
    )

    return data


def add_new_card(d):
    c = persistence.CARDS_FILE
    new_data = {
        "id": persistence.generate_id_by_file(c),
        "board_id": d.get("board_id"),
        "title": d.get("card_title"),
        "status_id": 0,
        "order": 0,
    }
    persistence._write_csv(
        file_name=c,
        field_names=persistence.CARDS_FIELDS,
        new_data=new_data,
    )


def delete_card(id):
    persistence._delete_from_csv(id, persistence.CARDS_FILE, persistence.CARDS_FIELDS)

    return {"msg": f"Deleted card {id}"}


def get_boards():
    """
    Gather all boards
    :return:
    """
    return persistence.get_boards(force=True)


def get_cards_for_board(board_id):
    persistence.clear_cache()
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if card["board_id"] == str(board_id):
            card["status_id"] = get_card_status(
                card["status_id"]
            )  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next(
        (status["title"] for status in statuses if status["id"] == str(status_id)),
        "Unknown",
    )
