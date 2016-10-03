import React, { Component } from 'react'

import { loadTweets } from './../lib/api'
import Tweet from './Tweet'

class Timeline extends Component {
  constructor (props) {
    super(props)
    this.state = {tweets: [], loading: false}
  }

  componentWillMount () {
    this.setState({loading: true})
    loadTweets(this.props.accessToken.token, this.props.accessToken.secret).end(
      (err, res) => {
        this.setState({tweets: res.body, loading: false})
      }
    )
  }

  render () {
    return (
      this.state.loading
      ? <div ref='loading'>loading...</div>
      : (
        <div>
          {this.state.tweets.map(t => <Tweet key={t.id} text={t.text} />)}
        </div>
      )
    )
  }
}

Timeline.propTypes = {
  accessToken: React.PropTypes.shape({
    token: React.PropTypes.string.isRequired,
    secret: React.PropTypes.string.isRequired
  })
}

export default Timeline
