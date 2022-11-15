const dom = {
    selectbox: document.getElementById('selectbox'),
    rooms: document.getElementById('rooms'),
    selectboxList: document.querySelector('.selectbox__list'),
    settings: document.getElementById('settings'),
    settingsTabs: document.getElementById('settings-tabs'),
    settingsPanel: document.getElementById('settings-panel'),
    temperatureLine: document.getElementById('temperature-line'),
    temperatureRound: document.getElementById('temperature-round'),
    temperature: document.getElementById('temperature'),
    temperatureBtn: document.getElementById('temperature-btn'),
    temperatureSaveBtn: document.getElementById('save-temperature'),
    temperaturePowerBtn: document.getElementById('power'),
    sliders: {
        lights: document.getElementById('lights-slider'),
        humidity:document.getElementById('humidity-slider')
    },
    switch: {
        lights: document.getElementById('lights-power'),
        humidity: document.getElementById('humidity-power')
    }
     
}

const rooms = {
    all: 'Все комнаты',
    livingroom: 'Зал',
    bedroom: 'Спальня',
    kitchen: 'Кухня',
    bathroom: 'Ванная',
    studio: 'Кабинет',
    washingroom: 'Уборная'
}


let activeRoom = 'all';
let activeTab = 'temperature'
const roomsData = {
    livingroom: {
        temperature: 19,
        temperatureOff: false,
        lightsOff: 0,
        lights: 12,
        humidityOff: 0,
        humidity: 25
        
    },
    bedroom: {
        temperature: 24,
        temperatureOff: false,
        lightsOff: 0,
        lights: 15,
        humidityOff: 0,
        humidity: 55
    },
    kitchen: {
        temperature: 21,
        temperatureOff: false,
        lightsOff: 0,
        lights: 22,
        humidityOff: 0,
        humidity: 15
    },
    bathroom: {
        temperature: 25,
        temperatureOff: false,
        lightsOff: 0,
        lights: 60,
        humidityOff: 0,
        humidity: 65
    },
    studio: {
        temperature: 21,
        temperatureOff: false,
        lightsOff: 0,
        lights: 43,
        humidityOff: 0,
        humidity: 22
    },
    washingroom: {
        temperature: 16,
        temperatureOff: false,
        lightsOff: 0,
        lights: 51,
        humidityOff: 0,
        humidity: 43
    },
}

//Выпадающий список

dom.selectbox.querySelector('.selectbox__selected').onclick = (event) => {
    dom.selectbox.classList.toggle('open')
}

document.body.onclick = (event) => {
    const { target } = event
    if (
        !target.matches('.selectbox')
        && !target.parentElement.matches('.selectbox')
        && !target.parentElement.parentElement.matches('.selectbox')
        ){
            dom.selectbox.classList.remove('open');
        }
}

dom.selectboxList.onclick = (event) => {
    const { target } = event
    if (target.matches('.selectbox__item')){
        const { room } = target.dataset
        const selectedItem = dom.selectboxList.querySelector('.selected')
        selectedItem.classList.remove('selected')
        target.classList.add('selected')
        dom.selectbox.classList.remove('open')
        selectRoom(room);
    }
}

//Выбор комнаты

function selectRoom (room) {
    const selectedRoom = dom.rooms.querySelector('.selected');
    
    if (selectedRoom) {
        selectedRoom.classList.remove('selected')
    }
    if (room != 'all') {
       const newSelectedRoom = dom.rooms.querySelector(`[data-room=${room}]`)
       const {
           temperature,
           lights,
           humidity,
           lightsOff,
           humidityOff
       } = roomsData[room];
       activeRoom = room;
       newSelectedRoom.classList.add('selected')
       renderScreen(false)
        dom.temperature.innerText = temperature;
        renderTemperature (temperature);
        setTemperaturePower ();
        changeSettingsType(activeTab);
        changeSlider(lights, dom.sliders.lights);
        changeSlider(humidity, dom.sliders.humidity);
        changeSwitch ('lights', lightsOff);
        changeSwitch ('humidity', humidityOff)
        
    }else{
        renderScreen(true)
    }
    const selectedSelectboxRoom = dom.selectbox.querySelector('.selectbox__item.selected')
    selectedSelectboxRoom.classList.remove('selected')
    const newSelectedItem = dom.selectbox.querySelector(`[data-room=${room}]`)
    newSelectedItem.classList.add('selected')
    const selectboxSelected = dom.selectbox.querySelector('.selectbox__selected span')
    selectboxSelected.innerText = rooms[room]
    
}

//Клик по элементу комнаты

dom.rooms.querySelectorAll('.room').forEach(room => {
    room.onclick = (event) => {
        const value = room.dataset.room
        selectRoom(value)
    }
})

//Отображение другого экрана

function renderScreen(isRooms) {
    setTimeout(() => {
        if (isRooms === 'rooms'){
            dom.rooms.style.display = 'grid'
            dom.settings.style.display = 'none'
        } else {
            dom.settings.style.display = 'block'
            dom.rooms.style.display = 'none'
        }
    }, 300)
    
}

//Панель настроек комнаты



