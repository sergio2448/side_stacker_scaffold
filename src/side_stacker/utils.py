import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def get_path_to_html(file_name: str):
    return os.path.join(BASE_DIR, file_name)
