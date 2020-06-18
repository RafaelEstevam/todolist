
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
            "oldParentTaskId" : 0,
            "parentTaskId" : parseInt($("select[name='parentTaskId']").val()),
            "totalScore" : 0,
            "status" : $("select[name='status']").val(),
            "subtask": []
        }
        if(taskId == ""){
            tasks = {"tasks":[taskItem]};
            store(tasks); // Quando for uma nova tarefa sem ID
        }else{
            taskUtils.setUpdateDataTask();

            if(taskUtils.dataTask.subtask.length > 0){
                updateAll(taskUtils.dataTask, taskId);
            }else{
                tasks = {"tasks":[taskUtils.dataTask]};
                update(tasks, taskId);
            }

        }
    })

    $(formSearchTask).on("submit", function(e){

        /**
         * Função que busca a tarefa pelo formulário de busca
         */

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
        window.location.reload();
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
        taskUtils.removeAddDefaultSelectOptions(parentTaskSelect);
        taskUtils.generateTaskOptions(parentTaskSelect);
        taskUtils.setTaskSelectStatusOption(statusSelect, "true");
        taskUtils.restoreDataModal(totalPoints, scoreTask, idInput, nameInput, scoreInput, statusSelect, parentTaskSelect, indexParentInput);
    })

    $(parentTaskSelect).on("change", function(){
        taskUtils.setOnChangeParentTaskSelect(indexParentInput, parentTaskSelect)
    })

    function destroyDashboard(){

        /**
         * Remove os dados atuais da interface
         */

        $(historyWrapper).children().remove()
        taskUtils.removeAddDefaultSelectOptions(parentTaskSelect);
        $(indexParentInput).val(1);
    }

    function showEditModal(id){
        taskUtils.removeAddDefaultSelectOptions(parentTaskSelect);
        taskUtils.generateTaskOptions(parentTaskSelect);
        index(id);
    }

    function setEditFunction(){
        /**
         * Remove os dados atuais da interface
         */

        $(".edit").each(function(){
            $(this).off();
            $(this).on("click", function(){
                showEditModal($(this).data("id"))
            })
        })

        $(".dropdown").each(function(){
            $(this).off();
            $(this).on("click", function(){
                $(this).parent().parent().parent().toggleClass("active");
            })
        })
    }

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
            
            taskUtils.refreshParentTasks(res)
            taskUtils.setItem(res)
            setEditFunction();
            
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
            taskUtils.generateList($(historyWrapper), JSON.parse(res));
            taskUtils.generateSelectParentOption(JSON.parse(res).tasks);
        }).then(function(){
            setEditFunction();
        })
    }

    function update (task, taskId){
        /**
         * Edita uma tarefa
         * task - Dados da tarefa
         * id - Id da tarefa
         */

        $.ajax({
            type: "PUT",
            url: api + "tasks/" + taskId,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(task),
            dataType: 'json',
        }).then((res) =>{
            taskUtils.refreshOldParentTasks(res.task[0])
            taskUtils.refreshParentTasks(res.task[0])
            taskUtils.setItem(res.task[0])
            setEditFunction();

        })
    }
    
    function updateAll (task, taskId){
        
        /**
         * Edita uma tarefa e faz um update também nas tarefas "pai"
         * task - Dados da tarefa
         * id - Id da tarefa
         */

        $.ajax({
            type: "PUT",
            url: api + "tasks/v2/" + taskId,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(task),
            dataType: 'json',
        }).then((res) =>{
            taskUtils.refreshOldParentTasks(res.task[0])
            taskUtils.refreshParentTasks(res.task[0])
            taskUtils.setItem(res.task[0])
            setEditFunction();
        })
    }
    
    function destroy(taskId){

        /**
         * Apaga uma tarefa de acordo com o ID
         * id - Id da tarefa
         */

        if(confirm("Deseja mesmo apagar essa tarefa?")){
            $.ajax({
                type: "DELETE",
                url: api + "tasks/" + taskId,
                contentType: "application/json; charset=utf-8",
            }).then((res) =>{
    
                destroyDashboard();
                init();
            })
        }
    }
    
    function index(taskId){

        /**
         * Consulta uma tarefa de acordo com o ID
         * taskId - Id da tarefa
         */

        $.ajax({
            type: "GET",
            url: api + "tasks/" + taskId,
            contentType: "application/json; charset=utf-8",
        }).then((res) =>{
            if(res.task[0]){
                $("#addTask").modal("show");
                
                taskUtils.setTaskSelectStatusOption(statusSelect, res.task[0].allowDone)//REMOVER DAKI
                taskUtils.setDataModal(res.task[0], totalPoints, scoreTask, idInput, nameInput, scoreInput, statusSelect, parentTaskSelect, indexParentInput);
                taskUtils.removeSelectOptions(res.task[0].subtask, parentTaskSelect);
                taskUtils.removeOption(res.task[0].id);
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