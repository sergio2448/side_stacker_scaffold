import os

from pymongo import MongoClient

port = int(os.environ.get("MONGODB_PORT", 27017))
user = os.environ["MONGODB_USER"]  # required
pwd = os.environ["MONGODB_PASS"]  # required

db = os.environ["MONGODB_DB"]  # required
client = MongoClient(f"mongo:{port}", username=user, password=pwd)
database = client[db]
