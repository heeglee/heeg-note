import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import debounce from '../util/helpers';
import { BorderColor as BorderColorIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core';
import styles from './styles';

class EditorComponent extends Component {
    constructor() {
        super();
        this.state = {
            text: '',
            title: '',
            id: ''
        };
    }

    componentDidMount() {
        this.setState({
            text: this.props.selectedNote.body,
            title: this.props.selectedNote.title,
            id: this.props.selectedNote.id
        });
    }

    componentDidUpdate() {
        if (this.props.selectedNote.id !== this.state.id) {
            this.setState({
                text: this.props.selectedNote.body,
                title: this.props.selectedNote.title,
                id: this.props.selectedNote.id
            })
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.editorContainer}>
                <BorderColorIcon className={classes.editIcon} />
                <input className={classes.titleInput} placeholder={'Note Title'} value={this.state.title ? this.state.title : ''} onChange={(e) => this.updateTitle(e.target.value)}></input>
                <ReactQuill value={this.state.text} onChange={this.updateBody}></ReactQuill>
            </div>
        );
    }

    updateBody = async (val) => {
        await this.setState({ text: val });
        this.update();
    }

    updateTitle = async (text) => {
        await this.setState({ title: text });
        this.update();
    }

    update = debounce(() => {
        this.props.noteUpdate(this.state.id, {
            title: this.state.title,
            body: this.state.text,
            id: this.state.id
        });
    }, 3000);
}

export default withStyles(styles)(EditorComponent);