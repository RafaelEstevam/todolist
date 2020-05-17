import api from '../services/api.js'

// var task;

// function searchTaskById(task_id, tasks){
//     tasks.forEach(function(item){
//         if(item.id == task_id){
//             task = item;
//         }else{
//             searchTaskById(task_id, item.subtask)
//         }
//     })
//     return task;
// }

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

    index: async (task_id) =>{

        await $.ajax({
            type: "GET",
            url: api + "/tasks/" + task_id,
            contentType: "application/json; charset=utf-8", // permite requisições que enviam dados do tipo json
        }).then((res) =>{
            // var response = JSON.parse(res)
            // console.log(searchTaskById(task_id, response.tasks))
            console.log(res.task[0]);
        })
    },
}