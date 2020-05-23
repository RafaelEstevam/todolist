import api from '../services/api.js'

$(document).ready(function(){
    var historyWrapper = $("#historyWrapper");

    function generateSubtaskList(task, taskList){
        var thisTask = $("#" + task.id)
        taskList.forEach(function(item){
            if(item.parentTaskId == task.id){
                if(item.subtask.length > 0){
                    $(thisTask).append('<ul id="'+item.id+'"><li data-score="'+item.score+'" data-total-score="'+item.totalScore+'"><a href="#">'+ item.name +'</a></li></ul>')
                    generateSubtaskList(item, item.subtask);
                }else{
                    $(thisTask).append('<ul id="'+item.id+'"><li data-score="'+item.score+'" data-total-score="'+item.totalScore+'"><a href="#">'+ item.name +'</a></li></ul>')
                }
            }
        })
    }

    function generateList(taskList){
        taskList.tasks.forEach(function(task){
            if(task.parentTaskId == 0){
                $(historyWrapper).append('<ul id="'+task.id+'"><li data-score="'+task.score+'" data-total-score="'+task.totalScore+'"><a href="#">'+ task.name +'</a></li></ul>')
            }
            if(task.subtask.length > 0){
                generateSubtaskList(task, task.subtask);
            }
        })
    }

    function destroyList(){
        $(historyWrapper).remove()
    }
    
    show();

    function store(){
        $.ajax({
            type: "POST",
            url: api + "/tasks/new",
            contentType: "application/json; charset=utf-8",
        }).then((res) =>{
            console.log(res);
        })
    }
    
    function show(){
        $.ajax({
            type: "GET",
            url: api + "/tasks",
            async: false,
            contentType: "application/json; charset=utf-8",
        }).then(function (res){
            generateList(JSON.parse(res));
        })
    }
    
    function update (task, task_id){
        $.ajax({
            type: "PUT",
            url: api + "/tasks/" + task_id,
            contentType: "application/json; charset=utf-8",
        }).then((res) =>{
            console.log(res);
        })
    }
    
    function destroy(task_id){
        $.ajax({
            type: "DELETE",
            url: api + "/tasks/" + task_id,
            contentType: "application/json; charset=utf-8",
        }).then((res) =>{
            console.log(res);
        })
    }
    
    function index(task_id){
        $.ajax({
            type: "GET",
            url: api + "/tasks/" + task_id,
            contentType: "application/json; charset=utf-8",
        }).then((res) =>{
            console.log(res.task[0]);
        })
    }
})