import csvUtils from './utils/csvUtils.js'
import csvController from './controllers/csv.js'

$(document).ready(function(){

    var csv_import = $("#csv_import");
    var tasks_save = $("#tasks_save");
    var tasks_loading = $("#tasks_loading");
    var task_id = $("#task_id");
    
    $(csv_import).on("click", function(){
        csvUtils.csvImport();
    })

    $(tasks_save).on("click", function(){
        var csvList = csvUtils.csvSave();
        csvController.store(csvList);
    })

    $(tasks_loading).on("click", async function(){
        csvController.index($(task_id).val())
    })

})