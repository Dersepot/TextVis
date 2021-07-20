

function addFields(){
    var picked_number = document.getElementById("number_queries")
    var number = picked_number.options[picked_number.selectedIndex].text;
    var container = document.getElementById("container");
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    for (i=0;i<number;i++){
        let elem = document.createElement('div');
        elem.append(tmpl.content.cloneNode(true));
        container.append(elem);
    }
}

var all_elements = []

function start(){
    var author_list = document.getElementsByClassName("author");
    var start_list = document.getElementsByClassName("start");
    var stop_list = document.getElementsByClassName("stop");
    for(var i=0;i<author_list.length;i++){
    var current = []
    current.push(author_list[i].selectedOptions[0].text)
    current.push(start_list[i].selectedOptions[0].text)
    current.push(stop_list[i].selectedOptions[0].text)
    all_elements.push(current)
    }
    console.log(all_elements)
}
