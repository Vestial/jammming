import React from 'react'
import './Track.css'

class Track extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playing: false,
    }
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.togglePreview = this.togglePreview.bind(this)
    this.renderIcons = this.renderIcons.bind(this)
  }

  addTrack() {
    this.props.onAdd(this.props.track)
  }

  removeTrack() {
    this.props.onRemove(this.props.track)
  }

  renderAction() {
    if (this.props.isRemoval) {
      return (
        <a className="Track-action" onClick={this.removeTrack}>
          -
        </a>
      )
    }
    return (
      <a className="Track-action" onClick={this.addTrack}>
        +
      </a>
    )
  }

  togglePreview() {
    const audio = this.refs.audio
    if (!this.state.playing) {
      audio.play()
      this.setState({
        playing: true
      })
    }
     else {
      audio.pause()
      this.setState({
        playing: false
      })
    }
  }

  renderIcons() {
    if (this.props.track.preview) {
      if (!this.state.playing) {
        return (
          <i
            className="fa fa-play fa-2x Track-preview-icon-play"
            aria-hidden="true"
            onClick={this.togglePreview}
          />
        )
      } else {
        return (
          <i
            className="fa fa-pause fa-2x Track-preview-icon-pause"
            aria-hidden="true"
            onClick={this.togglePreview}
          />
        )
      }
    } else {
      return (
        <p className="Track-preview-unavailable">
          Preview <br />Unavailable
        </p>
      )
    }
  }
  render() {
    return (
      <div className="Track" key={this.props.track.id}>
        <div className="Track-preview">
          <audio
            ref="audio"
            src={this.props.track.preview}
            onEnded={() => this.setState({playing: false})}
          />
          <div className="Track-preview-container">
            {this.renderIcons()}
          </div>
          <img
            className="Track-preview-album"
            src={this.props.track.cover}
            alt="cover"
          />
        </div>
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>
            {this.props.track.artist} | {this.props.track.album}
          </p>
        </div>
        {this.renderAction()}
      </div>
    )
  }
}

export default Track
