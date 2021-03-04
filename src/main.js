import { Note, Scale, Chord } from "@tonaljs/tonal"; //Library responsible for music theory data

/*
reference: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance#ecmascript_2015_classes
*/

//Create oscillator objects based on each note of a chord
class Oscillator {
  constructor(oscNode, oscNumber, noteName, oscState, gainNode) {
    this.oscNode = oscNode; //holds web audio oscillator object
    this.oscNumber = oscNumber; //unique ID based on chord array
    this.noteName = noteName; //stores the name of the note
    this.oscState = oscState; //is it on or off
    this.gainNode = gainNode; // holds the web audio gain object
  }
}

// create web audio api context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

//Test section that gets a chord from the library. This chord generates the notes below. Eventually this will be an interactive chord pad in the browser.
let userRoot = "Eb4"; //gets user input for root
let userChord = "maj13"; //gets user input for chord type
let currentChord = Chord.getChord(userChord, userRoot);
let currentNotes = currentChord.notes;
console.log(currentNotes);
let chordLength = currentChord.notes.length; //gets the number of notes in the current chord

//populate oscArray with new Oscillators
function createOsc(chordLength) {
  let oscArray = [];
  for (let i = 0; i < chordLength; i++) {
    oscArray[i] = new Oscillator();
  }
  return oscArray;
}

//create the array of osc objects and run it through the function
var oscArray = createOsc(chordLength);

//populate each Osc object with the correct info
function oscSetup(oscArray) {
  for (let index = 0; index < oscArray.length; index++) {
    oscArray[index].oscNode = audioCtx.createOscillator();
    oscArray[index].oscNumber = index;
    oscArray[index].noteName = currentNotes[index];
    oscArray[index].oscNode.frequency.setValueAtTime(
      Note.freq(oscArray[index].noteName),
      audioCtx.currentTime
    );
    oscArray[index].oscState = true;
    oscArray[index].gainNode = audioCtx.createGain();
    oscArray[index].gainNode.gain.value = 1;
    oscArray[index].oscNode.type = "sine";
    oscArray[index].oscNode.connect(oscArray[index].gainNode);
    oscArray[index].gainNode.connect(audioCtx.destination);
  }
}

//setup all of the Osc objects based on current chord state
oscSetup(oscArray);

function startOsc(oscArray) {}

var playChord = document
  .getElementById("playChord")
  .addEventListener(onclick, oscSetup(oscArray));
//Stops the oscillators and disconnects them from the audio context
function stopOsc(oscName, oscOn) {
  //Takes each oscillator variable as argument
  if (oscOn) {
    oscName.stop(0); // Stop oscillator after 0 seconds
    oscName.disconnect(); // Disconnect oscillator so it can be picked up by browser’s garbage collector
    oscOn = false;
  }
}
/*
oscArray[index].oscNode.start();
    oscArray[index].oscNode.stop(audioCtx.currentTime + 5); // stop 5 seconds after the current time
    */
