const constant = {
    releaseType: [ 
        {"id":"1","releaseType":"RELEASE"},
        {"id":"2","releaseType":"REPACK"},
        {"id":"3","releaseType":"EP"}
    ],
    dropList: [
        {"delivery":"1744","id":"1"},
        {"delivery":"1747","id":"2"},
        {"delivery":"1750","id":"3"},
        {"delivery":"1801","id":"4"},
        {"delivery":"1804","id":"5"}
    ],
    taskType: [
        {"id":"1","taskType":"BSUC"},
        {"id":"2","taskType":"PBI"},
        {"id":"3","taskType":"TR"},
        {"id":"4","taskType":"CR"}
    ],
    getReleaseName: function(drop,type,label){
        return drop + " " + type + " " + label;
    }
}


// make this available to our users in our Node applications
module.exports = constant;