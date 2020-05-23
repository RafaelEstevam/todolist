import csvUtils from './utils/csvUtils.js'
import csvController from './controllers/csvController.js'
import taskController from './controllers/taskController.js'

$(document).ready(function(){

    var csv_import = $("#csv_import");
    var tasks_save = $("#tasks_save");
    var task_destroy = $("#task_destroy");
    var task_loading = $("#task_loading");
    var tasks_loading = $("#tasks_loading");
    var task_id = $("#task_id");
    
    $(csv_import).on("click", function(){
        csvUtils.csvImport();
    })

    $(tasks_save).on("click", function(){
        var csvList = csvUtils.csvSave();
        csvController.store(csvList);
    })

    $(task_destroy).on("click", async function(){
        taskController.destroy($(task_id).val())
    })

    $(task_loading).on("click", async function(){
        taskController.index($(task_id).val())
    })

    $(tasks_loading).on("click", async function(){
        taskController.show()
    })

})