const configuration = {
    iceServers: [
        {
          urls: "stun:stun.relay.metered.ca:80",
        },
        {
          urls: "turn:global.relay.metered.ca:80",
          username: "64fe6c59d0b7bff54aaf6ad8",
          credential: "3UDX0iwttGksa41d",
        },
        {
          urls: "turn:global.relay.metered.ca:80?transport=tcp",
          username: "64fe6c59d0b7bff54aaf6ad8",
          credential: "3UDX0iwttGksa41d",
        },
        {
          urls: "turn:global.relay.metered.ca:443",
          username: "64fe6c59d0b7bff54aaf6ad8",
          credential: "3UDX0iwttGksa41d",
        },
        {
          urls: "turns:global.relay.metered.ca:443?transport=tcp",
          username: "64fe6c59d0b7bff54aaf6ad8",
          credential: "3UDX0iwttGksa41d",
        },
    ],
  }

export default configuration;
