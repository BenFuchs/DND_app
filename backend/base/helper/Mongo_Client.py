from pymongo import MongoClient
from dotenv import load_dotenv
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

dotenv_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=dotenv_path)

MONGO_URL = os.getenv("MONGO_URL")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")
MONGO_COLLECTION_NAME = os.getenv("MONGO_COLLECTION_NAME")

client = MongoClient(MONGO_URL)
db = client[MONGO_DB_NAME]
collection = db[MONGO_COLLECTION_NAME]

