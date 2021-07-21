

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

function start(){
    var all_elements = []
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
    return all_elements
}

function url_builder_words(author, date_start, date_end, limit){
     return 'https://kaskade.dwds.de/dstar/politische_reden/dstar.perl?'+
                            'q=COUNT(%24p%3D{N%2CVV%2CADJ}*+' +
                            '%23ASC_DATE['+ date_start +'%2C'+ date_end +'-12-31]+' +
                            '%23HAS[author%2C%27' +  author + '%27])+'+
                            '%23BY[%24l]+' +
                            '%23DESC_COUNT&ctx=8&fmt=json&start=11&limit='+ limit +'&hint=0';
}

function url_builder_counter(author, date_start, date_end){
    return 'https://kaskade.dwds.de/dstar/politische_reden/dstar.perl?' +
                            'fmt=json&corpus=&limit=10&ctx=8&q=COUNT%28+*+*+%23within+file' +
                            '%23ASC_DATE%5B' + date_start + '%2C' + date_end + '-12-31%5D+%23' +
                            'HAS%5Bauthor%2C%27' + author + '%27%5D%29+&_s=submit'
}

function elements_to_word_url(all_elements, limit){
    var all_url = []
    for(i in all_elements){
        var url = url_builder_words(all_elements[i][0],all_elements[0][1],all_elements[0][2], limit[i])
        all_url.push(url)
    }
    return all_url
}

function elements_to_numbers_url(all_elements){
    var all_url = []
    for(i in all_elements){
        var url = url_builder_counter(all_elements[i][0],all_elements[0][1],all_elements[0][2])
        all_url.push(url)
    }
    return all_url
}

function json_parser(words, speaker, count){
    const key = speaker
    const speeches_count = count
    var content = []
    for(k in words){
        var line = { "key": words[k][1] ,"value": words[k][0] }
        content.push(line)
    }
    var new_json = { "major":{"key": key, "value": speeches_count}, "data": content }
    return new_json
}

	$('#vis').css("width",$(window).height());
	$('#vis').css("margin","auto");

function ratio(all_numbers){
    var picked_word_total = document.getElementById("limit_options")
    var word_total = picked_word_total.options[picked_word_total.selectedIndex].text;
    var ratio_numbers = []
    var sum_all_numbers = 0
    for (i in all_numbers){
        sum_all_numbers = sum_all_numbers + all_numbers[i]
    }
    for (i in all_numbers){
        var ratio = Math.round((word_total*all_numbers[i])/(sum_all_numbers))
        ratio_numbers.push(ratio)
    }
    return ratio_numbers
}

async function get_numbers(all_url){
      var all_numbers = []
      for(k in all_url){
        const response = await fetch(all_url[k]);
        var data = await response.json()
        all_numbers.push(data.counts_)
      }
      return all_numbers
}


async function get_words(all_url){
      var all_words = []
      for(k in all_url){
        const response = await fetch(all_url[k]);
        var data = await response.json()
        all_words.push(data.counts_)
      }
      return all_words
}

async function tagpie(){
    var elements = start()
    var numbers = await get_numbers(elements_to_numbers_url(elements))
    var all_numbers = []
    for (i in numbers){
        all_numbers.push(numbers[i][0][0])
    }
    var ratio_numbers = ratio(all_numbers)
    var data = await get_words(elements_to_word_url(start(), ratio_numbers))
    var all = []
    for (i in data){
        var speaker = elements[i][0]
        var formated = json_parser(data[i], speaker, all_numbers[i])
        all.push(formated)
    }
    $("#vis").empty();
    new TagPie("vis", all);
    $("#overlay").css("display","none");
}

