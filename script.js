'use strict';

///////////// variable
// clock part
const clockTitle = document.querySelector('.clock__title');
const taskState = document.querySelector('.state');
const timeContainer = document.querySelector('.clock-container');

// btn
const clockStartBtn = document.querySelector('.btn-start');
const clockDoneBtn = document.querySelector('.btn-finish');
const stateIcon = clockStartBtn.children[0];

// todo part
const newTaskInput = document.querySelector(".new-list__input");
const addTaskBtn = document.querySelector('.btn-plus');
  // Uncompleted
const uncompUl = document.querySelector('.uncompleted'); // ul
const todoStartBtn = document.querySelectorAll(".btn-todoStart");

  // completed
const compUl = document.querySelector('.completed');
const timeSpent = document.querySelector('.time-spent');
const dateElemant = document.querySelector('.date')

let startms, isPlay, totalms, count;
let uncompletedList = [{ id: 1,content: 'learning', spentTime:0 }];
let currentTask = uncompletedList[0]; // Object
///////////// Functions
// 初始值
const initial = function(){
  if(!stateIcon.classList.contains('fa-play')) stateIcon.classList.toggle("fa-play") &&
    stateIcon.classList.toggle("fa-pause");
  startms = 1500000;
  isPlay = false;
  totalms = 0;
  count = 1;
};

// Audio
const ring = new Audio('./ring (rest).mp3');

// turn to pause icon
const changeState = function(){
  stateIcon.classList.toggle("fa-play");
  stateIcon.classList.toggle("fa-pause"); 
  if (stateIcon.classList.contains("fa-pause")) {
    isPlay = true;
  }
  if (stateIcon.classList.contains("fa-play")) {
    isPlay = false;
  }
}

// 將ms轉換為 時:分:秒 格式並渲染到畫面上
const renderTime = function (startms, element) {
  const min = startms / 1000 / 60;
  const sec = min * 60 % 60;
  const hr = min / 60;
  const turnStr = function(time){
    return Math.floor(time).toString().padStart(2, "0");
  }
  element.innerHTML = `${
    turnStr(hr) === "00" ? "" : turnStr(hr) + " :"
  } ${turnStr(min)} : ${turnStr(sec)}`;
}

// 倒數計時器
const countdown = function () {
  const timer = setInterval(() => {
    if (startms > 0 && isPlay) {
      startms -= 1000;
      totalms += 1000;
      renderTime(startms, timeContainer);
      // console.log({ startms, totalms });
    } else if (startms === 0) {
      clearInterval(timer);
      ring.play();
      totalms = 0;
      count++;
      if (count % 2 === 1) {
        startms = 1500000; // start a new 25mins
        // changeState();
        taskState.textContent = "";
        renderTime(startms, timeContainer);
      } else if (count % 8 === 0) {
        startms = 1800000; // take a long break 30 mins
        // changeState();
        taskState.textContent = "休息是為了走更長遠的路";
        renderTime(startms, timeContainer);
      } else {
        startms = 300000; // rest 5 mins
        // changeState();
        taskState.textContent = "休息一下吧";
        renderTime(startms, timeContainer);
      }
      countdown();
      console.log({ count, startms });
    } else {
      clearInterval(timer);
    }
  }, 1000);
};

const startCountDown = () => {
  changeState();
  isPlay && countdown();
};

const calcSpentTime = (task) => {
  task.spentTime = count === 1 ? totalms + task.spentTime : Math.round(count / 2) * 25 * 60 * 1000 + totalms + task.spentTime;
};

const renderList = ([task]) => {
  const list = `
      <li class="list" id='${task.id}'>
        <button class="btn-start-small btn-todoStart"><i class="fa-solid fa-circle-plus"></i></button>
        <p class="list-content">${task.content}</p>
        <button class="btn-start-small btn-delect"><i class="fa-solid fa-trash-can" style="color: #e82c2c;"></i></button>
      </li>`;
  uncompUl.insertAdjacentHTML("afterbegin", list);
};

