import pandas as pd
from pymongo import MongoClient

# MongoDB connection string
connection_string = "mongodb+srv://salman4062:allVFk9X1VNy1YLG@cluster1.jmuet.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
client = MongoClient(connection_string)
db = client["transitTrackingDB"]
collection = db["barrieTransit"]

csv_path = r"C:\Users\Dell_User\Transit_Tracker_Barrie\cleaned_transit_data.csv"
df = pd.read_csv(csv_path)

data = df.to_dict(orient="records")

collection.insert_many(data)

print("Data successfully inserted into MongoDB!")
