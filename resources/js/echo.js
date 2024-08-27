import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

const options = {
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster:import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: false
}
window.Pusher = new Pusher(options.key, options);

window.Echo = new Echo({
    ...options,
    client: new Pusher(options.key, options)

});
