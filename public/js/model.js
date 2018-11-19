
function Challenge(challengeName, youtubeID, song, artist, genre, hint, attempted, rightlyAnswered, isPublic, options, date, creator, id){
   return {
    challengeName: challengeName,
    youtubeID: youtubeID,
    song: song,
    artist: artist,
    genre: genre,
    hint: hint,
    attempted: attempted,
    rightlyAnswered: rightlyAnswered,
    isPublic: isPublic,
    options: options,
    creator: creator,
    date: date,
    id: id,
    div: null,
   }

}
function ChallengeToParce(challenge){
    return {
        challengeName: challenge.challengeName.toString(),
        youtubeID: challenge.youtubeID.toString(),
        song: challenge.song.toString(),
        artist: challenge.artist.toString(),
        genre: challenge.genre.toString(),
        hint: challenge.hint.toString(),
        attempted: challenge.attempted.toString(),
        rightlyAnswered: challenge.rightlyAnswered.toString(),
        isPublic: challenge.isPublic.toString(),
        option1: challenge.options[0].toString(),
        option2: challenge.options[1].toString(),
        option3: challenge.options[2].toString(),
        creator: challenge.creator.toString(),
        id: challenge.id.toString(),
    }

}
function User(name, username, email, score, challengesPlayed){
   return {name: name,
    username: username,
    email: email,
    score: score,
    challengesPlayed: challengesPlayed}
}

function Contact(name){
  return{name: name,
  div: null}
}

function Group(name, id, owner){
  return{
    name: name,
    id:   id,
    owner: owner,
    div: null
  }
}