const renderCompleted = (currentTask)=>{
  calcSpentTime(currentTask);
  let date = new Date()
  let dateString = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDay()}`
  const list = `
        <li class="list" id='${currentTask.id}'>
          <div class="ok"><i class="fa-solid fa-circle-check" style="color: #37d752;"></i></div>
          <p class="list-content">${currentTask.content}</p>
          <div class="time">
            <p class="time-spent"></p>
            <p class="date">${dateString}</p>
          </div>
        </li>`;
  compUl.insertAdjacentHTML("afterbegin", list);
  const timeSpentEl = compUl.querySelector(".time-spent")
  renderTime(currentTask.spentTime, timeSpentEl);
}

const removeList = (currentTask, removeEl)=>{
  console.log('remove:', removeEl);
  removeEl.remove();
  uncompletedList = uncompletedList.filter((task)=>task.id !== Number(currentTask.id));
}
/////////// script

initial();
clockTitle.textContent = currentTask.content;
renderTime(startms, timeContainer);
renderList([currentTask]);



// time(start);
clockStartBtn.addEventListener('click', startCountDown);


// time(done);
clockDoneBtn.addEventListener('click',()=>{
  let currentEl;
    uncompUl.querySelectorAll(".list").forEach(el=>{
      if(Number(el.id) === currentTask.id){
        console.log('currentEl:', el);
        currentEl = el;
      }
    })
    changeState();
    // 新增完成清單
    renderCompleted(currentTask);
    console.log('done:', currentTask);
  removeList(currentTask, currentEl);
  currentTask = uncompletedList[0];
  clockTitle.textContent = currentTask?.content;
  // 初始化
  initial();
  renderTime(startms, timeContainer);
  // console.log({ totalms, count });
})

////// todo-part

addTaskBtn.addEventListener('click',()=>{
  const errorMsg = document.querySelector(".error");
    if(newTaskInput.value !== ''){
    const id = Math.random();
    const content = newTaskInput.value;
    let spentTime = 0;
    uncompletedList.push({id, content, spentTime});
    console.log('new task:', uncompletedList);
    // 渲染 uncompleteList 到畫面
    renderList(uncompletedList.slice(-1));
    // 確保在原先沒有任務的情況下新增任務能直接載入第一筆資料到倒數區
    currentTask = uncompletedList[0];
    clockTitle.textContent = currentTask.content;
    newTaskInput.value = '';
    if(!errorMsg.classList.contains('hide'))errorMsg.classList.add('hide');
    }else {
      errorMsg.classList.remove('hide');
    }
})

uncompUl.addEventListener('click',(el)=>{
  const startbtn = el.target.closest(".btn-todoStart");
  const delectbtn = el.target.closest('.btn-delect');
  const list = el.target.closest(".list"); // element li
  const task = list.querySelector(".list-content"); // element p
  // list start按鈕事件
  if (startbtn) {
    // 如果有正在進行中的任務，儲存進行中的任務進度時間
    uncompletedList.map(task => {
      if(task.id === currentTask?.id){
        calcSpentTime(task);
        console.log('startbtn:', task);
      }
    })
    console.log(list);
    // 更換指定的新任務
    initial();
    renderTime(startms, timeContainer);
    clockTitle.textContent = task.textContent;
    // startCountDown();
    [currentTask] = uncompletedList.filter(task => task.id === Number(list.id));
    console.log('startbtn:', uncompletedList, currentTask);
  }
  if(delectbtn){
    // if要刪除的元素 = currentTask && = uncompletedList[0] 則 
    //  currentTask = uncompletedList[1] 否則
    //  currentTask = uncompletedList[0]
    if (Number(list.id) === currentTask.id && Number(list.id) === uncompletedList[0].id){
      currentTask = uncompletedList[1]
    }else{
      currentTask = uncompletedList[0];
    }
    clockTitle.textContent = currentTask?.content;
    removeList(list, list);
  }
})

