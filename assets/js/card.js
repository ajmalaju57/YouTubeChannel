var CORSProxy = "https://cors-hld.herokuapp.com/";
var activeArticle = 0;
var totalArticle = 7;

var xDown = null;
var yDown = null;

function trimString(string, maxLength){
  if(string.length > maxLength){
    string = string.substring(0,maxLength);
    string = string.substr(0, Math.min(string.length, string.lastIndexOf(" ")));
    string += "[...]";
  }
  return string;
}

function replaceText(original, before, after){
    if(before.constructor !== Array){
      before = [before];
      after = [after];
    }
    var result = original;
    for(var i = 0; i < before.length; i++){
      result = result.split(before[i]).join(after[i]);
    }
    return result;
}

function fetchImage(url, i){
  $.ajax({
    url: CORSProxy+url,
    type: 'GET'
  }).done(function(html){
    var image = $(html).find(".image-wrapper").first().html();
    image = $(image).attr("src").replace("7x5","420x300");
    
    $("#articles li").eq(i).find(".card-image").css("background-image","url("+image+")");
  })
}

function fetchFeed(url){
  $.ajax({
    url: CORSProxy+url,
    type: 'GET',
    dataType: "xml",
    error:function(xhr, ajaxOptions, thrownError){
      //$("#articles").append("<li class='error'><h2>Can't Fetch News :/</h2></li>");
      //$("#articles").css("max-height","100px");
      generateCards($("#backup").html(),false);
      $(".limit-error").addClass("show");
    },
    success:function(xml){
      generateCards(xml,true);
    }
  })
}

function generateHtml(data){
  var html = $("#article-template").html();
  var before = ["{{category}}","{{title}}","{{pubDate}}","{{description}}","{{url}}","{{z-index}}"];
  
  return replaceText(html, before, data);
}

function generateCards(xml,isCDATA){
  var items = $(xml).find('item');
  for(var i = 0; i < totalArticle; i++){
    var url = $(items[i]).find('link').text();
    var title = $(items[i]).find('title').text();
    title = trimString(title,65);
    var description = $(items[i]).find('description').text();

    if(!isCDATA)
      description = $(items[i]).find('description').html();

    var pubDate = new Date($(items[i]).find('pubDate').text());
    pubDate = moment(pubDate).fromNow();

   
    var category = $(items[i]).find('category').last().text().toLowerCase();
    var html = generateHtml([category,title,pubDate,description,url,(i * -2)]);

    $("#articles").append(html);
    fetchImage(url,i);
  }
  $("#articles").css("max-height","600px");
  arrangeCards();

  $("#articles li").click(function(){
    $(this).find(".card-content").toggleClass("open");
    if($(this).find(".card-content").hasClass("open")){
      $("#articles li").eq(activeArticle).find("a").removeAttr("tabindex");
    }
  })

  $('#articles li').keypress(function (e) {
    var key = e.which;
    if(key == 13)  // the enter key code
    {
      $(this).find(".card-content").toggleClass("open");
      if($(this).find(".card-content").hasClass("open")){
        $("#articles li").eq(activeArticle).find("a").removeAttr("tabindex");
      }
      else{
        $("#articles li").eq(activeArticle).find("a").attr("tabindex",-1);
      }
      return false;  
    }
  });  

  $(".card-content a").click(function(e){
    e.stopPropagation();
  })
}

function arrangeCards(){
  var order = 0;
  for (var i = activeArticle; i < totalArticle; i++){
    $("#articles li").removeAttr("tabindex");
    $("#articles li").eq(i).css("transform", "translate3d(0px, 0px, "+order*-50+"px) rotateX(0deg)");
    order++;
  }
  $("#articles .card-content").removeClass("open");
  $("#articles li").eq(activeArticle).attr("tabindex",0);
  $("#articles li").eq(activeArticle).find("a").attr("tabindex",-1);
  $("#articles li").eq(activeArticle).find(".open a").removeAttr("tabindex");
}

function nextCard(){
  if(activeArticle < totalArticle - 1){
    $("nav button").removeAttr("disabled");
    $("#articles li").eq(activeArticle).addClass("go-away");
    activeArticle++;
    arrangeCards();

    if(activeArticle == totalArticle - 1)
      $(".next-article").attr("disabled","");
  }
}

function prevCard(){
  if(activeArticle > 0){
    $("nav button").removeAttr("disabled");
    activeArticle--;
    $("#articles li").eq(activeArticle).removeClass("go-away");
    arrangeCards();

    if(activeArticle == 0)
      $(".prev-article").attr("disabled","");
  }
}

//swiping functions (from https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android)
function handleTouchStart(evt) {
  xDown = evt.touches[0].clientX;
  yDown = evt.touches[0].clientY;
};                                                

function handleTouchMove(evt) {
  if ( ! xDown || ! yDown ) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
    if ( xDiff > 0 ) {
      nextCard();
    } else {
      prevCard();
    }                       
  }
  xDown = null;
  yDown = null;          
};

$(function(){
  fetchFeed("https://www.soompi.com/fanclub/bts/feed/");
  
  $(".prev-article").click(function(){
    prevCard();
  })
  $(".next-article").click(function(){
    nextCard();
  })
  
  //navigate with arrow keyboard
  $(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
          prevCard();
        break;

        case 38: // up
          prevCard();
        break;

        case 39: // right
          nextCard();
        break;

        case 40: // down
          nextCard();
        break;

        default: return;
    }
    e.preventDefault();
  });
  
  //swipe listener
  document.getElementById("articles").addEventListener('touchstart', handleTouchStart, false);        
  document.getElementById("articles").addEventListener('touchmove', handleTouchMove, false);
  
})