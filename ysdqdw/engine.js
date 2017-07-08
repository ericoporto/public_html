
MOBILE=window.mobilecheck();
GAMED_ENDED = false;
CERTAS = 0;
w = 252;
h = 248;
carretx = 16;
carrety = 194;
curr_level = 0;
keto.setup(true);
tframe = 0;

function goToNextLevel(){
    curr_level++;
    drawLevel();
    time_new_word = 240;
    i_time_count=0;
    j_time_count=0;
}

function getColor(colorname){
  return level[curr_level].colors[colorname];
}

var first_action = 0;

function update_certas(){
    hud_ctx.clearRect(w-48,2,46,16)
    png_font.drawText(CERTAS.toString(),[w-48,0])
}

function setpixelated(canvas){
  var ctx = canvas.getContext('2d');
  ctx['imageSmoothingEnabled'] = false;       /* standard */
  ctx['mozImageSmoothingEnabled'] = false;    /* Firefox */
  ctx['oImageSmoothingEnabled'] = false;      /* Opera */
  ctx['webkitImageSmoothingEnabled'] = false; /* Safari */
  ctx['msImageSmoothingEnabled'] = false;     /* IE */
  canvas.style.imageRendering = 'optimizeSpeed';
  canvas.style.imageRendering = '-moz-crisp-edges';
  canvas.style.imageRendering = '-o-crisp-edges';
  canvas.style.imageRendering = '-webkit-optimize-contrast';
  canvas.style.imageRendering = 'optimize-contrast';
  canvas.style.imageRendering = 'crisp-edges';
  canvas.style.imageRendering = 'pixelated';
}


function reset(){
    GAMED_ENDED = false;
    bg_ctx.clearRect(0,0,w,h);
    ctx.clearRect(0,0,w,h);
    ptx.clearRect(0,0,w,h);
    hud_ctx.clearRect(0,0,w,h);
    curr_level = 0;
    CERTAS = 0;
    update_certas()
    drawLevel()
}




function game_start(){

    loadImgs();

    bg_c = document.getElementById('bg_canvas')
    bg_ctx = bg_c.getContext("2d")
    setpixelated(bg_c)

    c = document.getElementById('level_canvas')
    ctx = c.getContext("2d")
    setpixelated(c);

    pc = document.getElementById('player_canvas')
    ptx = pc.getContext("2d")
    setpixelated(pc);

    px_id = ctx.createImageData(1,1); // only do this once per page
    px_d  = px_id.data;    // only do this once per page
    increr = 0;


    resize();
    setTimeout(resize,5000);

    function fireResizeEvent() {
     window.dispatchEvent(new Event('orientationchange'));
    }

    setTimeout(fireResizeEvent,6500);

    reset();
    draw();
    setTimeForNewWord();
}

function boot_game(){
    hud_c = document.getElementById('hud_canvas')
    hud_ctx = hud_c.getContext("2d")
    setpixelated(hud_c);

    png_font.setup( hud_ctx ,"img/unifont.png", function(){
      audio_start()
      game_start()
    })

}

function drawLevel(){
    bg_ctx.fillStyle=getColor('level_bg');
    bg_ctx.fillRect(0,0,w,h);
    bg_ctx.drawImage(document.getElementById(level[curr_level].bgimg),0,0,256,248);
    bg_ctx.globalAlpha = 0.6;
    bg_ctx.fillStyle=getColor('pic_bg');
    var levelname_length = level[curr_level].levelname.length*8;
    var x_title = Math.floor((w-levelname_length)/2);
    bg_ctx.fillRect(x_title-2,0,levelname_length+4,24);
    bg_ctx.globalAlpha = 1.0;
}

word_queue = [];
time_new_word = 0;
i_time_count=0;
j_time_count=0;
function setTimeForNewWord(){
  if(j_time_count>level[curr_level].word_time_count[i_time_count][1]){
      j_time_count=0;
      i_time_count++;
  }
  if(i_time_count < level[curr_level].word_time_count.length){
      time_new_word=level[curr_level].word_time_count[i_time_count][0];
      j_time_count++;
  } else {
    time_new_word = 0;
    goToNextLevel();
  }
}

