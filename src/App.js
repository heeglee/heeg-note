import React, { Component } from 'react';
import firebase from 'firebase';
// COMPONENTS
import SidebarComponent from './sidebar/sidebar';
import EditorComponent from './editor/editor';
// STYLESHEET
import './App.css';

class App extends Component {
    state = {
        selectedNoteIndex: null,
        selectedNote: null,
        notes: null
    };

    componentDidMount() {
        firebase.firestore().collection('notes').onSnapshot(serverUpdate => {
            const notes = serverUpdate.docs.map(_doc => {
                const data = _doc.data();
                data['id'] = _doc.id;
                return data;
            });

            this.setState({ notes: this.sortNoteList(notes) });
        });
    }

    selectNote = (note, index) => {
        this.setState({ selectedNoteIndex: index, selectedNote: note });
    };

    deleteNote = async (note) => {
        const noteIndex = this.state.notes.indexOf(note);
        const prevNote = this.state.notes[noteIndex - 1];
        this.setState({
            notes: this.state.notes.filter(n => n !== note)
        });

        if (this.state.selectedNoteIndex === noteIndex) {
            this.setState({
                selectedNoteIndex: null, selectedNote: null
            });

        } else {
            this.state.notes.length > 1 ?
            this.selectNote(this.state.notes[this.state.selectedNoteIndex - 1], this.state.selectedNoteIndex - 1)
            : this.setState({
                selectedNoteIndex: null, selectedNote: null
            });
        }

        await firebase.firestore().collection('notes').doc(prevNote.id).update({
            nextId: note.nextId
        });
        firebase.firestore().collection('notes').doc(note.id).delete();
    };

    noteUpdate = (id, note) => {
        firebase.firestore().collection('notes').doc(id).update({
            title: note.title,
            body: note.body,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    };

    newNote = async (title) => {
        const note = {
            title: title,
            body: ''
        };
        const lastNote = this.state.notes[this.state.notes.length - 1];

        const newNoteFromDatabase = await firebase.firestore().collection('notes').add({
            title: note.title,
            body: note.body,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            nextId: ""
        });

        const newId = newNoteFromDatabase.id;

        this.setState({
            notes: [...this.state.notes, note]
        });
        const newNoteIndex = this.state.notes.indexOf(this.state.notes.filter(note => note.id === newId)[0]);
        console.log(newNoteIndex);
        this.setState({
            selectedNote: this.state.notes[newNoteIndex],
            selectedNoteIndex: newNoteIndex
        });
        
        await firebase.firestore().collection('notes').doc(lastNote.id).update({
            nextId: newId
        });
    };

    sortNoteList = (notes) => {
        const sortedList = [];
        let target = "";

        while (notes.length > 0) {
            // eslint-disable-next-line no-loop-func
            const pointer = notes.findIndex(v => v.nextId === target);
            console.log(pointer);
            
            if (pointer < 0) {
                if (target === "") break;
                else {
                    target = "";
                }
            } else {
                target = notes[pointer].id;
                console.log(notes[pointer]);
                sortedList.unshift(notes[pointer]);
                notes.splice(pointer, 1);
            }
        }

        if (notes.length > 0) {
            for (let i = 0; i < notes.length; i++) {
                if (notes[i + 1]) notes[i].nextId = notes[i + 1].id || "";
            }

            sortedList.concat(notes);
        }
        
        return sortedList;
    }

    changeIndex = (index, dir) => {
        if ((index === 0 && dir === "up") || (index === this.state.notes.length - 1 && dir === "down")) return;
        const target = this.state.notes[index];
        let prev, curr, next;

        switch (dir) {
            case "up":
                prev = this.state.notes[index - 2];
                curr = this.state.notes[index - 1];

                this.changeLinkedOrder(prev, curr, target);
                break;
            case "down":
                prev = this.state.notes[index - 1];
                next = this.state.notes[index + 1];

                this.changeLinkedOrder(prev, target, next);
                break;
            default:
                console.error("Invalid argument exception");
                return;
        }
    }

    changeLinkedOrder = async (prev, curr, next) => {
        try {
            let batch = firebase.firestore().batch();

            batch.update(firebase.firestore().collection('notes').doc(curr.id), { nextId: next.nextId });
            batch.update(firebase.firestore().collection('notes').doc(next.id), { nextId: curr.id });
            if (prev) batch.update(firebase.firestore().collection('notes').doc(prev.id), { nextId: next.id });

            await batch.commit();

        } catch (e) {
            console.error(e);
        }
    }
    
    render() {
        return (
            <div className="app-container">
                <SidebarComponent selectedNoteIndex={this.state.selectedNoteIndex} notes={this.state.notes} deleteNote={this.deleteNote} selectNote={this.selectNote} newNote={this.newNote} changeIndex={this.changeIndex}></SidebarComponent>
                {
                    this.state.selectedNote ? (
                        <EditorComponent selectedNote={this.state.selectedNote} selectedNoteIndex={this.state.selectedNoteIndex} notes={this.state.notes} noteUpdate={this.noteUpdate}></EditorComponent>
                    ) : null
                }
            </div>
        );
    }
}

export default App;