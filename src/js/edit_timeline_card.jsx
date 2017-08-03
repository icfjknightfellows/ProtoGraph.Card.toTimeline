import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import TimelineCard from './Container.jsx';
import JSONSchemaForm from '../../lib/js/react-jsonschema-form.js';

export default class EditTimelineCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      dataJSON: {
        data: {},
        mandatory_config: {}
      },
      mode: "laptop",
      publishing: false,
      schemaJSON: undefined,
      errorOnFetchingData: undefined,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined
    }
    this.toggleMode = this.toggleMode.bind(this);
  }

  exportData() {
    let getDataObj = {
      step: this.state.step,
      dataJSON: this.state.dataJSON,
      schemaJSON: this.state.schemaJSON,
      optionalConfigJSON: this.state.optionalConfigJSON,
      optionalConfigSchemaJSON: this.state.optionalConfigSchemaJSON
    }
    getDataObj["name"] = getDataObj.dataJSON.mandatory_config.timeline_title
    return getDataObj;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    if (typeof this.props.dataURL === "string"){
      axios.all([axios.get(this.props.dataURL), axios.get(this.props.schemaURL), axios.get(this.props.optionalConfigURL), axios.get(this.props.optionalConfigSchemaURL)])
        .then(axios.spread((card, schema, opt_config, opt_config_schema) => {
          let stateVar = {
            dataJSON: {
              data: card.data.data,
              mandatory_config: card.data.mandatory_config
            },
            schemaJSON: schema.data,
            optionalConfigJSON: opt_config.data,
            optionalConfigSchemaJSON: opt_config_schema.data
          }
          stateVar.languageTexts = this.getLanguageTexts(stateVar.dataJSON.mandatory_config.language);
          this.setState(stateVar);
        }))
        .catch((error) => {
          this.setState({
            errorOnFetchingData: true
          })
        });
    }
  }

  getLanguageTexts(languageConfig) {
    let language = languageConfig ? languageConfig : "english",
      text_obj;
console.log(language);
    switch(language.toLowerCase()) {
      case "hindi":
        text_obj = {
          button_text: "चलो समय यात्रा करे",
          font: "'Hindi', sans-serif"
        }
        break;
      default:
        text_obj = {
          button_text: "Let's time travel",
          font: "'Helvetica Neue', sans-serif, aerial"
        }
        break;
    }

    // if(typeof text_obj === "object") {
    //   text_obj.next = text_obj.next;
    //   text_obj.restart = text_obj.restart;
    //   text_obj.swipe = text_obj.swipe;
    // }

    return text_obj;
  }

  onChangeHandler({formData}) {
    // console.log(formData, this.state.step, "...................")
    switch (this.state.step) {
      case 1:
        this.setState((prevStep, prop) => {
          let dataJSON = prevStep.dataJSON;
          dataJSON.mandatory_config = formData;
          return {
            dataJSON: dataJSON
          }
        });
        break;
      case 2:
      this.setState((prevStep, prop) => {
        let dataJSON = prevStep.dataJSON;
        dataJSON.data.events = formData.events;
        return {
          dataJSON: dataJSON
          // optionalConfigJSON: dataJSON
        }
      });
        break;
    }
  }

  onSubmitHandler(e) {
    switch(this.state.step) {
      case 1:
        this.setState({
          step: 2
        });
        break;
        case 2:
          if (typeof this.props.onPublishCallback === "function") {
            this.setState({ publishing: true });
            let publishCallback = this.props.onPublishCallback();
            publishCallback.then((message) => {
              this.setState({ publishing: false });
            });
          }
          break;
    }
  }

  renderSEO() {
    let seo_blockquote = document.getElementById('protograph_div').outerHTML;
    return seo_blockquote;
  }

  renderSchemaJSON() {
    switch(this.state.step){
      case 1:
        return this.state.schemaJSON.properties.mandatory_config;
        break;
      case 2:
        return this.state.schemaJSON.properties.data;
        break;
      }
  }

getFormData() {
  switch(this.state.step) {
    case 1:
      return this.state.dataJSON.mandatory_config;
      break;
    case 2:
      return this.state.dataJSON.data;
      break;
  }
}

showLinkText() {
    switch(this.state.step) {
      case 1:
        return '';
        break;
      case 2:
        return '< Back to building the card';
        break;
    }
  }

  showButtonText() {
    switch(this.state.step) {
      case 1:
        return 'Proceed to next step';
        break;
      case 2:
        return 'Publish';
        break;
    }
  }

  onPrevHandler() {
    let prev_step = --this.state.step;
    this.setState({
      step: prev_step
    })
  }

  toggleMode(e) {
    let element = e.target.closest('a'),
      mode = element.getAttribute('data-mode');
    this.setState((prevState, props) => {
      let newMode;
      if (mode !== prevState.mode) {
        newMode = mode;
      } else {
        newMode = prevState.mode
      }
      return {
        mode: newMode
      }
    });
  }

  render() {
    if (this.state.schemaJSON === undefined) {
      return(
        <div className="protograph-loader-container">
          {
            !this.state.errorOnFetchingData ?
              "Loading"
            :
              <div className="ui basic message">
                <div className="header">
                  Failed to load resources
                </div>
                <p>Try clearing your browser cache and refresh the page.</p>
              </div>
          }
        </div>
      );
    } else {
      const referenceFormData = JSON.parse(JSON.stringify(this.state.dataJSON.mandatory_config));
      return (
        <div className="proto-container">
          <div className="ui grid form-layout">
            <div className="row">
              <div className="four wide column proto-card-form">
                <div>
                  <div className="section-title-text">Fill the form</div>
                  <div className="ui label proto-pull-right">
                    toTimeline
                  </div>
                </div>
                <JSONSchemaForm
                  schema={this.renderSchemaJSON()}
                  onSubmit = {((e) => this.onSubmitHandler(e))}
                  onChange = {((e) => this.onChangeHandler(e))}
                  formData={this.getFormData()}
                  referenceFormData={referenceFormData}
                  uiSchema={this.state.uiSchemaJSON}
                  transformErrors={this.transformErrors}>
                  <a id="protograph_prev_link" onClick = {((e) => this.onPrevHandler(e))}>{this.showLinkText()} </a>
                  <button type="submit" className="ui primary button">{this.showButtonText()}</button>
                </JSONSchemaForm>
              </div>
              <div className="twelve wide column proto-card-preview proto-share-card-div">
                <div className="protograph-menu-container">
                  <div className="ui compact menu">
                    <a className={`item ${this.state.mode === 'laptop' ? 'active' : ''}`}
                      data-mode='laptop'
                      onClick={this.toggleMode}
                    >
                      <i className="desktop icon"></i>
                    </a>
                    <a className={`item ${this.state.mode === 'mobile' ? 'active' : ''}`}
                      data-mode='mobile'
                      onClick={this.toggleMode}
                    >
                      <i className="mobile icon"></i>
                    </a>
                  </div>
                </div>
                {/* {this.renderLaptop()} */}
                <TimelineCard
                  mode={this.state.mode}
                  dataJSON={this.state.dataJSON}
                  schemaJSON={this.state.schemaJSON}
                  optionalConfigJSON={this.state.optionalConfigJSON}
                  optionalConfigSchemaJSON={this.state.optionalConfigSchemaJSON}
                  languageTexts={this.state.languageTexts}
                />
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
