import React, { Component } from 'react';
import styles from './styles';
import { Delete as DeleteIcon, KeyboardArrowUp as KeyboardArrowUpIcon, KeyboardArrowDown as KeyboardArrowDownIcon } from '@material-ui/icons';
import { removeHTMLTags } from '../util/helpers';
import { ListItem, ListItemText, withStyles } from '@material-ui/core';

class SidebarItemComponent extends Component {

    render() {
        const { note, index, classes, selectedNoteIndex } = this.props;
        const bodyString = removeHTMLTags(note.body);

        return (
            <div key={index}>
                <ListItem className={classes.listItem} selected={selectedNoteIndex === index} alignItems='flex-start'>
                    <div className={classes.textSection} onClick={() => this.selectNote(note, index)}>
                        <ListItemText primary={note.title} secondary={bodyString.length > 30 ? bodyString.substring(0, 30) + '...' : bodyString} />
                    </div>
                    <KeyboardArrowUpIcon className={classes.orderUpIcon} onClick={() => this.changeIndex(index, "up")} />
                    <KeyboardArrowDownIcon className={classes.orderDownIcon} onClick={() => this.changeIndex(index, "down")} />
                    <DeleteIcon onClick={() => this.deleteNote(note)} className={classes.deleteIcon} />
                </ListItem>
            </div>
        );
    }

    selectNote = (note, index) => {
        this.props.selectNote(note, index);
    }

    deleteNote = (note) => {
        if (window.confirm(`Are you sure you want to delete: ${note.title}?`)) {
            this.props.deleteNote(note);
        }
    }

    changeIndex = (index, dir) => {
        this.props.changeIndex(index, dir);
    }
}

export default withStyles(styles)(SidebarItemComponent);