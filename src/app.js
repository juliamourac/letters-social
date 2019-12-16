import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parseLinkHeader from 'parse-link-header';
import orderBy from 'lodash/orderBy';

import ErrorMessage from './components/error/Error';
import Nav from './components/nav/navbar';
import Loader from './components/Loader';

import * as API from './shared/http';
import Ad from './components/ad/Ad';
import Post from './components/post/Post';
import Welcome from './components/welcome/Welcome';

import CreatePost from './components/post/Create';

/**
 * The app component serves as a root for the project and renders either children,
 * the error state, or a loading state
 * @method App
 * @module letters/components
 */
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            loading: false,
        };
    }
    static propTypes = {
        children: PropTypes.node,
    };
    componentDidMount() {
        this.getPosts();
    }
    
    omponentDidCatch(err, info) {
        console.error(err);
        console.error(info);
        this.setState(() => ({
            error: err,
        }));
    }

    //Retrieving post 
    createNewPost(){
        return API.createPost(post)
        .then(res => res.json())
        .then(newPost =>{
            this.setState(prevState => {
                return {
                    posts: orderBy(prevState.posts.concat(newPost), 'date', 'desc')
                };
            });
        })
        .catch(err => {
            this.setState(() => ({error: err}));
        });
    }


    getPosts() {
        API.fetchPosts(this.state.endpoint)
            .then(res => {
                return res.json().then(posts => {
                    const links = parseLinkHeader(res.headers.get('Link'));
                    this.setState(() => ({
                        posts: orderBy(this.state.posts.concat(posts), 'date', 'desc'),
                        endpoint: links.next.url,
                    }));
                });
            })
            .catch(err => {
                this.setState(() => ({ error: err }));
            });
    }
    render() {
        if (this.state.error) {
            return (
                <div className="app">
                    <ErrorMessage error={this.state.error} />
                    <CreatePost onSubmit={this.createNewPost} />
                </div>
            );
        }
        return (
            <div className="app">
                <Nav user={this.props.user} />
                {this.state.loading ? (
                    <div className="loading">
                        <Loader />
                    </div>
                ) : (
                    <div className="home">
                        <Welcome key="welcome" />
                        <div>
                            {this.state.posts.length && (
                                <div className="posts">
                                    {this.state.posts.map(({ id }) => {
                                        return <Post id={id} key={id} user={this.props.user} />;
                                    })}
                                </div>
                            )}
                            <button className="block" onClick={this.getPosts}>
                                Load more posts
                            </button>
                        </div>
                        <div>
                            <Ad
                                url="https://ifelse.io/book"
                                imageUrl="/static/assets/ads/ria.png"
                            />
                            <Ad
                                url="https://ifelse.io/book"
                                imageUrl="/static/assets/ads/orly.jpg"
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default App;
