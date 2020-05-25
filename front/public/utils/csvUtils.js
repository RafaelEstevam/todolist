var csv_tasks = [];

export default {
    csvSave: function(){ // processa os ítens do csv e adiciona num array ordenado a partir do parentTaskId
        var csv_tasks_merged = [];
        csv_tasks.forEach( function(item, index){
            if(index > 0){
                var itemTask = item.split(",");
                var csvTask = {
                    id: parseInt(itemTask[0]),
                    index: parseInt(itemTask[1]),
                    name: itemTask[2],
                    score: parseInt(itemTask[3]),
                    parentTaskId: parseInt(itemTask[4]),
                    totalScore: parseInt(itemTask[5]),
                    status: itemTask[6],
                    subtask: [],
                }
                csv_tasks_merged.push(csvTask);
            }
        })

        return csv_tasks_merged.sort(function(a, b) {
            return a.index - b.index;
        });
    },

    csvImport: function (input){

        csv_tasks = [];
        var csv_file = input;
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

