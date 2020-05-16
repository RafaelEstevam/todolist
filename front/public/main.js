import csvUtils from './utils/csvUtils.js'
// import taskUtils from './utils/taskUtils.js'
import csvController from './controllers/csv.js'

$(document).ready(function(){

    var csv_import = $("#csv_import");
    var tasks_save = $("#tasks_save");
    
    $(csv_import).on("click", function(){
        csvUtils.csvImport();
    })

    $(tasks_save).on("click", function(){
        var csvList = csvUtils.csvSave();

        // taskUtils.addTasks(csvList);
        // taskUtils.calcScoreTasks(taskUtils.getMergedTasks());
        // taskUtils.calcSprintTasks(20);
        // csvUtils.csvSubmit(csvUtils.csvRemoveSubtasks(taskUtils.getMergedTasks()));
        // csvUtils.csvSubmit(csvUtils.csvRemoveSubtasks(csvList));

        csvController.store(csvList);
        // csvUtils.csvSubmit(csvList);

    })

    // var tasks = [ // mock csv data
    //     {id: 1, name: "task 1", score: 2, totalScore: 0, subtask: [], parentTaskId: 0},
    //     {id: 2, name: "task 2", score: 2, totalScore: 0, subtask: [], parentTaskId: 1},
    //     {id: 3, name: "task 3", score: 2, totalScore: 0, subtask: [], parentTaskId: 2},
    //     {id: 4, name: "task 4", score: 2, totalScore: 0, subtask: [], parentTaskId: 3},
    //     {id: 5, name: "task 5", score: 2, totalScore: 0, subtask: [], parentTaskId: 4},
    //     {id: 6, name: "task 6", score: 2, totalScore: 0, subtask: [], parentTaskId: 0},
    //     {id: 7, name: "task 7", score: 2, totalScore: 0, subtask: [], parentTaskId: 6},
    //     {id: 8, name: "task 8", score: 2, totalScore: 0, subtask: [], parentTaskId: 6},
    //     {id: 9, name: "task 9", score: 2, totalScore: 0, subtask: [], parentTaskId: 8},
    //     {id: 10, name: "task 10", score: 2, totalScore: 0, subtask: [], parentTaskId: 6},
    //     {id: 11, name: "task 11", score: 2, totalScore: 0, subtask: [], parentTaskId: 10},
    //     {id: 12, name: "task 12", score: 2, totalScore: 0, subtask: [], parentTaskId: 11},
    //     {id: 13, name: "task 13", score: 2, totalScore: 0, subtask: [], parentTaskId: 12},
    //     {id: 14, name: "task 14", score: 2, totalScore: 0, subtask: [], parentTaskId: 13},
    //     {id: 15, name: "task 15", score: 2, totalScore: 0, subtask: [], parentTaskId: 14},
    //     {id: 16, name: "task 16", score: 2, totalScore: 0, subtask: [], parentTaskId: 14},
    //     {id: 17, name: "task 17", score: 2, totalScore: 0, subtask: [], parentTaskId: 14},
    //     {id: 18, name: "task 18", score: 2, totalScore: 0, subtask: [], parentTaskId: 14},
    //     {id: 19, name: "task 19", score: 2, totalScore: 0, subtask: [], parentTaskId: 0},
    //     {id: 20, name: "task 20", score: 2, totalScore: 0, subtask: [], parentTaskId: 18},
    //     {id: 21, name: "task 21", score: 8, totalScore: 0, subtask: [], parentTaskId: 0},
    // ].sort(function(a, b) {
    //     return a.parentTaskId - b.parentTaskId;
    // })

    // var mergedTasks = [];

    // function searchParentTask(task, taskList){
    //     //Enquando não encontrar a task pai ele continua procurando dentro da árvore de tasks, passando como ponto inicial o array de subtasks do pai.
    //     taskList.forEach((item) =>{
    //         if(item.id == task.parentTaskId){
    //             item.subtask.push(task);
    //         }else{
    //             searchParentTask(task, item.subtask)
    //         }

    //     })
    // }

    // tasks.forEach((task) => { // varre a lista de tarefas e adiciona as tasks que possuem o parentTaskId 0
    //     if(task.parentTaskId == 0){
    //         mergedTasks.push(task);
    //     }else{
    //         searchParentTask(task, mergedTasks);
    //     }
    // });

    // function incrementTotalPoints(task, taskList){
    //     // somatória de pontos da tarefa
    //     if(taskList.length > 0){//a recursão entra em cada ítem da lista, se a lista tiver item e faz a somatória dos pontos de todos os seus subitens
    //         taskList.forEach((item) => {
    //             if(item.totalScore == 0 && item.subtask.length > 0){
    //                 item.totalScore = item.score;
    //             }
    //             incrementTotalPoints(item, item.subtask);
                
    //             if(item.totalScore > 0){
    //                 task.totalScore += item.totalScore;
    //             }else{
    //                 task.totalScore += item.score
    //             }
    //         })
    //     }
    // }

    // mergedTasks.forEach((task) =>{
    //     if(task.subtask.length > 0){
    //         task.totalScore += task.score + task.totalScore;
    //         incrementTotalPoints(task, task.subtask);
    //     }else{
    //         task.totalScore = task.score;
    //     }
    // });

    // var tasksSprint = [];
    // var sprintPoints = 20;

    // mergedTasks.forEach((task) => {
    //     if(task.totalScore <= sprintPoints){
    //         tasksSprint.push(task);
    //         sprintPoints -= task.totalScore;
    //     }
    // });

    // var taskList = {
    //     tasks: mergedTasks
    // }

    // taskList = JSON.stringify(taskList);

    // console.log(mergedTasks)

    // $.ajax({
    //     type: "POST",
    //     url: "http://127.0.0.1:5000/csv",
    //     contentType: "application/json; charset=utf-8", // permite requisições que enviam dados do tipo json
    //     data: taskList
    // }).then((res) =>{
    //     console.log(res);
    // })

})