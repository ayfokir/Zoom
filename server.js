const express = require( 'express' );
const { v4: uuidv4 } = require("uuid");
const app = express();  
//v4rn import aderglgne from uuid;  
const server = require( 'http' ).Server(app); // creat a server, server masnessat
const io = require('socket.io')(server)
const {ExpressPeerServer} =require('peer')
const peerServer = ExpressPeerServer( server );  
app.set( 'view engine', 'ejs' ); // room.ejs access endiayaderg
app.use( express.static( 'Public' ) ) //express static file public wuste new ena enesun tetekem, like style.css
app.use( '/peerjs', peerServer );  



// let roomId;
app.get( '/', ( req, res ) =>
{
    // res.send( "hello ayfo" );
    // res.render('room') // html, ejs ===> file lemelake use render method
    res.redirect( `/ ${ uuidv4() }` );


} );
app.get( '/:room', ( req, res ) => // requestuw slashe belo yehone parameter
//kalew
{
    res.render( 'room', { roomId: req.params.room } ) // home page (room.js) and
    //room id address bare lay tegegnaleche(found in the front-end)
})


io.on("connection", (socket) => {
    socket.on( 'join-room', (roomId, userId) => // on ==> madamete
    {
        console.log( "bini joined", roomId);
        socket.join( roomId ) // bini join aderege
        //bini join siarege lesewoche lemenager see below
        socket.to( roomId ).emit( "user-connected", userId);
        // socket.broadcast.to(roomId).emit("user-connected", userId);
        socket.on( 'message', ( message ) =>
        {
            io.to( roomId ).emit( 'createMessage', message )
        } );  
        socket.on( 'disconnect', () =>
        {
        socket.to( roomId ).emit( 'user-disconnect', userId )
        } );
    } );  
});  
server.listen( process.env.PORT || 3000, () => {
console.log("i am listen ayfo") 
} );
