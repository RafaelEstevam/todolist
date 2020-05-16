import api from '../services/api.js'

export default {
    store: function(tasks){
        var taskList = {
            tasks: tasks
        }
        taskList = JSON.stringify(taskList);
        $.ajax({
            type: "POST",
            url: api + "/csv",
            contentType: "application/json; charset=utf-8", // permite requisições que enviam dados do tipo json
            data: taskList
        }).then(function (res){
            console.log(res);
        })
    },
}