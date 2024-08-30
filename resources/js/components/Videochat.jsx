import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import configuration from '../config';

function Videochat() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localPeerConnection, setLocalPeerConnection] = useState(null);
  const [remotePeerConnection, setRemotePeerConnection] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);
  const [showRemoteVideo, setShowRemoteVideo] = useState(false);

  useEffect(() => {
    // Setup WebRTC peer connections
    const localPC = new RTCPeerConnection(configuration);
    const remotePC = new RTCPeerConnection(configuration);

    localPC.onicecandidate = event => {
      if (event.candidate) {
        remotePC.addIceCandidate(event.candidate).catch(error => {
          console.error('Error adding ICE candidate to remotePC:', error);
        });
      }
    };

    remotePC.onicecandidate = event => {
      if (event.candidate) {
        localPC.addIceCandidate(event.candidate).catch(error => {
          console.error('Error adding ICE candidate to localPC:', error);
        });
      }
    };

    remotePC.ontrack = event => {
      console.log('Remote ontrack event triggered with stream:', event.streams[0]);

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        console.log('Remote video stream assigned');
      }
    };

    // Get user media (local video and audio)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          console.log('Local video stream assigned');
        }
        stream.getTracks().forEach(track => {
          console.log('Adding track to localPC:', track);
          localPC.addTrack(track, stream);
        });

        return localPC.createOffer();
      })
      .then(offer => {
        console.log('Created offer:', offer.sdp);
        return localPC.setLocalDescription(offer);
      })
      .then(() => remotePC.setRemoteDescription(localPC.localDescription))
      .then(() => remotePC.createAnswer())
      .then(answer => {
        console.log('Created answer:', answer.sdp);
        return remotePC.setLocalDescription(answer);
      })
      .then(() => localPC.setRemoteDescription(remotePC.localDescription))
      .catch(error => console.error('Error setting up loopback:', error));

    setLocalPeerConnection(localPC);
    setRemotePeerConnection(remotePC);

    return () => {
      if (localPC) {
        localPC.close();
      }
      if (remotePC) {
        remotePC.close();
      }
    };
  }, []);

  const endCall = () => {
    if (localPeerConnection) {
      localPeerConnection.close();
    }
    if (remotePeerConnection) {
      remotePeerConnection.close();
    }
    setLocalPeerConnection(null);
    setRemotePeerConnection(null);
    setCallInProgress(false);
  };

  return (
    <div className="chat-video-container">
      <div className="video-container">
        <video ref={localVideoRef} autoPlay muted></video>
        <video ref={remoteVideoRef} autoPlay></video>

        {!callInProgress && (
          <button onClick={() => {setCallInProgress(true);setShowRemoteVideo(true)}}>Start Call</button>
        )}
        {callInProgress && <button onClick={endCall}>End Call</button>}
      </div>
    </div>
  );
}

export default Videochat;
