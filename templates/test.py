from pymongo import MongoClient

# MongoDB connection string
connection_string = "mongodb+srv://salman4062:allVFk9X1VNy1YLG@cluster1.jmuet.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
client = MongoClient(connection_string)
db = client["transitTrackingDB"]
collection = db["barrieTransit"]

documents = list(collection.find().limit(5))

if documents:
    for doc in documents:
        print(doc)
else:
    print("The collection is empty.")
