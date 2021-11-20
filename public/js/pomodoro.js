const details = {
  longBreak: 15,
  shortBreak: 5,
  pomodoro: 25,
  longBreakCount: 4,
  timeLeft: 1500,
  minutes: 25,
  seconds: 0,
  mode: 'pomodoro'
}

let x;
let clockRunning;

const roleButtons = document.querySelectorAll('.button-role');
roleButtons.forEach(button=>{
    button.addEventListener('click',(e)=>{
      const role = e.target.dataset.role
      switchMode(role)
   });
})

function switchMode(role){
    details.mode = role;
    details.timeLeft = details[details.mode]*60
    details.minutes = details[details.mode]
    details.seconds = 0

    roleButtons.forEach(button=>{
        button.classList.remove('active')
    })

    $('.button-role[data-role=' + role + ']').addClass('active')
    if(role === 'shortBreak')
      $('.pomodoro-page').css('backgroundColor','#9AC4F8');
    if(role === 'pomodoro')
      $('.pomodoro-page').css('backgroundColor','#B9D9EB');
    if(role === 'longBreak')
      $('.pomodoro-page').css('backgroundColor','#E0AFA0');
    updateTimer();
 }


 $('.start').click((e)=>{
   let audio = new Audio('/audio/button.wav')
   audio.play();

     let text = $('.start').text()
     if(text == 'Start'){
       $('.start').text("Stop")
       startTimer();
     }
     if(text == 'Stop'){
       if(clockRunning == true) clockRunning = false;
       if(details.mode === 'pomodoro'){
         details.minutes = 25;
         details.seconds = 0
       }
       else if(details.mode === 'shortBreak'){
         details.minutes = 5;
         details.seconds = 0
       }
       else{
         details.minutes = 15;
         details.seconds = 0
       }
       updateTimer()
       $('.start').text("Start")
       clearInterval(x);
     }
 })

 function startTimer(){
   let time = details.timeLeft
   clockRunning = true;

   x = setInterval(()=>{
      time--;
      formatTimer(time);
      if(time <= 0){
        let audio = new Audio('/audio/break.mp3')
        audio.play();

        $('.start').text("Start")

        if(details.mode === 'pomodoro'){
          details.minutes = 25;
          details.seconds = 0
        }
        else if(details.mode === 'shortBreak'){
          details.minutes = 5;
          details.seconds = 0
        }
        else{
          details.minutes = 15;
          details.seconds = 0
        }
        clearInterval(x);
        updateTimer()
      }
   }, 1000);
 }

 function updateTimer(time){
    const minTemp = "" + details.minutes;
    const secTemp = "" + details.seconds;
    const minutes = minTemp.padStart(2,'0');
    const seconds = secTemp.padStart(2,'0');

    $('.minute').text(minutes)
    $('.seconds').text(seconds)
    let percent = ((details.timeLeft - time)/details.timeLeft)*100
    $('.progress-bar').attr('style','width: '+percent+'%')
    let textTitle = details.mode === 'pomodoro' ? 'Time to Focus' : 'Yay! Break Time'
    document.title = minutes+':'+seconds+' - '+textTitle;
 }

 function formatTimer(time){
    details.seconds = time%60;
    details.minutes = parseInt(time/60);

    updateTimer(time);
 }
