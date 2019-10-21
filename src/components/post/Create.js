import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { threadId } from 'worker_threads';
import Filter from 'bad-words';

const filter = Filter();

class CreatePost extends Component{
    static propTypes = {

    };

    //fetchPosts(){/*where bitch?*/}

    constructor(props){
        super(props);
        
        this.state = {
            content:'',
            valid: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePostChange = this.handlePostChange.bind(this);
    }

    handlePostChange(event){
        const content = filter.clean(event.target.value);
        this.setState( () => {
            return{
                content,
                valid: content.length <= 200
            };
        });
    }

    handleSubmit(event){
        event.preventDefault();
        if (!this.state.valid){
            return;
        }
        if(this.props.OnSubmit){
            const newPost = {
                date: Date.now(),
                id: Date.now(),
                content: this.state.content
            };
            this.props.OnSubmit(newPost);
            this.setState({
                content: '',
                valid: null
            });
        }
    }

    render(){
        return (
            <div className='create-post'>
                <button onClick={this.handleSubmit}>Post</button>
                <textarea
                    value = {this.state.content}
                    onChange={this.handlePostChange}
                    placeholder="What's on your mind?" />
            </div>
        );
    }
}