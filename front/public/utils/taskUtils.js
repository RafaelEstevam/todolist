import csvUtils from './csvUtils.js'
var mergedTasks = [];

function searchParentTask(task, taskList){
    //Enquando não encontrar a task pai ele continua procurando dentro da árvore de tasks, passando como ponto inicial o array de subtasks do pai.
    taskList.forEach(function(item){
        if(item.id == task.parentTaskId){
            item.subtask.push(task);
        }else{
            searchParentTask(task, item.subtask)
        }
    })
}

function incrementTotalPoints(task, taskList){
    // somatória de pontos da tarefa
    if(taskList.length > 0){//a recursão entra em cada ítem da lista, se a lista tiver item e faz a somatória dos pontos de todos os seus subitens
        taskList.forEach(function (item){
            if(item.totalScore == 0 && item.subtask.length > 0){
                item.totalScore = item.score;
            }
            incrementTotalPoints(item, item.subtask);
            if(item.totalScore > 0){
                task.totalScore += item.totalScore;
            }else{
                task.totalScore += item.score
            }
        })
    }
}

export default {
    calcScoreTasks: function (mergedTasks){
        mergedTasks.forEach(function(task){
            if(task.subtask.length > 0){
                task.totalScore += task.score + task.totalScore;
                incrementTotalPoints(task, task.subtask);
            }else{
                task.totalScore = task.score;
            }
        });
        return mergedTasks;
    },
    
    getMergedTasks: function(){
        return mergedTasks;
    },

    calcSprintTasks: function(score){
        var tasksSprint = [];
        mergedTasks.forEach(function (task) {
            if(task.totalScore <= score){
                tasksSprint.push(task);
                score -= task.totalScore;
            }
        });

        return tasksSprint;
    },
    
    addTasks: function (tasks){
        mergedTasks = [];
        
        tasks.forEach(function(task){ // varre a lista de tarefas e adiciona as tasks que possuem o parentTaskId 0
            if(task.parentTaskId == 0){
                mergedTasks.push(task);
            }else{
                searchParentTask(task, mergedTasks);
            }
        });

    }
}

