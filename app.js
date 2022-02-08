require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const path = require('path');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + '/views'));
app.use(express.static(path.join(__dirname + '/public')));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  // Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req,res)=> {
    res.render('home-page')
})

app.get('/artist-search', (req,res,next)=> {
    const {artistname} = req.query;
    spotifyApi
  .searchArtists(artistname)
  .then(data => {
    let searchedArtist = data.body.artists.items;
    res.render('artist-search-results', { searchedArtist }); 
    // console.log(data.body.artists.items);
   
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
   
})

app.get('/albums/:id', (req, res, next) => {
  // .getArtistAlbums() code goes here
  const { id } = req.params;
  spotifyApi
  .getArtistAlbums(id)
  .then(data => {
  let searchAlbum = data.body.items;
   res.render('albums', { searchAlbum });
   console.log(searchAlbum[0].artists);
   
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:id', (req,res,next)=> {
  const { id } = req.params;
  spotifyApi
  .getAlbumTracks(id)
  .then(data => {
    let searchTracks = data.body.items;
    res.render('tracks', { searchTracks });
    console.log(searchTracks[0].artists);
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
