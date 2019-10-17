import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CreatePost extends Component{
    static propTypes = {

    };

    constructor(props){
        super(props);
        
        this.state = {
            content:''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePostChange = this.handlePostChange.bind(this);
    }

    handlePostChange(event){
        const content = event.target.value;
        this.setState( () => {
            return{
                content,
            };
        });
    }

    handleSubmit(){
        console.log('Handling submission!')
    }

    render(){
        return (
            <div className='create-post'>
                <button onClick={this.handleSubmit}>Post</button>
                <textarea 
                    value={this.state.content}
                    onChange={this.handlePostChange}
                    placeholder="What's on your mind?" />
            </div>
        );
    }
}