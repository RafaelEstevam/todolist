
// TO DO APP
// Descrição: Frontend de aplicação para criação/gestão de uma lista de tarefas com armazenamento em arquivo .CSV
// Objetivo: Fornecer uma interface simples para gestão de tarefas importadas no CSV.
// Bibliotecas usadas:
//       JQUERY - Bilioteca para manipulação de DOM HTML
//       Bootstrap - Bilioteca para estrutura HTML responsiva
// Criador: Rafael Estevam de Oliveira


import api from './utils/api.js'
import csvUtils from './utils/csvUtils.js'
import taskUtils from './utils/taskUtils.js'

$(document).ready(function(){

    /**
     * Variáveis
     */

    var historyWrapper = $("#historyWrapper"); //TAG HTML
    var formTask = $("#formTask"); //TAG HTML
    var formImportTask = $("#formImportTask"); //TAG HTTML
    var formSearchTask = $("#formSearchTask"); //TAG HTTML
    var importTasksInput = $("#importTasksInput"); //TAG HTTML
    var searchIdInput = $("#searchIdInput"); //TAG HTTML
    var idInput = $("#idInput"); //TAG HTTML
    var nameInput = $("#nameInput"); //TAG HTTML
    var scoreInput = $("#scoreInput"); //TAG HTTML
    var statusSelect = $("#statusSelect"); //TAG HTTML
    var parentTaskSelect = $("#parentTaskSelect"); //TAG HTTML
    var indexParentInput = $("#indexParentInput"); //TAG HTTML
    var deleteTask = $("#deleteTask"); //TAG HTTML
    var addTaskButton = $("#addTaskButton"); //TAG HTTML
    var totalPoints = $("#totalPoints"); //TAG HTTML
    var scoreTask = $("#scoreTask"); //TAG HTTML
    var parentTaskList = [];
    var tasks = {};
    var setStatusDone = false;
    
    $(formTask).on("submit", function(e){
        /** Submissão dos dados do formulário em JSON
         * e(object) - Elemento atual que recebe o evento
         */
        e.preventDefault();
        var taskId = $(idInput).val() == "" ? "" : parseInt($(idInput).val())
        var taskItem = { // formatação dos dados para a estrutura esperada pelo BACKEND
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
            store(tasks); // Quando for uma nova tarefa sem ID
        }else{
            update(tasks, taskId);  // Quando for uma tarefa com ID
        }
    })

    $(formSearchTask).on("submit", function(e){
        e.preventDefault();
        taskUtils.restoreDataModal(totalPoints, scoreTask, idInput, nameInput, scoreInput, statusSelect, parentTaskSelect, indexParentInput);
        showEditModal($(searchIdInput).val());
    })

    $(importTasksInput).on("change", function(){
        /**
         * Inicializa a importação do CSV
         */
        csvUtils.csvImport(importTasksInput);
    })

    $(formImportTask).on("submit", function(e){
        /** Submissão do CSV para processamento e importação
         * e(object) - Elemento atual que recebe o evento
         */
        e.preventDefault();
        var csvList = csvUtils.csvSave();
        importTasks(csvList);
        destroyDashboard();
        init();
    })

    $(deleteTask).on("click", function(){
        /** 
         * Apaga a tarefa de acordo com o ID
         */
        destroy($(idInput).val())
    })

    $(addTaskButton).on("click", function(){
        /** 
         * Adiciona nova tarefa
         */

        $("#addTask").modal("show");
        taskUtils.restoreDataModal(totalPoints, scoreTask, idInput, nameInput, scoreInput, statusSelect, parentTaskSelect, indexParentInput);
    })

    function generateSelectParentOption(taskList){

        /** 
         * Lê todas as listas de tarefas e subtarefas e adiciona a um novo array para ordená-la pelo id
         */

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

    function destroyDashboard(){

        /**
         * Remove os dados atuais da interface
         */

        parentTaskList = [];
        $(historyWrapper).children().remove()
        $(parentTaskSelect).children().remove()
        $(parentTaskSelect).append('<option data-index="0" value="0">Tarefa principal</option>');
        $(indexParentInput).val(1);
    }

    function showEditModal(id){
        index(id);
    }

    function setEditFunction(){
        /**
         * Remove os dados atuais da interface
         */

        $(".edit").each(function(){
            $(this).on("click", function(){
                showEditModal($(this).data("id"))
            })
        })
    }

    // function setStatusFlag(status){
    //     switch(status){
    //         case 'to-do':
    //             setStatusDone = false;
    //             break;
    //         case 'done':
    //             setStatusDone = true;
    //             break;
    //         case 'in-progress':
    //             setStatusDone = false;
    //             break;
    //         case 'blocked':
    //             setStatusDone = false;
    //             break;
    //     }
    // }

    // function setTaskSelectStatusOption(allowDone){
    //     $(statusSelect).children().remove()
    //     $(statusSelect).append('<option value="">Selecione um status</option>');
    //     $(statusSelect).append('<option value="to-do">Para fazer</option>')
    //     $(statusSelect).append('<option value="in-progress">Em progresso</option>')
    //     $(statusSelect).append('<option value="blocked">Bloqueada</option>')
    //     if(allowDone){
    //         $(statusSelect).append('<option value="done">Concluida</option>');
    //     }
    // }

    // function setStatusOptions(task){
    //     var taskList = task.subtask;
    //     if(task.subtask.length > 0){
    //         taskList.forEach(function(item){
    //             if(item.subtask.length > 0 ){
    //                 setStatusOptions(item);
    //                 setStatusFlag(item.status);
    //             }
    //             else{
    //                 setStatusFlag(item.status);
    //             }
    //         })
    //     }else{
    //         setStatusFlag('done');
    //     }
        
    //     setTaskSelectStatusOption(setStatusDone);
    // }
    
    function init(){

        /**
         *  Inicializa a inteface e faz a busca da tarefa no BACKEND
         */

        show();
    }

    function store(data){
        /**
         * Cria uma nova tarefa
         * data - Dados da tarefa
         */
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
        /**
         * Busca todas as tarefas no backend
         */

        $.ajax({
            type: "GET",
            url: api + "tasks",
            async: false,
            contentType: "application/json; charset=utf-8",
        }).then(function (res){
            taskUtils.generateList(JSON.parse(res));
            generateSelectParentOption(JSON.parse(res).tasks);
        }).then(function(){
            taskUtils.generateOptions(parentTaskList);
            setEditFunction();
        })
    }
    
    function update (task, task_id){
        
        /**
         * Edita uma tarefa
         * task - Dados da tarefa
         * id - Id da tarefa
         */
        
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

        /**
         * Apaga uma tarefa de acordo com o ID
         * id - Id da tarefa
         */

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

        /**
         * Consulta uma tarefa de acordo com o ID
         * task_id - Id da tarefa
         */

        $.ajax({
            type: "GET",
            url: api + "tasks/" + task_id,
            contentType: "application/json; charset=utf-8",
        }).then((res) =>{
            // setStatusOptions(res.task[0]);
            if(res.task[0]){
                $("#addTask").modal("show");
                taskUtils.setDataModal(res.task[0], totalPoints, scoreTask, idInput, nameInput, scoreInput, statusSelect, parentTaskSelect, indexParentInput);
            }else{
                $("#notFoundTaks").modal("show");
            }
        })
    }

    function importTasks(tasks){

        /**
         * Recebe uma lista de tarefas para salvar no BACKEND. Essa lista é passada dentro de um objeto e transformada em JSON.
         * tasks(array) - lista de tarefas 
         */

        var taskList = {
            tasks: tasks
        }

        taskList = JSON.stringify(taskList);
        $.ajax({
            type: "POST",
            url: api + "/csv/import",
            contentType: "application/json; charset=utf-8",
            data: taskList
        }).then(function (res){
            console.log(res);
        })
    }

    init();
})