import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class ShareCard extends React.Component {
  constructor(props) {
    super(props)

    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      schemaJSON: undefined
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }

    if (this.props.schemaJSON) {
      stateVar.schemaJSON = this.props.schemaJSON;
    }

    this.state = stateVar;
  }

  exportData() {
    return document.getElementById('ProtoScreenshot').getBoundingClientRect();
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    if (this.state.fetchingData){
      axios.all([
        axios.get(this.props.dataURL),
        axios.get(this.props.schemaURL)
      ]).then(axios.spread((card, schema) => {
          this.setState({
            fetchingData: false,
            dataJSON: card.data,
            schemaJSON: schema.data
          });
      }));
    }
  }

  getImageParameters() {
    const data = this.state.dataJSON.data,
      social_site_settings = this.state.dataJSON.data.social_site_settings;

    let styles,
      cover_image,
      cover_title = data.cover_data.cover_title,
      logo_image = data.cover_data.logo_image.image;

    switch(this.props.mode) {
      case 'instagram_image':
        cover_image = data.cover_data.instagram_image.image;
        styles = {
          width: social_site_settings.instagram.min_height * social_site_settings.instagram.width,
          height: social_site_settings.instagram.min_height
        }
        break;
      case 'fb_image':
      case 'twitter':
        cover_image = data.cover_data.fb_image.image;
        styles = {
          width: social_site_settings.twitter.min_height * social_site_settings.twitter.width,
          height: social_site_settings.twitter.min_height
        }
        break;
    }

    return {
      cover_title: cover_title,
      logo_image: logo_image,
      cover_image: cover_image,
      styles: styles
    };

  }

  render() {
    if (this.state.fetchingData){
      return(<div>Loading</div>)
    } else {
      const {cover_image, logo_image, cover_title, styles} = this.getImageParameters();
      return (
        <div>
        </div>
      )
    }
  }
}
