import api from './api.js'

var parentTaskList = [];

var f = {

    dataTask: {oldParentTaskId: 0},

    appendItem: (parent, item) =>{
        
        /** Cria os elementos na interface para estruturar a lista de tarefas
         *  parent(object) - elemento pai que recebe os ítens da lista
         *  item(object) - elemento filho da lista
         */

        if(item.allowDone == "false" && item.status == "done"){
            item.status = "false"
        }

        var addDropdownButton = '<button id="btn-drop-'+ item.id +'" class="ml-3 main-circle main-btn bg-transparent text-white main-dropdown dropdown" ><i class="fa fa-chevron-down"></i></button>'
        addDropdownButton = item.subtask.length > 0 ? addDropdownButton : '<button id="btn-drop-'+ item.id +'" class="ml-3 main-circle main-btn bg-transparent text-white main-dropdown" ><i class="fa fa-chevron-down"></i></button>'
        // addDropdownButton = item.subtask.length > 0 ? addDropdownButton : '';
        
        $(parent).append(
            '<ul data-index="' + item.index +'" id="'+item.id+'" class="main-tasks main-rounded">' +
                '<li class="main-task-item main-rounded main-bg-gray "' +
                    'data-id="'+item.id +
                    '" data-score="'+item.score +
                    '" data-total-score="'+ item.totalScore +'">' + 
                        '<span id="item-' + item.id + '" class="main-task-status main-rounded '+ item.status +'">ID: '+ item.id + ' - ' + item.name + '</span>' +
                        '<div class="d-flex justify-content-center align-items-center">'+
                            '<button title="Ver tarefa" data-id="'+item.id+'" class="ml-3 main-circle main-btn main-bg-deep text-white edit" ><i class="fa fa-pencil"></i></button>' +
                            addDropdownButton + 
                        '</div>' +
                '</li>' +
            '</ul>')
    },
    
    addEventMainTask:(mainTasks) =>{
        /** Adiciona o evento de abertura de árvore para mostar subtarefas.
         * mainTasks(array) - lista de elementos que recebem o evento
         */
        $(mainTasks).each(function(){
            var itemTask = $($(this).children()[0]);
            $($(this).children()[0]).find(".main-dropdown").on("click", function(){
                $(itemTask).parent().toggleClass("active");
            })
        })
    },

    changeIndexTree: (task, taskList) =>{
        taskList.forEach(function(item){
            item.index = task.index + 1
            f.changeIndexTree(item, item.subtask)
        })
    },

    setUpdateDataTask: () =>{
        f.dataTask.name = $("input[name='name']").val()
        f.dataTask.score =  parseInt($("input[name='score']").val())
        f.dataTask.totalScore = 0
        f.dataTask.status = $("select[name='status']").val()
    },

    setOnChangeParentTaskSelect: (indexParentInput, parentTaskSelect) => {
        $(indexParentInput).removeAttr('min');
        $(indexParentInput).val($(parentTaskSelect).children("option:selected").data('index') + 1);
        
        f.dataTask.index = parseInt($("input[name='index']").val());
        f.dataTask.oldParentTaskId = f.dataTask.parentTaskId;
        f.dataTask.parentTaskId = parseInt($("select[name='parentTaskId']").val());

        f.changeIndexTree(f.dataTask, f.dataTask.subtask);
    },

    setTaskSelectStatusOption: (statusSelect, allowDone) =>{
        $(statusSelect).children().remove()
        $(statusSelect).append('<option value="">Selecione um status</option>');
        $(statusSelect).append('<option value="to-do">Para fazer</option>')
        $(statusSelect).append('<option value="in-progress">Em progresso</option>')
        $(statusSelect).append('<option value="blocked">Bloqueada</option>')
        if(allowDone == "true"){
            $(statusSelect).append('<option value="done">Concluida</option>');
        }
    },

    generateSelectParentOption: (taskList) =>{

        /** 
         * Lê todas as listas de tarefas e subtarefas e adiciona a um novo array para ordená-la pelo id
         */

        taskList.forEach(function(item){
            if(item.subtask.length > 0){
                parentTaskList.push(item);
                f.generateSelectParentOption(item.subtask)
            }else{
                parentTaskList.push(item);
            }
        })
        return parentTaskList.sort(function(a,b){
            return a.id - b.id;
        })
    },

    removeAddDefaultSelectOptions: (parentTaskSelect) =>{
        parentTaskList = [];
        $(parentTaskSelect).children().remove()
        $(parentTaskSelect).append('<option data-index="0" value="0">Tarefa principal</option>');
    },

    generateTaskOptions: (parentTaskSelect) =>{

        /** Adiciona opções no select de tarefa.
         * parentTaskSelect(element) - Componente que recebe a lista de tarefas
         */
        
        $.ajax({
            type: "GET",
            url: api + "tasks",
            async: false,
            contentType: "application/json; charset=utf-8",
        }).then(function (res){
            f.generateSelectParentOption(JSON.parse(res).tasks).forEach(function(item){
                $(parentTaskSelect).append('<option data-index="'+item.index+'" value="' + item.id + '">'+ item.id + ' - ' + item.name+'</option>')
            })
        })

        // parentTaskList.forEach(function(item){
        //     $(parentTaskSelect).append('<option data-index="'+item.index+'" value="' + item.id + '">'+ item.id + ' - ' + item.name+'</option>')
        // })

        // $(parentTaskSelect).on("change", function(){
        //     $(indexParentInput).removeAttr('min')
        //     $(indexParentInput).val($(this).children("option:selected").data('index') + 1)
            
        //     f.dataTask.index = parseInt($("input[name='index']").val());
        //     f.dataTask.parentTaskId = parseInt($("select[name='parentTaskId']").val());

        //     f.changeIndexTree(f.dataTask, f.dataTask.subtask);
        // })
    },

    restoreDataModal: (totalPoints, scoreTask, idInput, nameInput, scoreInput, statusSelect, parentTaskSelect, indexParentInput) =>{
        
        /** Zerar os dados do popup de adição/edição de tarefas
         * totalPoints(object) - TAG html que recebe os pontos totais da tarefa
         * scoreTask(object) - TAG html que recebe os pontos da tarefa
         * idInput(object) - TAG html que recebe o ID da tarefa
         * nameInput(object) - TAG html que recebe o nome da tarefa
         * scoreInput(object) - TAG html que recebe os pontos da tarefa
         * statusSelect(object) - TAG html que seleciona o status da tarefa
         * parentTaskSelect(object) - TAG html que seleciona a tarefa pai
         * indexParentInput(object) - TAG html que recebe o nível da tarefa
         */
        
        $(totalPoints).text("");
        $(scoreTask).text("");
        $(idInput).val("");
        $(nameInput).val("");
        $(scoreInput).val("");
        $(statusSelect).val("");
        $(parentTaskSelect).val("0");
        $(indexParentInput).val("1");
    },

    setDataModal: (task, totalPoints, scoreTask, idInput, nameInput, scoreInput, statusSelect, parentTaskSelect, indexParentInput) =>{
        /** Apresentar os dados da task no popup
         * totalPoints(object) - TAG html que recebe os pontos totais da tarefa
         * scoreTask(object) - TAG html que recebe os pontos da tarefa
         * idInput(object) - TAG html que recebe o ID da tarefa
         * nameInput(object) - TAG html que recebe o nome da tarefa
         * scoreInput(object) - TAG html que recebe os pontos da tarefa
         * statusSelect(object) - TAG html que seleciona o status da tarefa
         * parentTaskSelect(object) - TAG html que seleciona a tarefa pai
         * indexParentInput(object) - TAG html que recebe o nível da tarefa
         */

        f.dataTask = task;

        if(task){
            var totalScore = task.totalScore > 0 ? task.totalScore : task.score
            $(totalPoints).text(totalScore);
            $(scoreTask).text(task.score);
            $(idInput).val(task.id);
            $(nameInput).val(task.name);
            $(scoreInput).val(task.score);
            $(statusSelect).val(task.status);
            $(parentTaskSelect).val(task.parentTaskId);
            $(indexParentInput).val(task.index);
        }
    },

    generateSubtaskList:(task, taskList) =>{
        /** Gera na interface as subtarefas
         * task(object) - TAG html que recebe os pontos totais da tarefa
         * taskList(array) - TAG html que recebe os pontos da tarefa
         */

        var thisTask = $("#" + task.id)
        taskList.forEach(function(item){
            if(item.parentTaskId == task.id){
                if(item.subtask.length > 0){
                    f.appendItem($(thisTask), item)
                    f.generateSubtaskList(item, item.subtask);
                }else{
                    f.appendItem($(thisTask), item)
                }
            }
        })
    },

    generateList: (element, taskList) =>{
        /** Gera na interface as tarefas
         * taskList(array) - lista de tarefas principais
         */

        taskList.tasks.forEach(function(task){
            if(task.index == 1){
                f.appendItem(element, task);
            }
            if(task.subtask.length > 0){
                f.generateSubtaskList(task, task.subtask);
            }
        })
        // var mainTasks = $('ul.main-tasks');
        // f.addEventMainTask($(mainTasks));
    },

    setItem: (data) =>{
        $("#"+data.id).remove();
        if(data.index == 1){
            f.appendItem($(historyWrapper), data);
        }else{
            f.appendItem($("#"+data.parentTaskId), data);
        }

        if(data.subtask.length > 0){
            f.generateSubtaskList(data, data.subtask);
        }
        f.setBtnDrowdown(data);
    },

    getParentAndRefresh: (parentTasiId) =>{
        $.ajax({
            type: "GET",
            url: api + "tasks/" + parentTasiId,
            contentType: "application/json; charset=utf-8",
        }).then(function(res){
            f.refreshParentTasks(res.task[0])
        })
    },

    refreshTask: (data) =>{
        if(data.allowDone == "false" && data.status == "done"){
            $("#item-"+data.id).addClass("false")
        }else{
            if($("#item-"+data.id).hasClass("false")){
                $("#item-"+data.id).removeClass("false")
            }
            $("#item-"+data.id).addClass(data.status)
        }
    },

    refreshOldParentTasks: (data) =>{
        f.refreshTask(data);

        if(data.oldParentTaskId > 0){
            f.getParentAndRefresh(data.oldParentTaskId)
        }
    },

    refreshParentTasks: (data) => {
        // if(data.allowDone == "false" && data.status == "done"){
        //     $("#item-"+data.id).addClass("false")
        // }else{
        //     if($("#item-"+data.id).hasClass("false")){
        //         $("#item-"+data.id).removeClass("false")
        //     }
        //     $("#item-"+data.id).addClass(data.status)
        // }

        // console.log(data)

        f.refreshTask(data);

        if(data.parentTaskId > 0){
            f.getParentAndRefresh(data.parentTaskId)
        }

    },

    setBtnDrowdown: (data) =>{
        $("#btn-drop-"+data.parentTaskId).addClass("dropdown")
    },

    deleteItem: (data) =>{
        $("#"+data).remove();
    }
}

export default f;

