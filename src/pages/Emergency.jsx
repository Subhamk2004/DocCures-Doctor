import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';
import AlertDisplay from '../components/AlertDisplay';
import room from '../assets/images/room.jpg';
import { AlertTriangle, Clock, DollarSign, Send, ShieldAlert, Star, TimerReset, User } from 'lucide-react';

const serverUrl = import.meta.env.VITE_DOCCURES_SERVER_URL;

const socket = io(serverUrl, { withCredentials: true });

function Emergency() {
  let { authData } = useAuth();
  if(authData) {
    console.log(authData.doctor.availableForEmergency);
  }
  let doctorId = authData?.doctor?._id;
  let { phone } = useSelector(state => state.doctor);
  const [isAvailable, setIsAvailable] = useState(false);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [activeEmergency, setActiveEmergency] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  let [alertMessage, setAlert] = useState('');
  let [alertType, setAlertType] = useState('');
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  useEffect(() => {
    if (authData) {
      setIsAvailable(authData.doctor.availableForEmergency);
    }
  }, [authData]);

  useEffect(() => {
    if (doctorId) {
      socket.emit('joinDoctorRoom', doctorId);

      socket.on('newEmergencyRequest', (request) => {
        console.log('New emergency request received:', request);
        setEmergencyRequests(prev => [...prev, request]);
        setAlert('New emergency request received');
        showNotification('New Emergency Request', 'You have received a new emergency request.');
        setAlertType('info');
        setTimeout(() => {
          setAlert('');
        }, 7000);
      });

      socket.on('emergencyMessage', (message) => {
        console.log('Received emergency message:', message);
        setMessages(prev => [...prev, message]);
        if (message.sender !== 'doctor') {
          showNotification('DoCures Emergency Message', message.message);
        }
      });
    }

    return () => {
      if (doctorId) {
        socket.off('newEmergencyRequest');
        socket.off('emergencyMessage');
        socket.emit('leaveDoctorRoom', doctorId);
      }
    };
  }, [doctorId]);


  useEffect(() => {
    if (notificationPermission !== 'granted') {
      requestNotificationPermission();
    }
  }, []);

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const showNotification = (title, body) => {
    if (notificationPermission === 'granted') {
      new Notification(title, { body });
    }
  };


  const toggleAvailability = async () => {
    try {
      const response = await fetch(`${serverUrl}/doctor/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          availableForEmergency: !isAvailable,
          phone: phone
        }),
        credentials: 'include',
      });

      if (response.ok) {
        setIsAvailable(!isAvailable);
        socket.emit('updateEmergencyAvailability', { doctorId, isAvailable: !isAvailable });
        setAlert(isAvailable ? 'You are now unavailable for emergency requests' : 'You are now available for emergency requests');
        setAlertType('success');
        setTimeout(() => {
          setAlert('');
        }, 7000);
      } else {
        console.error('Failed to update availability');
        setAlert('Failed to update availability');
        setAlertType('error');
        setTimeout(() => {
          setAlert('');
        }, 7000);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      setAlert('Error updating availability');
      setAlertType('error');
      setTimeout(() => {
        setAlert('');
      }, 7000);
    }
  };

  const respondToRequest = async (requestId, accepted) => {
    try {
      const response = await fetch(`${serverUrl}/emergency/respond/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accepted }),
        credentials: 'include',
      });

      if (response.ok) {
        const updatedRequest = await response.json();
        if (accepted) {
          setActiveEmergency(updatedRequest);
          socket.emit('joinEmergencyRoom', `emergency_${requestId}`);
          console.log(`Joined emergency room: emergency_${requestId}`);
          socket.emit('emergencyRequestResponse', {
            status: 'accepted',
            user: updatedRequest.user,
            room: `emergency_${requestId}`
          });
          setAlert('Emergency request accepted');
          setAlertType('success');
        } else {
          setAlert('Emergency request declined');
          setAlertType('info');
        }
        setEmergencyRequests(prev => prev.filter(req => req._id !== requestId));
        setTimeout(() => {
          setAlert('');
        }, 7000);
      } else {
        console.error('Failed to respond to request');
        setAlert('Failed to respond to request');
        setAlertType('error');
        setTimeout(() => {
          setAlert('');
        }, 7000);
      }
    } catch (error) {
      console.error('Error responding to request:', error);
      setAlert('Error responding to request');
      setAlertType('error');
      setTimeout(() => {
        setAlert('');
      }, 7000);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && activeEmergency) {
      const messageData = {
        room: `emergency_${activeEmergency._id}`,
        message: newMessage,
        sender: 'doctor'
      };
      socket.emit('emergencyMessage', messageData);
      console.log('Sent emergency message:', messageData);
      setNewMessage('');
    }
  };

  return (
    <div className='w-full md:w-[65%] lg:w-[80%] md:bg-primary md:p-4'>
      <div className='w-full h-full bg-softGray rounded-3xl flex flex-col items-center overflow-scroll no-scrollbar'>
        {alertMessage && <AlertDisplay alertMessage={alertMessage} alertType={alertType} />}

        {
          <AlertDisplay alertMessage="Please don't press back or refresh the page while conversation is going on! Chances of permanent connection loss" alertType='warning' />
        }


        {activeEmergency ? (
          <div className='lg:w-[80%] w-full h-[85%] p-4 flex flex-row items-center justify-center'>
            <div className='mt-16 w-full h-full bg-white rounded-3xl flex flex-row relative overflow-hidden shadow-md shadow-darkGray justify-around'>
              <img src={room} className='absolute w-full h-full object-cover rounded-3xl opacity-55' />
              <div className='z-10 w-full h-full bg-transparent p-4 rounded-3xl flex flex-col items-center overflow-scroll no-scrollbar'>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Active Emergency</h2>
                <div className="bg-white w-full h-[60vh] p-4 md:h-[80%] rounded-2xl shadow-md overflow-scroll no-scrollbar max-w-[750px] ">
                  <div className="mb-4 w-full h-[80%] md:h-[100%] overflow-y-auto no-scrollbar space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-lg ${msg.sender === 'doctor'
                          ? 'bg-blue-100 text-blue-800 ml-auto rounded-br-none'
                          : 'bg-green-100 text-green-700 rounded-bl-none'
                          } max-w-[80%] break-words`}
                      >
                        <p className="text-sm font-semibold mb-1">
                          {msg.sender === 'doctor' ? 'You' : 'Patient'}:
                        </p>
                        <p>{msg.message}</p>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={sendMessage} className=" md:h-auto flex items-center">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-grow p-2 w-[20px] md:w-auto border rounded-l-lg focus:outline-none hover:border-primary"
                      placeholder="Type your message..."
                    />
                    <button
                      type="submit"
                      className="bg-primary w-[100px] text-white px-4 py-2 rounded-r-lg hover:bg-primary/90 transition-colors duration-200 flex items-center"
                    >
                      <Send size={18} className="mr-2" />
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )
          :
          <div className='lg:w-[80%] w-full h-[85%] p-4 flex flex-row items-center justify-center'>
            <div className='mt-16 w-full h-full bg-white rounded-3xl flex flex-row relative overflow-hidden shadow-md shadow-darkGray justify-around'>
              <img src={room} className='absolute w-full h-full object-cover rounded-3xl opacity-55' />

              <div className='z-10 w-full h-full bg-transparent p-4 rounded-3xl flex flex-col items-center overflow-scroll no-scrollbar'>
                <div className='bg-[#f6faff] rounded-3xl w-full h-full flex flex-col items-center justify-between p-4 sm:p-6 shadow-lg shadow-[gray] overflow-y-auto no-scrollbar'>
                  <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mt-3 sm:mt-5 text-center'>
                    Emergency <span className='text-primary'>Assistance</span> for Doctors
                  </h1>

                  <div className='w-full max-w-2xl mt-6 sm:mt-8 space-y-4 sm:space-y-6'>
                    <div className='bg-white rounded-xl p-3 sm:p-4 shadow-md flex items-start space-x-3 sm:space-x-4'>
                      <Clock className='text-primary flex-shrink-0 mt-[6px]' size={20} />
                      <p className='text-base lg:text-lg xl:text-xl xl:font-semibold text-gray-700'>
                        You can make yourself available for emergency requests 24/7. Toggle your availability below.
                      </p>
                    </div>

                    <div className='bg-white rounded-xl p-3 sm:p-4 shadow-md flex items-start space-x-3 sm:space-x-4'>
                      <ShieldAlert className='text-primary flex-shrink-0 mt-[6px]' size={20} />
                      <p className='text-base lg:text-lg xl:text-xl xl:font-semibold text-gray-700'>
                        When available, you'll receive emergency requests from patients in need of immediate assistance.
                      </p>
                    </div>
                  </div>

                  <button
                    className={`w-full sm:w-auto p-3 px-5 sm:px-7 text-lg sm:text-xl font-semibold mt-6 sm:mt-10 rounded-2xl text-white ${isAvailable ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
                      } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isAvailable ? 'focus:ring-red-500' : 'focus:ring-primary'
                      }`}
                    onClick={toggleAvailability}
                  >
                    {isAvailable ? 'Unregister for Emergencies' : 'Register for Emergencies'}
                  </button>

                  {isAvailable && emergencyRequests.length > 0 && (
                    <div className="mt-6 w-full xl:w-[80%]">
                      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Emergency Requests</h2>
                      {emergencyRequests.map((request) => (
                        <div key={request._id} className="bg-white p-4 rounded-lg mb-4 flex flex-col justify-between items-center shadow-md gap-3">
                          <span className="text-lg text-gray-700 text-center">Emergency request from User {request.user}</span>
                          <div className='flex w-full lg:gap-5'>
                            <button
                              className="bg-primary text-white w-1/2 px-4 py-2 rounded-xl mr-2 hover:bg-green-600 transition-colors duration-200"
                              onClick={() => respondToRequest(request._id, true)}
                            >
                              Accept
                            </button>
                            <button
                              className="bg-gray-500 w-1/2 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors duration-200"
                              onClick={() => respondToRequest(request._id, false)}
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        }


        {notificationPermission !== 'granted' && (
          <button
            className="bg-blue-500 z-10 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-600 transition-colors duration-200 mt-10"
            onClick={requestNotificationPermission}
          >
            Enable Notifications
          </button>
        )}
      </div>
    </div>
  );
}

export default Emergency;