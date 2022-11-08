const dom = {
    selectbox: document.getElementById('selectbox'),
    rooms: document.getElementById('rooms'),
    selectboxList: document.querySelector('.selectbox__list')
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

console.log(dom)

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
        selectRoom(room)
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
       newSelectedRoom.classList.add('selected')
       renderScreen(false)
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
        } else {
            dom.rooms.style.display = 'none'
        }
    }, 300)
    
}

