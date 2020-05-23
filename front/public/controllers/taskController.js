import api from '../services/api.js'

export default {
    store: async (task) =>{
        await $.ajax({
            type: "POST",
            url: api + "/tasks/new",
            contentType: "application/json; charset=utf-8",
        }).then((res) =>{
            console.log(res);
        })
    },

    show: async () => {
        $.ajax({
            type: "GET",
            url: api + "/tasks",
            async: false,
            contentType: "application/json; charset=utf-8",
        }).then(function (res){
            return res;
        })
    },

    update: async (task, task_id) => {
        await $.ajax({
            type: "PUT",
            url: api + "/tasks/" + task_id,
            contentType: "application/json; charset=utf-8",
        }).then((res) =>{
            console.log(res);
        })
    },

    destroy: async (task_id) => {
        await $.ajax({
            type: "DELETE",
            url: api + "/tasks/" + task_id,
            contentType: "application/json; charset=utf-8",
        }).then((res) =>{
            console.log(res);
        })
    },

    index: async (task_id) =>{
        await $.ajax({
            type: "GET",
            url: api + "/tasks/" + task_id,
            contentType: "application/json; charset=utf-8",
        }).then((res) =>{
            console.log(res.task[0]);
        })
    },
}