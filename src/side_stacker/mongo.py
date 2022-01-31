import os

from pymongo import MongoClient

port = int(os.environ.get("MONGODB_PORT", 27017))
user = os.environ.get("MONGODB_USER")
pwd = os.environ.get("MONGODB_PASS")

db = os.environ.get("MONGODB_DB")
client = MongoClient(f"mongo:{port}", username=user, password=pwd)
project_db = client[db]
