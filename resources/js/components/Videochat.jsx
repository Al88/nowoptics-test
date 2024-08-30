import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import configuration from '../config';

const signalingChannel = window.Echo.channel('webrtc-signaling');

function Videochat() {
  const [messages, setMessages] = useState([]);
  const [newMessageUser1, setNewMessageUser1] = useState('');
  const [newMessageUser2, setNewMessageUser2] = useState('');
  const messagesEndRefUser1 = useRef(null);
  const messagesEndRefUser2 = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);

  useEffect(() => {
    // Load chat messages
    loadMessages();

    // Setup signaling channel for WebRTC
    signalingChannel.listen('.signal', function(data) {
        handleSignalingData();
    });
    // Setup WebRTC peer connection
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = event => {
      if (event.candidate) {
        console.log('Sending ICE candidate:', event.candidate);
        sendSignalingData({ candidate: event.candidate });
      } else {
        console.log('End of candidates.');
      }
    };

    pc.ontrack = event => {
      console.log('ontrack event triggered with stream:', event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Get user media (local video and audio)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach(track => {
          console.log('Adding track:', track);
          pc.addTrack(track, stream);
        });
      })
      .catch(error => console.error('Error accessing media devices:', error));

    setPeerConnection(pc);

    return () => {
      window.Echo.leaveChannel('signal');

      if (pc) {
        pc.close();
      }
    };
  }, []);

  const loadMessages = async () => {
    try {
      const response = await axios.get('/get-messages');
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessageUser1 = async () => {
    const message = `${newMessageUser1}`;
    await axios.post('/send-message', { message, username: 'User 1' });
    setNewMessageUser1('');
    loadMessages();
  };

  const sendMessageUser2 = async () => {
    const message = `${newMessageUser2}`;
    await axios.post('/send-message', { message, username: 'User 2' });
    setNewMessageUser2('');
    loadMessages();
  };

  const scrollToBottom = () => {
    if (messagesEndRefUser1.current) {
      messagesEndRefUser1.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (messagesEndRefUser2.current) {
      messagesEndRefUser2.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSignalingData = async (data) => {
    const pc = peerConnection;
    try {
      if (data.offer) {
        console.log('Setting remote offer:', data.offer);
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        console.log('Created answer:', answer.sdp);
        await pc.setLocalDescription(answer);
        console.log('Sending answer:', answer);
        sendSignalingData({ answer: pc.localDescription });
      } else if (data.answer) {
        console.log('Setting remote answer:', data.answer);
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      } else if (data.candidate) {
        console.log('Adding ICE candidate:', data.candidate);
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    } catch (error) {
      console.error('Error handling signaling data:', error);
    }
  };

  const sendSignalingData = async (message) => {
    try {
      await axios.post('/signal', {
        channel: 'webrtc-signaling',
        event: 'signal',
        data: message
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error sending signaling data:', error);
    }
  };

  const initiateCall = async () => {
    try {
      const offer = await peerConnection.createOffer();
      console.log('Created offer:', offer.sdp);
      await peerConnection.setLocalDescription(offer);
      sendSignalingData({ offer });
      setCallInProgress(true);
    } catch (error) {
      console.error('Error initiating call:', error);
    }
  };

  const endCall = () => {
    if (peerConnection) {
      peerConnection.close();
    }
    setPeerConnection(null);
    setCallInProgress(false);
  };

  return (
    <div className="chat-container">

      <div className="video-container">
        <video ref={localVideoRef} autoPlay muted></video>
        <video ref={remoteVideoRef} autoPlay></video>

        {!callInProgress && <button onClick={initiateCall}>Start Call</button>}
        {callInProgress && <button onClick={endCall}>End Call</button>}
      </div>
    </div>
  );
}

export default Videochat;
