import csv
import json

mergedTasks = []

def searchParentTask(task, taskList):
    #Enquando não encontrar a task pai ele continua procurando dentro da árvore de tasks, passando como ponto inicial o array de subtask do pai.
    for item in taskList:
        if item['id'] == task['parentTaskId'] :
            item['subtask'].append(task)
        else:
            searchParentTask(task, item['subtask'])

def addTasks(tasks):
    # Organizar em forma de "árvore" as tasks vindas pelo json. Essa organização usa o id da task pai como referência para adicionar as tasks filhas
    # Essa função retorna a lista de tarefas organizada
    mergedTasks = []
    for task in tasks['tasks']:
        if task['parentTaskId'] == 0:
            mergedTasks.append(task)
        else:
            searchParentTask(task, mergedTasks)

    return mergedTasks

def incrementTotalPoints(task, taskList) :
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

    json_data = request.get_json()

    f = csv.writer(open("csvs/newfile.csv", "w", newline=''))
    f.writerow(["id", "name", "parentTaskId", "score", "totalScore", "subtask"])

    for task in json_data['tasks']:
        f.writerow([
            task["id"], 
            task["name"],
            task["parentTaskId"],
            task["score"],
            task["totalScore"],
            ""
        ])

    taskList = {
        "tasks" : calcScoreTasks(addTasks(json_data))
    }

    return taskList