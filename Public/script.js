const socket = io( '/' ); 
 
//userwn yanten video and audio endetekem fiked belo yemeteyke, and return promise

const myPeer = new Peer( undefined , { // undefined, pass yemenaregat id
    path: '/peerjs',
    host: '/',
    port: '3000',
} )

const peers = {}

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement('video')
myVideo.muted = true;
let myVideoStream;
   
// console.log("ezeh negne ")
navigator.mediaDevices.getUserMedia( {
    video: true,
    audio: true,
} ).then( (stream) => // stream (video and audio)
{
  myVideoStream = stream;
  addVideoStream(myVideo, stream);
  // call sindereg answer lemestet, connectToNewUser function wust
  //tedergenal
  myPeer.on("call", (call) => {
    call.answer(stream); // yenen stream eyesetehut new
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  });

    socket.on("user-connected", (userId) => {
    connectToNewUser(userId, stream);
    });
  // console.log(" i am inside media devices  ")
    
    let text = $("input");
  //when press enter send message
    $("html").keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      // enter = 13
      socket.emit("message", text.val()); // to send the message to the server
        text.val("");
    }
    } );
    
    socket.on("createMessage", (message) => {
        $("ul").append(
        `<li class = "message"> <b> user</b>  <br/> ${message}</li>`
        );
    }); 
})

myPeer.on( 'open', ( id ) =>
{
    socket.emit( "join-room", Room_ID, id);
    // console.log(id)
})

socket.on("user-disconnect", (userId) => {
    if ( peers[ userId ] ) // manen user endeteran identify madereg based on userId
        peers[ userId ].close();
});

function addVideoStream ( myVideo, stream )
{
    // console.log("ezeh negne man  ")
    myVideo.srcObject = stream;
    myVideo.addEventListener( 'loadedmetadata', () =>
    {
        myVideo.play(); // videowun  sitagegnew play adergew
    } );
    videoGrid.append(myVideo) // yegna html lay lemaskemet 
}


function connectToNewUser (userId, stream)
{
    //userId yehone sew room join siareg keserveru yetelakeche
    // console.log( `bini at the front connect ${userId}` );
    const call = myPeer.call( userId, stream );// enega yalewun neger lesewuyew share lemareg call adergalew
    const video = document.createElement( 'video' );
    call.on( 'stream', ( userVideoStream ) => // userVideoStream ke remote yememetaw stream
    {
        addVideoStream( video, userVideoStream ) // ke userw yetelakewun ene lay add madereg
        //yene degmo  userwuga add yderegal
    } );
    call.on( 'close', () =>
    {
        video.remove();
} )

    peers[userId] = call; // new user call sidereg  callwun ke keteterawgara magenagnet
    // action(call) and user id connect madereg
}




const playStop = () =>
{
    let enabled = myVideoStream.getVideoTracks()[ 0 ].enabled;
    console.log(myVideoStream.getVideoTracks());
    if ( enabled )
    {
        myVideoStream.getVideoTracks()[ 0 ].enabled = false;
        setPlayVideo();
        
    }
    else
    {
        setStopVideo();
        myVideoStream.getVideoTracks()[ 0 ].enabled = true;
    }
};

const setStopVideo = () =>
{
    const html = `
    <i class= "fas fa-video"> </i>
    <span > Stop Video </span>
    `;
    document.querySelector( ".main__video__button" ).innerHTML = html;
    
}

const setPlayVideo = () =>
{
  const html = `
    <i class= " stop  fas fa-video-slash"> </i>
    <span > Play Video </span>
    `;
    document.querySelector( ".main__video__button" ).innerHTML = html;
}

const muteUnmute = () =>
{
    const enabled = myVideoStream.getAudioTracks()[ 0 ].enabled;
    if ( enabled )
    {
        myVideoStream.getAudioTracks()[ 0 ].enabled = false;
        setUnmuteButton();

    }
    else
    {
        setMuteButton();
        myVideoStream.getAudioTracks()[ 0 ].enabled = true;
    }
}


const setMuteButton = () =>
{
    const html = ` <i class="fa-solid fa-microphone"></i>
    <span> Mute </span>
    `;
    document.querySelector( ".main__mute__button" ).innerHTML = html;
}


const setUnmuteButton = () => {
  const html = ` <i class=" unmute fa-solid fa-microphone-slash"></i>
    <span> Mute </span>
    `;
  document.querySelector(".main__mute__button").innerHTML = html;
};









