import api from '../services/api.js'
import csvUtils from './utils/csvUtils.js'

$(document).ready(function(){
    var historyWrapper = $("#historyWrapper");
    var btnImport = $("#import");
    var formTask = $("#formTask");
    var formImportTask = $("#formImportTask");
    var importTasksInput = $("#importTasksInput");
    var idInput = $("#idInput");
    var nameInput = $("#nameInput");
    var scoreInput = $("#scoreInput");
    var statusSelect = $("#statusSelect");
    var parentTaskSelect = $("#parentTaskSelect");
    var indexParentInput = $("#indexParentInput");
    var deleteTask = $("#deleteTask");
    var addTaskButton = $("#addTaskButton");
    var totalPoints = $("#totalPoints");
    var scoreTask = $("#scoreTask");
    var parentTaskList = [];
    var mainTasks = [];
    var tasks = {};
    
    $(formTask).on("submit", function(e){
        e.preventDefault();
        var taskId = $(idInput).val() == "" ? "" : parseInt($(idInput).val())
        var taskItem = {
            "id": taskId,
            "index": parseInt($("input[name='index']").val()),
            "name": $("input[name='name']").val(),
            "score": parseInt($("input[name='score']").val()),
            "parentTaskId" : parseInt($("select[name='parentTaskId']").val()),
            "totalScore" : 0,
            "status" : $("select[name='status']").val(),
            "subtask": []
        }

        tasks = {"tasks":[taskItem]};
        if(taskId == ""){
            store(tasks);
        }else{
            update(tasks, taskId);
        }
    })

    $(importTasksInput).on("change", function(){
        csvUtils.csvImport(importTasksInput);
    })

    $(formImportTask).on("submit", function(e){
        e.preventDefault();
        var csvList = csvUtils.csvSave();
        importTasks(csvList);
        destroyDashboard();
        init();
    })

    $(deleteTask).on("click", function(){
        destroy($(idInput).val())
    })

    $(addTaskButton).on("click", function(){
        $("#addTask").modal("show");
        restoreDataModal();
    })

    function generateOptions(){
        parentTaskList.forEach(function(item){
            $(parentTaskSelect).append('<option data-index="'+item.index+'" value="' + item.id + '">'+item.name+'</option>')
        })
        $(parentTaskSelect).on("change", function(){
            $(indexParentInput).removeAttr('min')
            $(indexParentInput).val($(this).children("option:selected").data('index') + 1)
        })
    }

    function setEditFunction(){
        $(".edit").each(function(){
            $(this).on("click", function(){
                $("#addTask").modal("show");
                index($(this).data("id"));
            })
        })
    }

    function restoreDataModal(){
        $(totalPoints).text("");
        $(scoreTask).text("");
        $(idInput).val("");
        $(nameInput).val("");
        $(scoreInput).val("");
        $(statusSelect).val("");
        $(parentTaskSelect).val("0");
        $(indexParentInput).val("1");
    }

    function setDataModal(task){
        $(totalPoints).text(task.totalScore);
        $(scoreTask).text(task.score);
        $(idInput).val(task.id);
        $(nameInput).val(task.name);
        $(scoreInput).val(task.score);
        $(statusSelect).val(task.status);
        $(parentTaskSelect).val(task.parentTaskId);
        $(indexParentInput).val(task.index);
    }

    function generateSelectParentOption(taskList){
        taskList.forEach(function(item){
            if(item.subtask.length > 0){
                parentTaskList.push(item);
                generateSelectParentOption(item.subtask)
            }else{
                parentTaskList.push(item);
            }
        })
        parentTaskList.sort(function(a,b){
            return a.id - b.id;
        })
    }

    function appendItem(parent, item){
        var addDropdownButton = '<button class="ml-3 main-circle main-btn bg-transparent text-white main-dropdown" ><i class="fa fa-chevron-down"></i></button>'
        addDropdownButton = item.subtask.length > 0 ? addDropdownButton : '<button style="cursor: default;" class="ml-3 main-circle main-btn bg-transparent text-white main-dropdown" ><i class="fa fa-chevron-down main-text-gray"></i></button>'
        $(parent).append(
            '<ul data-index="' + item.index +'" id="'+item.id+'" class="main-tasks main-rounded">' +
                '<li class="main-task-item main-rounded main-bg-gray "' +
                    '" data-id="'+item.id +
                    '" data-score="'+item.score +
                    '" data-total-score="'+ item.totalScore +'">' + 
                        '<span class="main-task-status main-rounded '+ item.status +'">' + item.name + '</span>' +
                        '<div class="d-flex justify-content-center align-items-center">'+
                            '<button title="Ver tarefa" data-id="'+item.id+'" class="ml-3 main-circle main-btn main-bg-deep text-white edit" ><i class="fa fa-pencil"></i></button>' +
                            addDropdownButton + 
                        '</div>' +
                '</li>' +
            '</ul>')
    }

    function addEventMainTask(mainTasks){
        $(mainTasks).each(function(){
            var itemTask = $($(this).children()[0]);
            $($(this).children()[0]).find(".main-dropdown").on("click", function(){
                $(itemTask).parent().toggleClass("active");
            })
        })
    }

    function generateSubtaskList(task, taskList){
        var thisTask = $("#" + task.id)
        taskList.forEach(function(item){
            if(item.parentTaskId == task.id){
                if(item.subtask.length > 0){
                    appendItem($(thisTask), item)
                    generateSubtaskList(item, item.subtask);
                }else{
                    appendItem($(thisTask), item)
                }
            }
        })
    }

    function generateList(taskList){
        taskList.tasks.forEach(function(task){
            if(task.index == 1){
                appendItem($(historyWrapper), task)
            }
            if(task.subtask.length > 0){
                generateSubtaskList(task, task.subtask);
            }
        })
        mainTasks = $('ul.main-tasks');
        addEventMainTask($(mainTasks));
    }

    function destroyDashboard(){
        parentTaskList = [];
        $(historyWrapper).children().remove()
        $(parentTaskSelect).children().remove()
        $(parentTaskSelect).append('<option data-index="0" value="0">Tarefa principal</option>');
        $(indexParentInput).val(1);
    }
    
    function init(){show();}

    function store(data){
        $.ajax({
            type: "POST",
            url: api + "tasks/new",
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
        }).then((res) =>{
            destroyDashboard();
            init();
        })
    }
    
    function show(){
        $.ajax({
            type: "GET",
            url: api + "tasks",
            async: false,
            contentType: "application/json; charset=utf-8",
        }).then(function (res){
            generateList(JSON.parse(res));
            generateSelectParentOption(JSON.parse(res).tasks);
        }).then(function(){
            generateOptions();
            setEditFunction();
        })
    }
    
    function update (task, task_id){
        $.ajax({
            type: "PUT",
            url: api + "tasks/" + task_id,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(task),
            dataType: 'json',
        }).then((res) =>{
            destroyDashboard();
            init();
        })
    }
    
    function destroy(task_id){
        $.ajax({
            type: "DELETE",
            url: api + "tasks/" + task_id,
            contentType: "application/json; charset=utf-8",
        }).then((res) =>{
            destroyDashboard();
            init();
        })
    }
    
    function index(task_id){
        $.ajax({
            type: "GET",
            url: api + "tasks/" + task_id,
            contentType: "application/json; charset=utf-8",
        }).then((res) =>{
            setDataModal(res.task[0]);
        })
    }

    function importTasks(tasks){
        var taskList = {
            tasks: tasks
        }
        taskList = JSON.stringify(taskList);
        $.ajax({
            type: "POST",
            url: api + "/csv/import",
            contentType: "application/json; charset=utf-8", // permite requisições que enviam dados do tipo json
            data: taskList
        }).then(function (res){
            console.log(res);
        })
    }

    init();
})