import csv
import json

mergedTasks = []

def generateTask(task, converter):
    # - task(Objeto) = Objeto com chaves e valores referentes a uma task
    # - converter(Booleano) = Se verdadeiro, converter alguns dados do objeto e devolver objeto, senão devolve somente o objeto
    if converter == True :
        return {
                "id" : int(task[0]),
                "index": int(task[1]),
                "name" : task[2],
                "parentTaskId" : int(task[3]),
                "score" : int(task[4]),
                "totalScore" : int(task[5]),
                "status" : task[6],
                "subtask" : []
            }
    else:
        return {
                "id" : task["id"],
                "index" : task["index"],
                "name" : task["name"],
                "parentTaskId" : task["parentTaskId"],
                "score" : task["score"],
                "totalScore" : task["totalScore"],
                "status" : task["status"],
                "subtask" : []
            }

def writeTaskOfArray(taskList):
    # - taskList(Vetor) = Lista de tarefas para ser armazenada no CSV

    file = csv.writer(open("csvs/newfile.csv", "w", newline=''))
    file.writerow(["id", "index", "name", "parentTaskId", "score", "totalScore", "status", "subtask"])
    for task in taskList:
        file.writerow([
            task["id"],
            task["index"], 
            task["name"],
            task["parentTaskId"],
            task["score"],
            task["totalScore"],
            task["status"],
            ""
        ])
        

def searchParentTask(task, taskList):
    # Enquando não encontrar a task pai ele continua procurando dentro da árvore de tasks, passando como ponto inicial o array de subtask do pai.
    # - task(Objeto) = task 'pai'
    # - taskList(Vetor) = lista de subtasks da task pai

    for item in taskList:
        if item['id'] == task['parentTaskId'] :
            item['subtask'].append(task)
        else:
            searchParentTask(task, item['subtask'])

def addTasks(tasks):
    # Organizar em forma de "árvore" as tasks vindas pelo json. Essa organização usa o id da task pai como referência para adicionar as tasks filhas
    # Essa função retorna a lista de tarefas organizada
    # - tasks(Objeto) = Objeto com lista de tasks à ser processada
    mergedTasks = []
    for task in tasks['tasks']:
        if task['index'] == 1:
            mergedTasks.append(task)
        else:
            searchParentTask(task, mergedTasks)
    return mergedTasks

def incrementTotalPoints(task, taskList) :
    # - task(Objeto) = task 'pai'
    # - taskList(Vetor) = lista de subtasks da task pai

    for item in taskList :
        if len(item['subtask']) > 0:
            item['totalScore'] = item['score']
        incrementTotalPoints(item, item['subtask'])
        # Se meu item tiver um totalscore maior que 0, essa pontuação vai ser somada a pontuação total da task pai, senão o score do item vai ser somado
        # ao total da task pai
        if item['totalScore'] > 0:
            task['totalScore'] += item['totalScore']
        else:
            task['totalScore'] += item['score']

def calcScoreTasks(mergedTasks) :
    # Se a tarefa tiver subtarefas, calcular a somatória de pontos das subtarefas, senão será atribuido a pontuação total da tarefa o score inicial dela
    # Essa função vai retornar a lista com seus devidos valores de pontuação da tarefa atribuidos
    # - mergedTasks(Vetor) = lista de tarefas já organizada na árvore de tarefas

    for item in mergedTasks:
        if len(item['subtask']) > 0 :
            item['totalScore'] += item['score'] + item['totalScore']
            # Calcular a soma da pontuação das subtask
            incrementTotalPoints(item, item['subtask'])
        else:
            item['totalScore'] = item['score']

    return mergedTasks

def processCSV(request):
    # Processamento do json vindo na submição do formulário do front
    # Salvamento em arquivo CSV da lista 'simples' de tarefas
    # Retorno da requisição com as tarefas organizadas e pontuadas
    # - request = biblioteca importada no arquivo main.py

    json_data = request.get_json()
    writeTaskOfArray(json_data['tasks'])
    return processJSON(json_data)

def processJSON(taskList):
    # Processamento do json das tasks. Retorna um JSON com a lista de tasks organizadas
    # - taskList(Objeto) = Objeto com lista de tarefas para ser processada e gerar o JSON - Estrutura esperada : {"tasks" : taskList(array)}
    taskList["tasks"].sort(key=lambda item: item.get('index') )

    taskList = {
        "tasks" : calcScoreTasks(addTasks(taskList))
    }

    j = open("json/tasks.json", "w")
    j.write(str(taskList).replace("'", '"'))
    j.close()
    return taskList

def deleteTaskAndProcessCSV(taskId):
    # - taskId = ID da task que será apagada. 

    newTaskList = []
    r = csv.reader(open("csvs/newfile.csv"))
    for task in r :
        print(task)
        if task[0] != taskId and task[0] != 'id' and task[3] != taskId:
            task = generateTask(task, True)
            newTaskList.append(task)
    
    writeTaskOfArray(newTaskList)
    newTaskList = {"tasks" : newTaskList}
    processJSON(newTaskList)
    return 'test'
        
def createTaskInCSV(request):
    # - request = Biblioteca request importada no main.py

    json_data = request.get_json()
    newTaskList = []
    newId = 0
    r = csv.reader(open("csvs/newfile.csv"))
    for task in r :
        if task[0] != 'id':
            task = generateTask(task, True)
            newTaskList.append(task)
            if task["id"] > newId :
                newId = task["id"]
            else:
                newId = newId

    for newTask in json_data['tasks']:
        newTask["id"] = newId + 1
        newTask = generateTask(newTask, False)
        newTaskList.append(newTask)

    writeTaskOfArray(newTaskList)

    newTaskList = {"tasks" : newTaskList}
    return processJSON(newTaskList)

def editTaskAndProcessCSV(taskId, request):
    # - taskId(int) = ID da task que será apagada
    # - request = Biblioteca request importada no main.py

    json_data = request.get_json()
    newTaskList = []
    r = csv.reader(open("csvs/newfile.csv"))
    for task in r :
        if task[0] == taskId:
            task = generateTask(json_data['tasks'][0], False)
            newTaskList.append(task)
        else:
                if task[0] != 'id':
                    task = generateTask(task, True)
                    newTaskList.append(task)

    writeTaskOfArray(newTaskList)

    newTaskList = {"tasks" : newTaskList}
    return processJSON(newTaskList)