function pushNewWord(){
  setTimeForNewWord();
  var aword = level[curr_level].wordlist[Math.floor(Math.random()*level[curr_level].wordlist.length)];
  var posx = Math.floor(Math.random()*w-60)
  if( posx <8) posx = 8;
  var posy = Math.floor(Math.random()*100+128)
  var position =  [posx,posy];
  word_queue.push({word: aword, pos: position, wlength: aword.length, carret:0});
}

function drawText(){
  hud_ctx.clearRect(0,0,w,h)
  var levelname_length = level[curr_level].levelname.length*8;
  var x_title = Math.floor((w-levelname_length)/2);
  png_font.drawText(level[curr_level].levelname, [x_title,1],getColor('word'),1);
  for(var i=0; i<word_queue.length; i++){
      hud_ctx.globalAlpha = 0.6;
      hud_ctx.fillStyle=getColor('pic_bg');
      hud_ctx.fillRect(word_queue[i].pos[0]-2,word_queue[i].pos[1]-2,word_queue[i].wlength*8+4,24);
      hud_ctx.globalAlpha = 1.0;
  
      png_font.drawText(word_queue[i].word,word_queue[i].pos,getColor('word'),1);
      png_font.drawText(word_queue[i].word.charAt(word_queue[i].carret),
                       [word_queue[i].pos[0]+word_queue[i].carret*8,word_queue[i].pos[1]],
                       getColor('sel_letter'),1,getColor('sel_letter'));
  }
}

function draw(){
    tframe++;
    if(time_new_word>0){
        if(tframe%time_new_word==0){
            pushNewWord();
        }
    }
    drawText();
    window.requestAnimationFrame(draw);
}

function nextLevel(){
    audio_nextlevel()
    curr_level++;
    drawLevel();
}

function Create2DArray(rows) {
    var arr = [];

    for (var i=0;i<rows;i++) {
        arr[i] = [];
    }

    return arr;
}



function ketoKeyDown(e){
    for(var i=0; i<word_queue.length; i++){
        if(e.detail.toLowerCase()==word_queue[i].word.charAt(word_queue[i].carret).toLowerCase()){
            word_queue[i].carret+=1;
            if(word_queue[i].carret>=word_queue[i].wlength){
               word_queue.splice(i, 1);
               break;
            }
        }
    }


}

function resize(){
    keto.resize();
    function correctCanvas(canvas){
        if(window.innerHeight>window.innerWidth){
          available_h = keto.getRemainingHeight();
        
          //portrait
          canvas.style.height = Math.floor(available_h) + 'px';
          canvas.style.width = Math.floor(window.innerWidth) + 'px';
          canvas.style.position = 'absolute';
          canvas.style.top= 0;
          canvas.style.bottom= parseInt(window.innerHeight, 10)-parseInt(canvas.style.height, 10);
          canvas.style.left= 0;
          canvas.style.right= 0;
          canvas.style.margin= '0 auto';
        } else {
          //landscape
          if(MOBILE){
          
            available_w = keto.getRemainingWidth();
            canvas.style.height = Math.floor(window.innerHeight) + 'px';
            canvas.style.width = Math.floor(available_w) + 'px';
          } else {
            available_w = keto.getRemainingWidth();
            canvas.style.height = Math.floor(window.innerHeight) + 'px';
            canvas.style.width = Math.floor(available_w) + 'px';
          }
          canvas.style.position = 'absolute';
          canvas.style.top= 0;
          canvas.style.bottom= 0;
          canvas.style.left= 0;
          canvas.style.right= 0;
          canvas.style.margin= 'auto';
        }

        setpixelated(canvas)
    }

    correctCanvas(bg_c);
    correctCanvas(c);
    correctCanvas(pc);
    correctCanvas(hud_c);
}


anim_frame = 0;

window.addEventListener('keto_KeyPressed', ketoKeyDown,false);

window.addEventListener('resize', resize, false);
window.addEventListener('orientationchange', function(){resize(); setTimeout(resize,1000);}, false);
