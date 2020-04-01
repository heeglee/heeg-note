import React, { Component } from 'react';
import styles from './styles';
import { withStyles, Divider, Button, List } from '@material-ui/core';
import SidebarItemComponent from '../sidebar-item/sidebarItem';

class SideBarComponent extends Component {
    constructor() {
        super();
        this.state = {
            addingNote: false,
            title: null
        };
    }

    render() {
        const { notes, classes, selectedNoteIndex } = this.props;

        if (notes) {
            return (
                <div className={classes.sidebarContainer}>
                    <Button onClick={this.newNoteBtnClick} className={classes.newNoteBtn}>{this.state.addingNote ? 'Cancel' : 'New Note'}</Button>
                    {
                        this.state.addingNote ?
                        (
                            <div>
                                <input type='text' className={classes.newNoteInput} placeholder='Enter note title' onKeyUp={(e) => this.updateTitle(e.target.value)}></input>
                                <Button className={classes.newNoteSubmitBtn} onClick={this.newNote}>Submit Note</Button>
                            </div>
                        )
                        : null
                    }
                    <List>
                        {
                            notes.map((note, index) => {
                                return (
                                    <div key={index}>
                                        <SidebarItemComponent note={note} index={index} selectedNoteIndex={selectedNoteIndex} selectNote={this.selectNote} deleteNote={this.deleteNote} changeIndex={this.changeIndex}></SidebarItemComponent>
                                        <Divider />
                                    </div>
                                )
                            })
                        }
                    </List>
                </div>
            );
        } else {
            return (
                <div></div>
            );
        }
        
    }

    newNoteBtnClick = () => {
        this.setState({ addingNote : !this.state.addingNote });
    }

    updateTitle = (text) => {
        this.setState({ title: text });
    }

    newNote = () => {
        this.props.newNote(this.state.title);
        this.setState({
            addingNote: false
        });
    }

    selectNote = (note, index) => {
        this.props.selectNote(note, index);
    }

    deleteNote = (note) => {
        this.props.deleteNote(note);
    }

    changeIndex = (index, dir) => {
        this.props.changeIndex(index, dir);
    }
}

export default withStyles(styles)(SideBarComponent);