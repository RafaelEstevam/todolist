import csvUtils
import sprintUtils
import tasksController

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
def hello():
    return "Hello"

@app.route("/csv", methods=['POST'])
@cross_origin()
def createCSV():
    return csvUtils.processCSV(request)

@app.route("/tasks", methods=['GET'])
@cross_origin()
def getJsonTasks():
    return tasksController.getTasks()

@app.route("/tasks/<taskId>", methods=['GET'])
@cross_origin()
def getTaskInCSV(taskId):
    return tasksController.getTask(taskId)

@app.route("/sprints", methods=['POST'])
@cross_origin()
def calcSprint():
    return sprintUtils.calculateSprints(request)

if __name__ == "__main__":
    app.run()