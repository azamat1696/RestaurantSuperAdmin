import Echo from 'laravel-echo';
import Pusher from "pusher-js";
  // const Pusher = require('pusher-js');
window.Pusher = Pusher

// window.Pusher
 window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'local',
    cluster: 'mt1',
    wsHost: '127.0.0.1',
    wsPort: 6001,
    forceTLS: true,
    disableStats: true
});