//Отрисовка изменения температуры
function renderTemperature(temperature){
    const min = 16;
    const max = 40;
    const range = max - min;
    const percent = range/100;
    const lineMin = 54;
    const lineMax = 276;
    const lineRange = lineMax - lineMin;
    const linePercent = lineRange/100;
    const roundMin = -240;
    const roundMax = 48;
    const roundRange = roundMax - roundMin;
    const roundPercent = roundRange/100;

    
    if(temperature >= min && temperature <= max){
        
        const finishPercent = Math.round((temperature - min) / percent);
        const lineFinishPercent = lineMin + linePercent * finishPercent;
        const roundFinishPercent = roundMin + roundPercent * finishPercent;
        dom.temperatureLine.style.strokeDasharray = `${lineFinishPercent} 276`;
        dom.temperatureRound.style.transform = `rotate(${roundFinishPercent}deg`;
        dom.temperature.innerText = temperature;
    }

}



//Изменение температуры мышью

function changeTemperature(){
    let mouseover = false;
    let mousedown = false;
    let position = 0;
    let range = 0;
    let change = 0;
    
    dom.temperatureBtn.onmouseover = () => {
        mouseover = true;
        mousedown = false;
    };
    dom.temperatureBtn.onmouseout = () => mouseover = false;
    dom.temperatureBtn.onmouseup = () => mousedown = false;
    dom.temperatureBtn.onmousedown = (e) => {
        mousedown = true;
        position = e.offsetY;
        range = 0;    
    }
    //dom.temperatureBtn.onmouseup = () => mousedown = false;
    dom.temperatureBtn.onmousemove = (e) => {
        if(mouseover && mousedown){
           range = e.offsetY - position;
           const newChange = Math.round(range / -7);
           if (newChange != change){
             let temperature = +dom.temperature.innerText;  
            if (newChange < change){
                temperature = temperature - 1;
            } else {
                temperature = temperature + 1;
            }
           
           change = newChange;
           roomsData[activeRoom].temperature = temperature;
           renderTemperature (temperature)

        }
       
    }

}
}

changeTemperature ()

//Сохранение температуры
dom.temperatureSaveBtn.onclick = () => {
    const temperature = +dom.temperature.innerText;
    roomsData[activeRoom].temperature = temperature;
    alert('Сохранено')
}

//отключение температуры
dom.temperaturePowerBtn.onclick = () => {
    const power = dom.temperaturePowerBtn;
    power.classList.toggle('off')
    
    if (power.matches('.off')) {
        roomsData[activeRoom].temperatureOff = true; 
    } else {
        roomsData[activeRoom].temperatureOff = false; 
    }
}

//Установка значения кнопки включения тмпературы
function setTemperaturePower (){
    if (roomsData[activeRoom].temperatureOff){
        dom.temperaturePowerBtn.classList.add('off')
    } else {
        dom.temperaturePowerBtn.classList.remove('off')
    }
}

// Переключение настроек 

dom.settingsTabs.querySelectorAll('.tab').forEach((tab) => {
    
    tab.onclick = () => {
       
        const optionType = tab.dataset.type 
        activeTab = optionType
        changeSettingsType (optionType);
    } 
})

//Смена панели настроек

function changeSettingsType (type) {
    const tabSelected = dom.settingsTabs.querySelector('.tab.selected');
    const tab = dom.settingsTabs.querySelector(`[data-type=${type}]`);
    const panelSelected = dom.settingsPanel.querySelector('.selected');
    const panel = dom.settingsPanel.querySelector(`[data-type=${type}]`);
    tabSelected.classList.remove('selected');
    panelSelected.classList.remove('selected');
    tab.classList.add('selected');
    panel.classList.add('selected');
}

function changeSlider (percent, slider) {
    if (percent >= 0 && percent <= 100){
        const { type } = slider.parentElement.parentElement.dataset;
        slider.querySelector('span').innerText = percent;
        slider.style.height = `${percent}%`;
        roomsData[activeRoom][type] = percent;
    }
    
} 

//Анимация слайдера

function watchClider (slider) {
    let mouseover = false;
    let mousedown = false;
    let position = 0;
    let range = 0;
    let change = 0;
    const parent = slider.parentElement
    
    parent.onmouseover = () => {
        mouseover = true;
        mousedown = false;
    }
    parent.onmouseout = () => mouseover = false;
    parent.onmouseup = () => mousedown = false;
    parent.onmousedown = (e) => {
        mousedown = true;
        position = e.offsetY;
        range = 0;    
    }
    //dom.temperatureBtn.onmouseup = () => mousedown = false;
    parent.onmousemove = (e) => {
        if(mouseover && mousedown){
           range = e.offsetY - position;
           const newChange = Math.round(range / -0.001);
           if (newChange != change){
             let percent = +slider.querySelector('span').innerText;  
            if (newChange < change){
                percent = percent - 1;
            } else {
                percent = percent + 1;
            }
           
           change = newChange;
           roomsData[activeRoom].temperature = temperature;
           changeSlider (percent, slider)

        }
       
    }
}
}

watchClider (dom.sliders.lights);
watchClider (dom.sliders.humidity);

//Тумблер в интенсивности

function changeSwitch (activeTab, isOff) {
    if(isOff){
        dom.switch[activeTab].classList.add('off');
    } else{
        dom.switch[activeTab].classList.remove('off');
    }
    roomsData[activeRoom][`${activeTab}Off`] = isOff;
}

//Отслеживаем клик на свитч инетнсивности 

dom.switch.humidity.onclick = () => {
    const isOff = !dom.switch.humidity.matches('.off');
    changeSwitch (activeTab, isOff)
}

dom.switch.lights.onclick = () => {
    const isOff = !dom.switch.lights.matches('.off');
    changeSwitch (activeTab, isOff)
}
