//Global variables
var gCompare = [];
var gCount = 0 ;
var $gPrevious = 0;
var $gCurrent = 0 ;
var $gFliiped = 0;
var gGameCards = {}
var gObjNames={};
var gLastUser ='';
var gTime = 45;
var gCoupleFliiped = 8;
var gIfStarted = false;
var stopTime = 0 ;

var saveInfo = {
//start time record and print it on board.
  timeRecord: function(){
    var starTime = new Date().getTime();
    var now = new Date().getTime();
    stopTime =  setInterval(function(){

      now = new Date().getTime();
      gTime = Math.floor((now - starTime ) / 1000 );
      document.getElementById("seconds").innerHTML= gTime;
    },1000);
  },

  /*execute when win - check if there is a new record and send/get data
  to/from localStorage */
  getVlue: function(last){
    var names = localStorage.getItem('users');
    names = JSON.parse(names);
    var findProp = Object.keys(names).indexOf(last);
    var propsArray = Object.keys(names);
    var propValus = Object.values(names);
    if(findProp == -1){
      names[last]=gTime;
      alert('You won !  your time: ' + gTime + ' seconds');
    }
    else{
      if(propValus[findProp] > gTime){
        names[last]=gTime;
        alert('You won and set New Record !!!  your time: ' + gTime + ' seconds');
      }
      else{
        alert('You won !  your time: ' + gTime + ' seconds');
      }
    }
    names = JSON.stringify(names);
    localStorage.setItem('users',names);
  },

  //get input from user and initiate prop/values in locak storage
  onStart: function(){
    var checkLocal = localStorage.getItem('users');
    if(checkLocal == null){
      localStorage.setItem('users','{}');
      var user = prompt('what is your name ?');
      localStorage.setItem('lastUser',user);
      gLastUser = user;
    }
    else {
      gLastUser = localStorage.getItem('lastUser');
      var conf = confirm('your name is '+ gLastUser + ' ?');
      if(conf === false){
        var user = prompt('what is your name ?');
      }
      else{
        var user = localStorage.getItem('lastUser');
      }
      gLastUser = user;
      localStorage.setItem('lastUser',user);
    }
  },
}

var MatchGame =  {


  gameTurn: function(obj){

    $gFliiped =$(obj).find('.cover1').css('display');
    // prevent more than 2 card to be fliiped and do prevent "clicking" when
    // card allready "fliiped"
    if($gFliiped == 'none' || gCount >= 2){
      return false;
    }
    else{
      //show clicked card content
      $(obj).find('.cover1').css('display','none');
      $gCurrent = $(obj).find('.cover1');
      gCount++;
      if(gCount === 1){  //when only 1 card is flliped
        gCompare[0] = $(obj).find('span').text();
        $gPrevious = $(obj).find('.cover1');
      }
      else{
        gCompare[1] = $(obj).find('span').text();
        if(gCompare[0] !== gCompare[1]){  //check if 2 card have equal value
          setTimeout(function(){
            $gCurrent.css('display','block');  //hide the 2 selected cards after 1.1 seoconds
            $gPrevious.css('display','block');
            gCount=0;
          }, 1100);
        }
        else if(gCount === 2){
          // if 2 card are equal - change their colors
          $gCurrent.parent().css({"background-color":"rgb(153, 153, 153)","color":"rgb(204, 204, 204)"});
          $gPrevious.parent().css({"background-color":"rgb(153, 153, 153)","color":"rgb(204, 204, 204)"});
          gCoupleFliiped--;
          if(gCoupleFliiped === 0 ){  //chek if all card are fliiped

            setTimeout(function() {  //stop time recors and restart game
              clearInterval(stopTime);
            saveInfo.getVlue(gLastUser);
              MatchGame.restart();
            }, 500);

          }
          gCount=0;
        }
      }
    }
  },
  restart: function(){  // reset all game cards and values for restart the game
    MatchGame.createCards();
    MatchGame.renderCarsds();
    gCoupleFliiped=8;
    var gCount = 0 ;
    gIfStarted = false;
    document.getElementById("seconds").innerHTML= 0;
    $('.cardGame').find('.cover1').each(function(){
      $(this).css('display','block');
    });
  },
  renderCarsds: function(){  //randomly render the cards on board
    var cardsArray =  $('.cardGame .row').children();
    var currectColor = '';
    var currentNum = 0;
    var i = 1;
    $(cardsArray).each(function(){
      for(var j = 0;j<1;j++){
        i=Math.floor((Math.random() * 16)+1);
        if(gGameCards['card'+ i].onBoard === false){
          currectColor=gGameCards['card'+ i].color;
          currentNum = gGameCards['card'+ i].number;
          gGameCards['card'+ i].onBoard= true;
          $(this).css('background-color',currectColor);
          $(this).find('span').text(currentNum);
        }
        else{
          j--;
        }
      }
    });
  },
  createCards : function(){  // create the card object - set color and value props
    var cards =['1','1','2','2','3','3','4','4','5','5','6','6','7','7','8','8'];
    var colors=['hsl(25,85%,65%)','hsl(55,85%,65%)','hsl(90,85%,65%)','hsl(160,85%,65%)',
    'hsl(220,85%,65%)','hsl(265,85%,65%)','hsl(310,85%,65%)','hsl(360,85%,65%)',]
    var colorIndex = 0
    for(var i=1; i<=16;i++){
      gGameCards['card'+ i]= {};
      gGameCards['card'+ i].number= cards[i-1];
      gGameCards['card'+ i].color= colors[colorIndex];
      gGameCards['card'+ i].onBoard= false;
      if( ((i-1)%2) !== 0 ){
        colorIndex++;
      }
    }
  },
}
// Start the game when load the page
MatchGame.createCards();
saveInfo.onStart();

$(document).ready(function(){
  MatchGame.renderCarsds();

  $('.restart').click(function(){  // restart game when click on "restart" button
    MatchGame.restart();
  });

  $('.card').on('click',function(){  // start time recors only on first click and
    //execute game functions for selected card
    if(gIfStarted === false){
    saveInfo.timeRecord();
    gIfStarted = true;
    }
    obj = $(this);
    MatchGame.gameTurn(obj);
  });

});

// end :-) //
