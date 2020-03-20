import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import BdcContainer from "./BdcContainer";
import {connect} from 'react-redux';
import { notes } from '../../actions';

class Landing extends Component {
  state = {
    text: "",
    updateNoteId: null,
  }

  resetForm = () => {
    this.setState({text: "", updateNoteId: null});
  }

  selectForEdit = (id) => {
    let note = this.props.notes[id];
    this.setState({text: note.text, updateNoteId: id});
  }

  submitNote = (e) => {
    e.preventDefault();
    if (this.state.updateNoteId === null) {
      this.props.addNote(this.state.text);
    } else {
      this.props.updateNote(this.state.updateNoteId, this.state.text);
    }
    this.resetForm();
  }

  render() {
    return (
      <BdcContainer>
        <h1>Blue Dress Capital</h1>
        <Link to={"/contact"}> click here</Link> to contact us.
        <h3>Notes</h3>
        <table>
          <tbody>
          {this.props.notes.map((note, id) => (
            <tr key={`note_${id}`}>
              <td>{note.text}</td>
              <td><button onClick={() => this.selectForEdit(id)}>edit</button></td>
              <td><button onClick={() => this.props.deleteNote(id)}>delete</button></td>
            </tr>
          ))}
          </tbody>
        </table>
        <h3>Add new note</h3>
        <form onSubmit={this.submitNote}>
          <input
            value={this.state.text}
            placeholder="Enter note here..."
            onChange={(e) => this.setState({text: e.target.value})}
            required />
          <button onClick={this.resetForm}>Reset</button>
          <input type="submit" value="Save Note" />
        </form>
      </BdcContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    notes: state.notes,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addNote: (text) => {
      dispatch(notes.addNote(text));
    },
    updateNote: (id, text) => {
      dispatch(notes.updateNote(id, text));
    },
    deleteNote: (id) => {
      dispatch(notes.deleteNote(id));
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);