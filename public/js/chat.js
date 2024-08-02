const socket = io();
const $submitButton=document.querySelector('#submit');
const $locaiontButton = document.querySelector('#location');
const $messages = document.querySelector('#message');


// * templates
const messageTemplate = document.querySelector('#message-template').innerHTML; 
const locationTemplate = document.querySelector('#location-template').innerHTML;

socket.on('locationMessage', (url)=>{
    console.log(url);
    const html = Mustache.render(locationTemplate, {url:url.url,  time:new Date(url.createdAt).toString()});
    $messages.insertAdjacentHTML('beforeend',html);
});

socket.on('message',(message)=>{
    console.log(message);   
    const html = Mustache.render(messageTemplate, {message:message.text, time:new Date(message.createdAt).toString()});
    $messages.insertAdjacentHTML('beforeend',html);
});


$submitButton.addEventListener('click', (e)=>{
    e.preventDefault();
    document.querySelector('#submit').setAttribute('disabled','disabled');
    const message1 = document.querySelector('input').value;
    const message2 = document.querySelector('#message1').value;

    socket.emit('message', `name: ${message1}\nmessage: ${message2}`, (error)=>{
        document.querySelector('#submit').removeAttribute('disabled');
        if(error){
            return console.log(error);
        }
        console.log('Message Delivered!');
    });
});

$locaiontButton.addEventListener('click', async(e)=>{
    e.preventDefault();
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser!');
    };
     navigator.geolocation.getCurrentPosition((position)=>{
         const obj = position
         socket.emit('location', position.coords.latitude, position.coords.longitude);
    });
});

// * getting query string
const {username,room} = Qs.parse(location.search, {ignoreQueryPrefix:true});
// socket.emit('join', {username, room});

// * join
socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error);
        location.href='/api/join';
    }
});