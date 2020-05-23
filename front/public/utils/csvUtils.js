var csv_tasks = [];

export default {
    csvSave: function(){ // processa os ítens do csv e adiciona num array ordenado a partir do parentTaskId
        var csv_tasks_merged = [];
        csv_tasks.forEach( function(item, index){
            if(index > 0){
                var itemTask = item.split(",");
                var csvTask = {
                    id: parseInt(itemTask[0]),
                    name: itemTask[1],
                    score: parseInt(itemTask[2]),
                    parentTaskId: parseInt(itemTask[3]),
                    subtask: [],
                    totalScore: 0,
                }
                 csv_tasks_merged.push(csvTask);
            }
        })

        return csv_tasks_merged.sort(function(a, b) {
            return a.parentTaskId - b.parentTaskId;
        });
    },

    csvImport: function (){
        csv_tasks = [];
        var csv_file = $("#csv_file");
        var reader = new FileReader();
        function read() {
            var csv = $(csv_file).prop('files')[0];
            reader.readAsText(csv)
        }
        reader.onload = function(){
            reader.result.split("\n").forEach(function (item, index){
                if(item.length == 0){
                    item = [];
                }
                csv_tasks.push(item);
            })
        }
        read();
    },

    csvRemoveSubtasks: function(tasks){
        var csvList = tasks;
        csvList.forEach(function(item){
            item.subtask = [];
        });
        return csvList;
    }
}

