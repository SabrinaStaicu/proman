import csv
from util import getPath

STATUSES_FILE = getPath("/data/statuses.csv")
STATUSES_FIELDS = ["id", "title"]

BOARDS_FILE = getPath("/data/boards.csv")
BOARDS_FIELDS = ["id", "title"]

CARDS_FILE = getPath("/data/cards.csv")
CARDS_FIELDS = ["id", "board_id", "title", "status_id", "order"]

_cache = {}  # We store cached data in this dict to avoid multiple file readings


def _read_csv(file_name):
    """
    Reads content of a .csv file
    :param file_name: relative path to data file
    :return: OrderedDict
    """
    with open(file_name) as boards:
        rows = csv.DictReader(boards, delimiter=",", quotechar='"')
        formatted_data = []
        for row in rows:
            formatted_data.append(dict(row))
        return formatted_data


def _write_csv(file_name, field_names, new_data):
    with open(file_name, "a", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=field_names)

        writer.writerow(new_data)


def _delete_from_csv(id, file_name, field_names):
    data = _read_csv(file_name)
    output = [e for e in data if int(e["id"]) != id]

    with open(file_name, "w") as file:
        csv_writer = csv.DictWriter(file, fieldnames=field_names)
        csv_writer.writeheader()
        for row in output:
            csv_writer.writerow(row)


def generate_id_by_file(file_name):
    return max([int(r["id"]) for r in _read_csv(file_name=file_name)]) + 1


def _get_data(data_type, file, force):
    """
    Reads defined type of data from file or cache
    :param data_type: key where the data is stored in cache
    :param file: relative path to data file
    :param force: if set to True, cache will be ignored
    :return: OrderedDict
    """
    if force or data_type not in _cache:
        _cache[data_type] = _read_csv(file)
    return _cache[data_type]


def clear_cache():
    for k in list(_cache.keys()):
        _cache.pop(k)


def get_statuses(force=False):
    return _get_data("statuses", STATUSES_FILE, force)


def get_boards(force=False):
    return _get_data("boards", BOARDS_FILE, force)


def get_cards(force=False):
    return _get_data("cards", CARDS_FILE, force)
