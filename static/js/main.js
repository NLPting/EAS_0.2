API_URL_score = "http://thor.nlplab.cc:7777/aes"
API_URL_d = "http://thor.nlplab.cc:7777/aes_dect"
API_URL_d_sen = "http://thor.nlplab.cc:7777/dect_sen"

$(document).ready(function() {
    SearchBar.init();
});



$('.writeAhead').hide();
//$('#score-feeback').hide();
//$('#GED').hide();
//$('#Suggest').hide();
//$('#suggest-info').hide()




// AES API
function score_it_post(query){ 
    $.ajax({
        type: "POST",
        url: API_URL_score,
        data: JSON.stringify({courpus: query}),
        dataType: 'json',
        success: function (data) {
            cerf_show(data)
        }, 
        error: function(XMLHttpRequest, textStatus, errorThrown) {       
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        } 
    })
}

// GED API
function dect_it_post(query){
    
    $.ajax({
        type: "POST",
        url: API_URL_d,
        data: JSON.stringify({courpus: query}),
        dataType: 'json',
        success: function (data) {
            revise_content(data.sen_arry , data.score_arry)
            //console.log(data)
        }, 
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        } 
    })
}

// Sen_GED API
function sen_dect(query){
    
    $.ajax({
        type: "POST",
        url: API_URL_d_sen,
        data: JSON.stringify({courpus: query}),
        dataType: 'json',
        success: function (data) {
            console.log(data)
            revise_sentence_check(data.sen_arry , data.tag_arry)
        }, 
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        } 
    })
}

function cerf_show(data){
    $('#'+data['cerf']).css("background-color",'#17a2b8');
    $('#cefrscore').text(data['cerf'])
}

$("#send-aes").click(function(){

    $('#A1').css("background-color",'rgb(233, 236, 239)');
    $('#A2').css("background-color",'rgb(233, 236, 239)');
    $('#B1').css("background-color",'rgb(233, 236, 239)');
    $('#B2').css("background-color",'rgb(233, 236, 239)');
    $('#C1').css("background-color",'rgb(233, 236, 239)');
    $('#C2').css("background-color",'rgb(233, 236, 239)');

    var sentence = $("#search").text()
    //console.log(sentence)
    score_it_post(sentence);
    dect_it_post(sentence);

})


$(document).on('click','.sen-notok',function(){
    document.getElementById('suggest-info').innerHTML = ''
    look_data = $(this).text()
    sen_dect(look_data)
});

$(document).on('click','.sen-bad',function(){
    document.getElementById('suggest-info').innerHTML = ''
    look_data = $(this).text()
    sen_dect(look_data)
});


$(document).on('click','.B-R',function(){
    
    //$('.linggle.search-result').hide()
    index = $(this).attr('id')
    console.log(sen , tag)
    var query = ''
    var tmp = []
    index_arry = [parseInt(index)-1 , parseInt(index) , parseInt(index)+1]
    console.log(index_arry)
    console.log('-----')
    
    for(i=0;i<index_arry.length;i++){
        if (index_arry[i] > 0 && index_arry[i] < tag.length+1){
            tmp.push(index_arry[i])
        }
    }
    for(i=0;i<tmp.length;i++){
        console.log(sen[5])
        if (tmp[i] == index){
            query+='* '
        }else{
            query+= sen[[tmp[i]]]+' '
        }
    }
    //linggle_it_post(query)
    SearchResult.query(query);
    var searchBar = $('#search-bar');
    searchBar.val(query)
    $('.linggle.search-result').show()
    

});


$(document).on('click','.B-D',function(){
    
    index = $(this).attr('id')
    console.log(sen , tag)
    var query = ''
    var tmp = []
    index_arry = [parseInt(index)-1 , parseInt(index) , parseInt(index)+1]
    console.log(index_arry)
    console.log('-----')
    
    for(i=0;i<index_arry.length;i++){
        if (index_arry[i] > 0 && index_arry[i] < tag.length+1){
            tmp.push(index_arry[i])
        }
    }
    for(i=0;i<tmp.length;i++){
        //console.log(sen[5])
        if (tmp[i] == index){
            query+='?'+ sen[tmp[i]]+' '
        }else{
            query+= sen[[tmp[i]]]+' '
        }
    }
    //linggle_it_post(query)
    //console.log(query);
    SearchResult.query(query);
    var searchBar = $('#search-bar');
    searchBar.val(query)
    $('.linggle.search-result').show()
    

});








function revise_content(data , score){
    $('#suggest-info').show();
    var content = ''
    for(i=0;i<data.length;i++){
        s = data[i].join(' ').replace(' ,',',').replace(' .','.').replace(' ?','?')
        
        grade = score[i]
        if (grade > 0.0 && grade < 0.15){
            content += '<span class="sen-notok"'+'id='+i +'>'+' '+s+'</span>'
        }
        else if(grade >= 0.15){
            content += '<span class="sen-bad"'+'id='+i+'>'+' '+s+'</span>'
        }
        else {
            content += ' '+s
        } 
    }
    document.getElementById('feedback-dectect').innerHTML =content;
    $('#feedback-dectect').show();
}


var sen = [];
var tag = [];
function revise_sentence_check(data , tag_token){
    sen = data[0]
    tag = tag_token[0]
    var content = '<div>'
    for(i=0;i<sen.length;i++){
        
        if (tag[i] == 'O'){
            content += ' '+sen[i]
        }
        else if(tag[i] == 'B-I'){
            //add = '<button type="button" class="btn btn-warning" id="B-I">Insert</button>'
            add = ' '+'<span class="B-II"'+'id='+i+'>'+'Insert Word '+'</span>'
            content += add + sen[i]
            //content += ' '+add+sen[i]+'</span>'
        }
        else if (tag[i]=='B-R') {
          //replace = '<button type="button" class="btn btn-success" id="B-R">Replace</button>'
            content += ' '+'<span class="B-R"'+'id='+i+'>'+sen[i]+'</span>'
        }
        else if (tag[i]=='B-D') {
            content += ' '+'<span class="B-D"'+'id='+i+'>'+sen[i]+'</span>'
        }
    }
    content+='</div>'
    document.getElementById('suggest-info').innerHTML =content.replace(' ,',',').replace(' .','.');
}