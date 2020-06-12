var f = {
    appendItem: (parent, item) =>{
        
        /** Cria os elementos na interface para estruturar a lista de tarefas
         *  parent(object) - elemento pai que recebe os ítens da lista
         *  item(object) - elemento filho da lista
         */

        var addDropdownButton = '<button class="ml-3 main-circle main-btn bg-transparent text-white main-dropdown" ><i class="fa fa-chevron-down"></i></button>'
        addDropdownButton = item.subtask.length > 0 ? addDropdownButton : '<button style="cursor: default;" class="ml-3 main-circle main-btn bg-transparent text-white main-dropdown" ><i class="fa fa-chevron-down main-text-gray"></i></button>'
        $(parent).append(
            '<ul data-index="' + item.index +'" id="'+item.id+'" class="main-tasks main-rounded">' +
                '<li class="main-task-item main-rounded main-bg-gray "' +
                    '" data-id="'+item.id +
                    '" data-score="'+item.score +
                    '" data-total-score="'+ item.totalScore +'">' + 
                        '<span class="main-task-status main-rounded '+ item.status +'">ID: '+ item.id + ' - ' + item.name + '</span>' +
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

    generateOptions: (parentTaskList) =>{
        /** Adiciona opções no select de tarefa pai.
         * parentTaskList(array) - Lista de tarefas para gerar as opções
         */

        parentTaskList.forEach(function(item){
            $(parentTaskSelect).append('<option data-index="'+item.index+'" value="' + item.id + '">'+item.name+'</option>')
        })
        $(parentTaskSelect).on("change", function(){
            $(indexParentInput).removeAttr('min')
            $(indexParentInput).val($(this).children("option:selected").data('index') + 1)
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

    generateList: (taskList) =>{
        /** Gera na interface as tarefas
         * taskList(array) - TAG html que recebe os pontos da tarefa
         */

        taskList.tasks.forEach(function(task){
            if(task.index == 1){
                f.appendItem($(historyWrapper), task)
            }
            if(task.subtask.length > 0){
                f.generateSubtaskList(task, task.subtask);
            }
        })
        var mainTasks = $('ul.main-tasks');
        f.addEventMainTask($(mainTasks));
    }
}

export default f;

