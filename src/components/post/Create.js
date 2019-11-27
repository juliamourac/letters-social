import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { threadId } from 'worker_threads';
import Filter from 'bad-words';
import LocationTypeAhead from '../map/LocationTypeAhead';
import DisplayMap from '../map/DisplayMap';

const filter = Filter();

class CreatePost extends Component{
    static propTypes = {

    };

    //fetchPosts(){/*where bitch?*/}

    constructor(props){
        super(props);

        this.initialState = {
            content: '',
            valid: false,
            showLocationPicker: false,
            location: {
                lat: 34.1535641,
                lng: -118.1428115,
                name: null
            },
            locationSelected: false,
        };
        
        this.state = this.initialState;

        this.handlePostChange = this.handlePostChange.bind(this);
        this.handleRemoveLocation = this.handleRemoveLocation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleToggleLocation = this.handleToggleLocation.bind(this);
        this.onLocationSelect = this.onLocationSelect.bind(this);
        this.onLocationUpdate = this.onLocationUpdate.bind(this);
        this.renderLocationControls = this.renderLocationControls.bind(this);
    }

    renderLocationControls(){
        return (
            <div className="controls">
                <button onClick={this.handleSubmit}>Post</button>
                {
                    this.state.location && this.state.locationSelected ? (
                        <button onClick={this.handleRemoveLocation} className="open location-indicator">
                            <i className="fa-location-arrow fa" />
                            <small>{this.state.location.name}</small>
                        </button>
                    ):(
                        <button onClick={this.handleToggleLocation} className="open">
                            {this.state.showLocationPicker ? 'Cancel' : 'Add location'}
                            {''}
                            <i className={classNames(`fa`, {'fa-map-o':!this.state.showLocationPicker,'fa-times': this.state.showLocationPicker}
                            )} />
                        </button>
                    )}
            </div>
        );
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

    handleRemoveLocation(){
        this.setState(() => ({
            locationSelected: false,
            location: this.initialState.location,
        }));
    }

    handleSubmit(event){
        //event.preventDefault();
        if (!this.state.valid){
            return;
        }
        const newPost = {
            content: this.state.content,
        };
        
        if(this.state.locationSelected){
            newPost.location = this.state.location;
        }

        this.props.OnSubmit(newPost);

        this.setState(() => ({
            content:'',
            valid: false,
            showLocationPicker: false,
            location: this.initialState.location,
            locationSelected: false,
        }));
    }

    onLocationUpdate(){
        this.setState(() => ({
            location,
            showLocationPicker: false,
            locationSelected: true,
        }));
    }

    handleToggleLocation(e){
        e.preventDefault();
        this.setState(state => ({
            showLocationPicker: !state.showLocationPicker,
        }));
    }

    render(){
        return (
            <div className='create-post'>
                <textarea value={this.state.content} onChange={this.handlePostChange} placeholder="what's on your mind?" />
                {this.renderLocationControls()}
                <div className="location-picker" style={{display:this.state.showLocationPicker ? 'block' : 'none'}}>
                    {
                        !this.state.locationSelected && [
                            <LocationTypeAhead key="LocationTypeAhead" onLocationSelect={this.onLocationSelect} onLocationUpdate={this.onLocationUpdate} />,
                            <DisplayMap key="DisplayMap" displayOnly={false} location={this.state.location} onLocationSelect={this.onLocationSelect} onLocationUpdate={this.onLocationUpdate} />
                        ]}
                </div>
            </div>
        );
    }
}