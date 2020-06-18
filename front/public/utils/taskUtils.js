import api from './api.js'

var parentTaskList = [];

var f = {

    dataTask: {oldParentTaskId: 0}, //Objeto que recebe todos os dados da tarefa que está sendo editada.

    appendItem: (parent, item) =>{
        
        /** Cria os elementos na interface para estruturar a lista de tarefas
         *  parent(object) - elemento pai que recebe os ítens da lista
         *  item(object) - elemento filho da lista
         */

        if(item.allowDone == "false" && item.status == "done"){
            item.status = "false"
        }

        var currentScore = item.totalScore == 0 ? item.score : item.totalScore
        var addDropdownButton = '<button id="btn-drop-'+ item.id +'" class="ml-3 main-circle main-btn bg-transparent text-white main-dropdown dropdown" ><i class="fa fa-chevron-down"></i></button>'
        addDropdownButton = item.subtask.length > 0 ? addDropdownButton : '<button id="btn-drop-'+ item.id +'" class="ml-3 main-circle main-btn bg-transparent text-white main-dropdown" ><i class="fa fa-chevron-down"></i></button>'
        
        $(parent).append(
            '<ul data-index="' + item.index +'" id="'+item.id+'" class="main-tasks main-rounded">' +
                '<li class="main-task-item main-rounded main-bg-gray "' +
                    'data-id="'+item.id +
                    '" data-score="'+item.score +
                    '" data-total-score="'+ item.totalScore +'">' + 
                        '<span id="item-' + item.id + '" class="main-task-status main-rounded '+ item.status +'"> <span class="ml-2">ID: '+ item.id + ' - ' + item.name + '</span></span>' +
                        '<div class="d-flex justify-content-center align-items-center">'+
                            '<span class="ml-2 main-task-total-score"> Pontuação Total: '+ currentScore + '</span>' +
                            '<span class="ml-2 main-task-total-score"> Pontuação: '+ item.score + '</span>' +
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
        /**
         * Atualiza o index das subtarefas de acordo com o index da tarefa principal
         * task(object) - tarefa atual
         * taskList(array) - subtarefas da tarefa atual
         */
        taskList.forEach(function(item){
            item.index = task.index + 1
            f.changeIndexTree(item, item.subtask)
        })
    },

    setUpdateDataTask: () =>{
        /**
         * Faz o update de novas informações ao objeto dataTask.
         */
        f.dataTask.name = $("input[name='name']").val()
        f.dataTask.score =  parseInt($("input[name='score']").val())
        f.dataTask.totalScore = 0
        f.dataTask.status = $("select[name='status']").val()
    },

    setOnChangeParentTaskSelect: (indexParentInput, parentTaskSelect) => {

        /**
         * Atribiu ao seletor de tarefa principal o comportamento de atualizar o index da tarefa selecionada e das subtarefas.
         * Faz o update das informações relacionadas à seleção da tarefa.
         */

        $(indexParentInput).removeAttr('min');
        $(indexParentInput).val($(parentTaskSelect).children("option:selected").data('index') + 1);
        
        f.dataTask.index = parseInt($("input[name='index']").val());
        f.dataTask.oldParentTaskId = f.dataTask.parentTaskId;
        f.dataTask.parentTaskId = parseInt($("select[name='parentTaskId']").val());

        f.changeIndexTree(f.dataTask, f.dataTask.subtask);
    },

    setTaskSelectStatusOption: (statusSelect, allowDone) =>{

        /**
         * Adiciona/Remove as opções de seleção de status da tarefa de acordo com o parâmetro AllowDone,
         * que informa se a tarefa pode ser dada como concluida.
         * statusSelect(Element) - Elemento que recebe as opções.
         * allowDone(string) - Indicador de conclusão de uma tarefa e suas subtarefas
         */

        $(statusSelect).children().remove()
        $(statusSelect).append('<option value="">Selecione um status</option>');
        $(statusSelect).append('<option value="to-do">Para fazer</option>')
        $(statusSelect).append('<option value="in-progress">Em progresso</option>')
        $(statusSelect).append('<option value="blocked">Bloqueada</option>')
        if(allowDone == "true"){
            $(statusSelect).append('<option value="done">Concluida</option>');
        }else{
            $(statusSelect).append('<option value="done">Alerta</option>');
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
        /**
         * Adiciona/remove as opções padrões do seletor de tarefas.
         * statusSelect(parentTaskSelect) - Elemento que recebe as opções.
         */
        parentTaskList = [];
        $(parentTaskSelect).children().remove()
        $(parentTaskSelect).append('<option data-index="0" value="0">Tarefa principal</option>');
    },

    generateTaskOptions: (parentTaskSelect, id) =>{

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

    removeOption: (taskId) =>{
        /**
         * Remove uma tarefa do seletor de acordo com o ID. 
         * Esse recurso serve para impossibilitar que o usuário selecione uma tarefa que já está dentro de sua 
         * árvore de tarefas, e impossibilita a seleção da mesma tarefa.
         */

        $(parentTaskSelect).find('option[value="'+ taskId +'"]').remove()
    },

    removeSelectOptions: (listOptions, parentTaskSelect) =>{
        /**
         * Remove uma tarefa do seletor de acordo com o ID.
         * listOptions(array) - Lista de ids que devem ser removidos da seleção
         * parentTaskSelect - Elemento referência para busca das opções
         */
        listOptions.forEach(function(item){
            f.removeOption(item.id)
            f.removeSelectOptions(item.subtask, parentTaskSelect);
        })
    },

    setDataModal: (task, totalPoints, scoreTask, idInput, nameInput, scoreInput, statusSelect, parentTaskSelect, indexParentInput) =>{
        /** Apresentar os dados da task no popup e atribui o valor de task ao objeto dataTask
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
        parentTaskList = [];

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
    },

    setItem: (data) =>{
        /**
         * Exibe, na interface, um novo elemento que representa a tarefa adicionada/atualizada sem a
         * necessidade de recarregamento da tela.
         * data(object) - Dados usados para criação desse elemento.
         */

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

    getParentAndRefresh: (parentTaskId) =>{
        /**
         * Atualiza a tarefa pai
         * parentTaskId(int) - Id da tarefa pai
         */

        $.ajax({
            type: "GET",
            url: api + "tasks/" + parentTaskId,
            contentType: "application/json; charset=utf-8",
        }).then(function(res){
            f.refreshParentTasks(res.task[0])
        })
    },

    refreshTask: (data) =>{

        /**
         * Atualiza o status da tarefa na listagem de tarefas, de acordo com seu status.
         * Se a tarefa estiver com o status done mas com o allowDone como 'false', é colocado um 
         * status de alerta, indicando que aquela tarefa recebeu uma nova subtarefa não completada.
         * data(object) - informações da tarefa
         */

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

        /**
         * Faz uma atualização da tarefa pai antiga da tarefa editada.
         * data(object) - dados da tarefa
         */

        f.refreshTask(data);

        if(data.oldParentTaskId > 0){
            f.getParentAndRefresh(data.oldParentTaskId)
        }
    },

    refreshParentTasks: (data) => {

        /**
         * Faz uma atualização da tarefa pai da tarefa editada.
         * data(object) - dados da tarefa
         */

        f.refreshTask(data);

        if(data.parentTaskId > 0){
            f.getParentAndRefresh(data.parentTaskId)
        }

        if(data.subtask.length == 0){
            f.removeBtnDrowdown(data.id)
        }

    },

    setBtnDrowdown: (data) =>{
        /**
         * Adiciona botão de dropdown a tarefa
         * data(object) - dados da tarefa
         */
        $("#btn-drop-"+data.parentTaskId).addClass("dropdown")
    },

    removeBtnDrowdown: (id) =>{
        /**
         * Remove botão de dropdown a tarefa
         * id(int) - id da tarefa
         */
        $("#btn-drop-"+id).removeClass("dropdown")
    },

    deleteItem: (data) =>{ //DEPRECIADO
        $("#"+data).remove();
    }
}

export default f;

