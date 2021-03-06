import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Tweet from './Tweet'

import { space1 } from './../lib/styles'
import * as api from './../lib/api'
import chrome from './../lib/chrome'
import { REACT_APP_EXTENSION_ID } from './../lib/env'

class Timeline extends Component {
  constructor (props) {
    super(props)
    this.state = { tweets: [], isLoading: false, hasError: false }
    this.archiveTweet = this.archiveTweet.bind(this)
  }

  async componentDidMount() {
    try {
      this.setState({isLoading: true})
      const response = await api.loadTweets(this.props.accessToken.token, this.props.accessToken.secret)
      this.setState({tweets: response.body.tweets, isLoading: false})
      chrome.runtime.sendMessage(REACT_APP_EXTENSION_ID, {action: 'updateTweetCount', value: response.body.total})
    } catch(e) {
      this.setState({hasError: true})
    } finally {
      this.setState({isLoading: false})
    }
  }

  async archiveTweet (tweet) {
    this.setState({tweets: this.state.tweets.filter(t => t.id !== tweet.id)});
    await api.archiveTweet(this.props.accessToken.token, this.props.accessToken.secret, tweet.id_str);
    chrome.runtime.sendMessage(REACT_APP_EXTENSION_ID, {action: 'decreaseTweetCount'})
  }

  render () {
    return (
      <div>
        {
          this.state.tweets.length === 0 && !this.state.isLoading && !this.state.hasError && (
            <div ref='empty' style={{textAlign: 'center', margin: space1}}>Your inbox is empty!</div>
          )
        }
        {
          this.state.tweets.length > 0 && this.state.tweets.map(
            tweet => <Tweet key={tweet.id} onArchive={this.archiveTweet} tweet={tweet} />
          )
        }
        {
          this.state.isLoading && <div ref='loading' style={{textAlign: 'center', margin: space1}}>Loading...</div>
        }
        {
          this.state.hasError && (
            <div ref='error' style={{textAlign: 'center', margin: space1}}>
              There was an error while loading your timeline
            </div>
          )
        }
      </div>
    )
  }
}

Timeline.propTypes = {
  accessToken: PropTypes.shape({
    token: PropTypes.string.isRequired,
    secret: PropTypes.string.isRequired
  })
}

export default Timeline
