//     var author_list1 = document.getElementById("author1");
//     var author1 = author_list1.options[author_list1.selectedIndex].text
     var limit = '100'
//     var start_list1 = document.getElementById("start1");
//     var date_start1 = start_list1.options[start_list1.selectedIndex].text
//     var stop_list1 = document.getElementById("stop1");
//     var date_end1 = stop_list1.options[stop_list1.selectedIndex].text
//     var author_list2 = document.getElementById("author2");
//     var author2 = author_list2.options[author_list2.selectedIndex].text
//     var start_list2 = document.getElementById("start2");
//     var date_start2 = start_list2.options[start_list2.selectedIndex].text
//     var stop_list2 = document.getElementById("stop2");
//     var date_end2 = stop_list2.options[stop_list2.selectedIndex].text
     var all_elements = []

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
    return all_elements
}

function url_builder_words(date_start, date_end, author, limit){
     return 'https://kaskade.dwds.de/dstar/politische_reden/dstar.perl?'+
                            'q=COUNT(%24p%3D{N%2CVV%2CADJ}*+' +
                            '%23ASC_DATE['+ date_start +'%2C'+ date_end +'-12-31]+' +
                            '%23HAS[author%2C%27' +  author + '%27])+'+
                            '%23BY[%24l]+' +
                            '%23DESC_COUNT&ctx=8&fmt=json&start=11&limit='+ limit +'&hint=0';
}

function url_builder_counter(date_start, date_end, author){
    return 'https://kaskade.dwds.de/dstar/politische_reden/dstar.perl?' +
                            'fmt=json&corpus=&limit=10&ctx=8&q=COUNT%28+*+*+%23within+file' +
                            '%23ASC_DATE%5B' + date_start + '%2C' + date_end + '-12-31%5D+%23' +
                            'HAS%5Bauthor%2C%27' + author + '%27%5D%29+&_s=submit'
}

async function get_dwds(url_function) {
     url = url_function
     const response = await fetch(url);
     const data = await response.json();
     return data.counts_
}

function json_parser(words, count, author){
    const key = author
    const speeches_count = count
    var content = []
    for(k in words){
        content.push({ "key": words[k][1] ,"value": words[k][0] },)
    }
    return { "major":{"key": key, "value": speeches_count}, "data": content }
}

	$('#vis').css("width",$(window).height());
	$('#vis').css("margin","auto");

    get_dwds(url_builder_counter(date_start1, date_end1, author1)).then(count1 => {
    get_dwds(url_builder_counter(date_start2, date_end2, author2)).then(count2 => {
    var speaker1 = count1[0][0]
    var speaker2 = count2[0][0]
    var sum = speaker1 + speaker2
    speaker1_word_share = Math.round((limit*speaker1)/(speaker1+speaker2))
    speaker2_word_share = Math.round((limit*speaker2)/(speaker1+speaker2))
    console.log(speaker1_word_share, speaker2_word_share)
    get_dwds(url_builder_words(date_start1, date_end1, author1, speaker1_word_share)).then(words1 => {
    get_dwds(url_builder_words(date_start2, date_end2, author2, speaker2_word_share)).then(words2 => {

    var speaker1_words = json_parser(words1, count1[0][0], author1)
    var speaker2_words = json_parser(words2, count2[0][0], author2)
    var all_info = [speaker1_words, speaker2_words]

	var generateTagPie = function(){
		$("#vis").empty();
		new TagPie("vis",all_info,{
			number_of_tags: Infinity,
			style: "basic",
			edit_distance: 0
		});
		$("#overlay").css("display","none");
	}

    generateTagPie();
    });
    })
    })
    })







