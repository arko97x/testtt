// Major chords
const cMajorChordFreqs = ["C4", "E4", "G4"]
const cSharpMajorChordFreqs = ["C#4", "F4", "G#4"]
const dMajorChordFreqs = ["D4", "F#4", "A4"]
const dSharpMajorChordFreqs = ["D#4", "G4", "A#4"]
const eMajorChordFreqs = ["E4", "G#4", "B4"]
const fMajorChordFreqs = ["F4", "A4", "C5"]
const fSharpMajorChordFreqs = ["F#4", "A#4", "C#5"]
const gMajorChordFreqs = ["G4", "B4", "D5"]
const gSharpMajorChordFreqs = ["G#4", "C5", "D#5"]
const aMajorChordFreqs = ["A4", "C#5", "E5"]
const aSharpMajorChordFreqs = ["A#4", "D5", "F5"]
const bMajorChordFreqs = ["B4", "D#5", "F#5"]

// Minor chords
const cMinorChordFreqs = ["C4", "D#4", "G4"]
const cSharpMinorChordFreqs = ["C#4", "E4", "G#4"]
const dMinorChordFreqs = ["D4", "F4", "A4"]
const dSharpMinorChordFreqs = ["D#4", "F#4", "A#4"]
const eMinorChordFreqs = ["E4", "G4", "B4"]
const fMinorChordFreqs = ["F4", "G#4", "C5"]
const fSharpMinorChordFreqs = ["F#4", "A4", "C#5"]
const gMinorChordFreqs = ["G4", "A#4", "D5"]
const gSharpMinorChordFreqs = ["G#4", "B4", "D#5"]
const aMinorChordFreqs = ["A4", "C5", "E5"]
const aSharpMinorChordFreqs = ["A#4", "C#5", "F5"]
const bMinorChordFreqs = ["B4", "D5", "F#5"]

const options = [
    { "name": "A", "value": aMajorChordFreqs },
    { "name": "Am", "value": aMinorChordFreqs },
    { "name": "A#", "value": aSharpMajorChordFreqs },
    { "name": "A#m", "value": aSharpMinorChordFreqs },
    { "name": "B", "value": bMajorChordFreqs },
    { "name": "Bm", "value": bMinorChordFreqs },
    { "name": "C", "value": cMajorChordFreqs },
    { "name": "Cm", "value": cMinorChordFreqs },
    { "name": "C#", "value": cSharpMajorChordFreqs },
    { "name": "C#m", "value": cSharpMinorChordFreqs },
    { "name": "D", "value": dMajorChordFreqs },
    { "name": "Dm", "value": dMinorChordFreqs },
    { "name": "D#", "value": dSharpMajorChordFreqs },
    { "name": "D#m", "value": dSharpMinorChordFreqs },
    { "name": "E", "value": eMajorChordFreqs },
    { "name": "Em", "value": eMinorChordFreqs },
    { "name": "F", "value": fMajorChordFreqs },
    { "name": "Fm", "value": fMinorChordFreqs },
    { "name": "F#", "value": fSharpMajorChordFreqs },
    { "name": "F#m", "value": fSharpMinorChordFreqs },
    { "name": "G", "value": gMajorChordFreqs },
    { "name": "Gm", "value": gMinorChordFreqs },
    { "name": "G#", "value": gSharpMajorChordFreqs },
    { "name": "G#m", "value": gSharpMinorChordFreqs },
]

export default options