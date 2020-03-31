'use strict';

import React from 'react';
import cx from 'classnames';
import ColorPicker from './color-picker';
import Editor from './editor';
import CollapsedEditor from './collapsed-editor';

class AnnotationPreview extends React.Component {
  state = {
    showing: 'main',
    editingText: false,
    editingPage: false
  };
  
  componentDidMount() {
    // if (!this.props.annotation.comment) {
    //   setTimeout(() => {
    //     this.refs.textarea.focus();
    //   }, 0);
    // }
  }
  
  handleTagsClick = (event) => {
    let rect = event.currentTarget.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    this.props.onClickTags(this.props.annotation.id, event.screenX - x, event.screenY - y);
  }
  
  handleDelete = () => {
    this.props.onDelete();
  }
  
  handleColorPick = (color) => {
    this.setState({ showing: 'main' });
    this.props.onChange({ id: this.props.annotation.id, color });
  }
  
  handlePageLabelChange = () => {
    this.props.onChange({
      id: this.props.annotation.id,
      pageLabel: this.refs.pageLabel.value
    });
    this.setState({ showing: 'main' });
  }
  
  handleResetPageLabels = () => {
    this.props.onResetPageLabels(
      this.props.annotation.position.pageIndex,
      this.refs.pageLabel.value
    );
    
    this.setState({ showing: 'main' });
  }
  
  handleTextChange = (text) => {
    this.props.onChange({ id: this.props.annotation.id, text });
  }
  
  handleCommentChange = (text) => {
    this.props.onChange({ id: this.props.annotation.id, comment: text });
  }
  
  handleBeginEditingText = () => {
    this.setState({ editingText: true })
  }
  
  handleEndEditingText = () => {
    this.setState({ editingText: false })
  }
  
  handleBeginEditingPage = () => {
    this.setState({ editingPage: true })
  }
  
  handleShowMain = () => {
    this.setState({ showing: 'main' });
  }
  
  handleShowSettings = () => {
    this.setState({ showing: 'settings' });
  }
  
  handleShowPage = () => {
    if (!this.props.annotation.readOnly) {
      this.setState({ showing: 'page' });
    }
  }
  
  sliceText(text) {
    let slicedText = text.slice(0, 70).trim();
    if (text.length > 70) {
      slicedText += '..';
    }
    return slicedText;
  }
  
  mainView() {
    let { annotation, isLayer, onDragStart } = this.props;
    
    let text;
    if (annotation.type === 'highlight' && !isLayer) {
      text = <CollapsedEditor
        id={annotation.id}
        text={annotation.text}
        placeholder="Extracted text.."
        isReadOnly={!!annotation.readOnly}
        onChange={this.handleTextChange}
        onBlur={this.handleEndEditingText}
      />
    }
    
    let tags = annotation.tags.map((tag, index) => (
      <span
        className="tag" key={index}
        style={{ color: tag.color }}
      >{tag.name}</span>
    ));
    
    let comment;
    if (this.props.isLayer) {
      comment = !(annotation.readOnly && !annotation.comment) && <Editor
        id={annotation.id}
        text={annotation.comment}
        placeholder="Comment.."
        isPlainText={false}
        isReadOnly={annotation.readOnly}
        onChange={this.handleCommentChange}
        onBlur={this.handleEndEditingText}
        onSelectionChange={()=>{}}
      />;
    }
    else {
      comment = !(annotation.readOnly && !annotation.comment) && <div className="comment"><CollapsedEditor
        id={annotation.id} text={annotation.comment} placeholder="Comment.."
        isPlainText={false} onChange={this.handleCommentChange}
        onBlur={this.handleEndEditingText}
        isReadOnly={annotation.readOnly}
      /></div>;
    }
    
    return (
      <div className="main-view">
        <div
          className="color-line" style={{ backgroundColor: annotation.color }}
          draggable={true} onDragStart={onDragStart}
        />
        <div className="header" title={'Modified on ' + annotation.dateModified.split('T')[0]}>
          <div className="page" onClick={this.handleShowPage}>Page {annotation.pageLabel}</div>
          <div className="author">{annotation.authorName}</div>
          {annotation.readOnly ? <div></div> : <div className="settings" onClick={this.handleShowSettings}>⚙</div>}
        </div>
        {!isLayer && annotation.image && (<img className="image" src={annotation.image}/>)}
        {text}
        {comment}
        {!annotation.readOnly &&
        <div className="tags" onClick={this.handleTagsClick} placeholder="Add tags..">{tags}</div>}
      </div>
    );
  }
  
  settingsView() {
    return (
      <div className="settings-view">
        <div className="back" onClick={this.handleShowMain}>←</div>
        <ColorPicker onColorPick={this.handleColorPick}/>
        <div className="button" onClick={this.handleDelete}>Delete</div>
      </div>
    );
  }
  
  pageView() {
    return (
      <div className="page-view">
        <div className="back" onClick={this.handleShowMain}>←</div>
        <div>Page label:</div>
        <input ref="pageLabel" type="text" defaultValue={this.props.annotation.pageLabel} />
        <div className="button" onClick={this.handlePageLabelChange}>Update this annotation</div>
        <div className="button" onClick={this.handleResetPageLabels}>Update all annotations</div>
      </div>
    );
  }
  
  render() {
    let { annotation } = this.props;
    let { showing } = this.state;
    let content = null;
    if (showing === 'main') {
      content = this.mainView();
    }
    else if (showing === 'settings') {
      content = this.settingsView();
    }
    else if (showing === 'page') {
      content = this.pageView();
    }
    
    return (
      <div className={cx('annotation-preview', { 'read-only': annotation.readOnly })}>
        {content}
      </div>
    );
  }
}

export default AnnotationPreview;
