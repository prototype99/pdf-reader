'use strict';

import React from 'react';
import cx from 'classnames';
import Editor from './editor';
import ExpandableEditor from './expandable-editor';

export class PopupPreview extends React.Component {
  handleTagsClick = (event) => {
    this.props.onClickTags(this.props.annotation.id, event);
  }

  handleTextChange = (text) => {
    this.props.onChange({ id: this.props.annotation.id, text });
  }

  handleCommentChange = (text) => {
    this.props.onChange({ id: this.props.annotation.id, comment: text });
  }

  handleClickPage = (event) => {
    if (!this.props.annotation.readOnly) {
      event.stopPropagation();
      this.props.onPageMenu(this.props.annotation.id, event.screenX, event.screenY);
    }
  }

  handleClickMore = (event) => {
    if (!this.props.annotation.readOnly) {
      event.stopPropagation();
      this.props.onMoreMenu(this.props.annotation.id, event.screenX, event.screenY);
    }
  }

  render() {
    let { annotation } = this.props;

    return (
      <div className={cx('preview', { 'read-only': annotation.readOnly })}>
        <header
          title={'Modified on ' + annotation.dateModified.split('T')[0]}
          draggable={true}
          onDragStart={this.handleDragStart}
        >
          <div className="left">
            <div className="color" style={{ backgroundColor: annotation.color }}/>
            <div className="page" onClick={this.handleClickPage}>Page {annotation.pageLabel}</div>
          </div>
          {annotation.authorName && (
            <div className="center">
              <div className="author">{annotation.authorName}</div>
            </div>
          )}
          <div className="right">
            <div className="more" onClick={this.handleClickMore}/>
          </div>
        </header>

        <div className="comment">
          <Editor
            id={annotation.id}
            text={annotation.comment}
            placeholder="Add comment"
            isPlainText={false}
            isReadOnly={annotation.readOnly}
            onChange={this.handleCommentChange}
          />
        </div>

        <div
          className="tags"
          onClick={this.handleTagsClick}
          placeholder="Add tags…"
          draggable={true}
          onDragStart={this.handleDragStart}
        >{annotation.tags.map((tag, index) => (
          <span
            className="tag" key={index}
            style={{ color: tag.color }}
          >{tag.name}</span>
        ))}</div>

      </div>
    );
  }
}

export class SidebarPreview extends React.Component {

  handleSectionClick = (event, section) => {
    this.props.onClickSection(this.props.annotation.id, section, event);
  }

  handleTextChange = (text) => {
    this.props.onChange({ id: this.props.annotation.id, text });
  }

  handleCommentChange = (text) => {
    this.props.onChange({ id: this.props.annotation.id, comment: text });
  }

  handleClickPage = (event) => {
    if (!this.props.annotation.readOnly) {
      event.stopPropagation();
      this.props.onPageMenu(this.props.annotation.id, event.screenX, event.screenY);
    }
  }

  handleClickMore = (event) => {
    if (!this.props.annotation.readOnly) {
      event.stopPropagation();
      this.props.onMoreMenu(this.props.annotation.id, event.screenX, event.screenY);
    }
  }

  handleDragStart = (event) => {
    if (!event.target.getAttribute('draggable')) return;

    let target = event.target.closest('.preview');


    let br = target.getBoundingClientRect();
    let offsetX = event.clientX - br.left;
    let offsetY = event.clientY - br.top;

    let x = offsetX;
    let y = offsetY;

    event.dataTransfer.setData('text/plain', 'dfd');
    event.dataTransfer.setDragImage(event.target.closest('.annotation'), x, y);

  }

  handleEditorBlur = () => {
    this.props.onEditorBlur(this.props.annotation.id);
  }

  handleHighlightDoubleClick = () => {
    this.props.onDoubleClickHighlight(this.props.annotation.id);
  }

  render() {
    let { annotation, state } = this.props;

    let text = annotation.type === 'highlight' && (
      <div className="highlight"
           onClick={(e) => this.handleSectionClick(e, 'highlight')}
           onDoubleClick={this.handleHighlightDoubleClick}
           draggable={state !== 3 || annotation.readOnly}
           onDragStart={this.handleDragStart}
      >
        <div className="blockquote-border" style={{ backgroundColor: annotation.color }} />
        <ExpandableEditor
          id={annotation.id}
          text={annotation.text}
          placeholder="Add extracted text…"
          isReadOnly={annotation.readOnly}
          isExpanded={this.props.state >= 2}
          isEditable={state === 3}
          onChange={this.handleTextChange}
          onBlur={this.handleEditorBlur}
        />
      </div>
    )

    let comment = (state >= 1 || annotation.comment) && !(annotation.readOnly && !annotation.comment) &&
      <div className="comment" onClick={(e) => this.handleSectionClick(e, 'comment')}
           draggable={state === 0 || state === 3 || annotation.readOnly} onDragStart={this.handleDragStart}>
        <ExpandableEditor
          id={annotation.id}
          text={annotation.comment}
          placeholder="Add comment"
          isPlainText={false}
          onChange={this.handleCommentChange}
          isReadOnly={annotation.readOnly}
          isExpanded={state >= 1}
          isEditable={state === 1 || state === 2}
          onBlur={this.handleEditorBlur}
        />
      </div>;

    let tags = annotation.tags.map((tag, index) => (
      <span
        className="tag" key={index}
        style={{ color: tag.color }}
      >{tag.name}</span>
    ));

    let expandedState = {};
    expandedState['expanded' + this.props.state] = true;

    return (
      <div className={cx('preview', {
        'read-only': annotation.readOnly, ...expandedState
      })}>
        <header
          title={'Modified on ' + annotation.dateModified.split('T')[0]}
          onClick={(e) => this.handleSectionClick(e, 'header')}
          draggable={true}
          onDragStart={this.handleDragStart}
        >
          <div className="left">
            <div className="icon icon-highlight" style={{ color: annotation.color }}>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path fill="currentColor" d="M12,5H0V3H12Zm0,1H0V8H12ZM9,9H0v2H9Zm3-9H3V2h9Z" />
              </svg>
              {/*<svg width="12" height="12" viewBox="0 0 12 12">
                <path fill="currentColor" d="M0,7H5v5ZM0,0V6H6v6h6V0Z" />
              </svg>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path fill="currentColor" d="M2,8V2H8V8Zm8,1V7H9V9H7v1H9v2h1V10h2V9ZM1,1H9V6h1V0H0V10H6V9H1Z" />
              </svg>*/}
            </div>
            <div className="page" onClick={this.handleClickPage}>Page {annotation.pageLabel}</div>
          </div>
          {annotation.authorName && (
            <div className="center">
              <div className="author">{annotation.authorName}</div>
            </div>
          )}
          <div className="right">
            <div className="more" onClick={this.handleClickMore}/>
          </div>
        </header>
        {annotation.image && (
          <img className="image" onClick={(e) => this.handleSectionClick(e, 'image')} src={annotation.image}
               draggable={true} onDragStart={this.handleDragStart}/>)}
        {text}
        {comment}
        {(state >= 1 || annotation.tags.length > 0) && !(annotation.readOnly && !annotation.comment) &&
        (
          <div
            className="tags"
            onClick={(e) => this.handleSectionClick(e, 'tags')}
            placeholder="Add tags…"
            draggable={true}
            onDragStart={this.handleDragStart}
          >{tags}</div>
        )}


      </div>
    );
  }
}

