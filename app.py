from flask import Flask, jsonify, render_template
from pymongo import MongoClient

app = Flask(__name__)

# MongoDB connection string
connection_string = "mongodb+srv://salman4062:allVFk9X1VNy1YLG@cluster1.jmuet.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
client = MongoClient(connection_string)
db = client["transitTrackingDB"]
collection = db["barrieTransit"]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/transit')
def transit():
    data = list(collection.find({}, {'_id': 0}))
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
