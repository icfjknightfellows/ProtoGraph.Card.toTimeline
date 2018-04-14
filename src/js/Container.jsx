import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import dateformat from 'dateformat';

export default class TimelineCard extends React.Component {
  constructor(props) {
    super(props)

    let stateVar = {
      fetchingData: true,
      dataJSON: {
        data: {},
        mandatory_config: {}
      },
      optionalConfigJSON: {},
      languageTexts: {},
      siteConfigs: this.props.siteConfigs,
      ready:false,
      curr: 1
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    if (this.props.languageTexts) {
      stateVar.languageTexts = this.props.languageTexts;
    }

    this.state = stateVar;
  }

  exportData() {
    return document.getElementById('protograph_div').getBoundingClientRect();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.optionalConfigJSON) {
     this.setState({
       optionalConfigJSON: nextProps.optionalConfigJSON
     });
    }
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    if (this.state.fetchingData){
      let items_to_fetch = [
        axios.get(this.props.dataURL)
      ];

      if (this.props.siteConfigURL) {
        items_to_fetch.push(axios.get(this.props.siteConfigURL));
      }
      axios.all(items_to_fetch).then(axios.spread((card, site_configs) => {
          let stateVar = {
            fetchingData: false,
            dataJSON: {
              data: card.data.data,
              mandatory_config: card.data.mandatory_config
            },
            optionalConfigJSON: {},
            siteConfigs: site_configs ? site_configs.data : this.state.siteConfigs
          };

          stateVar.dataJSON.mandatory_config.language = stateVar.siteConfigs.primary_language.toLowerCase();
          stateVar.languageTexts = this.getLanguageTexts(stateVar.dataJSON.mandatory_config.language);

          stateVar.optionalConfigJSON.start_button_color = stateVar.siteConfigs.house_colour;
          stateVar.optionalConfigJSON.start_button_text_color = stateVar.siteConfigs.font_colour;
          this.setState(stateVar);
        }));
    }
  }

  getLanguageTexts(languageConfig) {
    let language = languageConfig ? languageConfig : "english",
      text_obj;
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
    return text_obj;
  }

  componentDidUpdate(){
    let events = Array.prototype.slice.call(document.getElementsByClassName('proto-single-event')),
    card = document.getElementsByClassName('proto-timeline-card')[0],
    min = Infinity,
    event;
    if(!card){
      return;
    }
    Array.prototype.slice.call(document.getElementsByClassName('active')).forEach((e)=>{
      e.classList.remove('active');
    })
    events.forEach((e)=>{
      let top = e.getBoundingClientRect().top;
      if(top > 0 &&  top < min){
        event = e;
        min = top;
      }
    })
    if ((card.scrollHeight - card.clientHeight) === card.scrollTop) {
      event = events[events.length - 1];
    }
    event.classList.add('active');
  }
  handleScroll(){
    let events = Array.prototype.slice.call(document.getElementsByClassName('proto-single-event')),
    card = document.getElementsByClassName('proto-timeline-card')[0],
    min = Infinity,
    event, curr;
    Array.prototype.slice.call(document.getElementsByClassName('active')).forEach((e)=>{
      e.classList.remove('active');
    })
    events.forEach((e,i)=>{
      let top = e.getBoundingClientRect().top;
      if(top > 0 &&  top < min){
        event = e;
        min = top;
        curr = i+1;
      }
    })
    if ((card.scrollHeight - card.clientHeight) === card.scrollTop) {
      event = events[events.length - 1];
      curr = events.length;
    }
    event.classList.add('active');
    this.setState({
      curr:curr
    })
  }
  
  matchDomain(domain, url) {
    let url_domain = this.getDomainFromURL(url).replace(/^(https?:\/\/)?(www\.)?/, ''),
      domain_has_subdomain = this.subDomain(domain),
      url_has_subdomain = this.subDomain(url_domain);
    if (domain_has_subdomain) {
      return (domain === url_domain) || (domain.indexOf(url_domain) >=0 );
    }
    if (url_has_subdomain) {
      return (domain === url_domain) || (url_domain.indexOf(domain) >=0 )
    }
    return (domain === url_domain)
  }
  getDomainFromURL(url) {
    let a = document.createElement('a');
    a.href = url;
    return a.hostname;
  }
  subDomain(url) {
    if(!url){
      url = "";
    }
    // IF THERE, REMOVE WHITE SPACE FROM BOTH ENDS
    url = url.replace(new RegExp(/^\s+/), ""); // START
    url = url.replace(new RegExp(/\s+$/), ""); // END

    // IF FOUND, CONVERT BACK SLASHES TO FORWARD SLASHES
    url = url.replace(new RegExp(/\\/g), "/");

    // IF THERE, REMOVES 'http://', 'https://' or 'ftp://' FROM THE START
    url = url.replace(new RegExp(/^http\:\/\/|^https\:\/\/|^ftp\:\/\//i), "");

    // IF THERE, REMOVES 'www.' FROM THE START OF THE STRING
    url = url.replace(new RegExp(/^www\./i), "");

    // REMOVE COMPLETE STRING FROM FIRST FORWARD SLASH ON
    url = url.replace(new RegExp(/\/(.*)/), "");

    // REMOVES '.??.??' OR '.???.??' FROM END - e.g. '.CO.UK', '.COM.AU'
    if (url.match(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i))) {
      url = url.replace(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i), "");

      // REMOVES '.??' or '.???' or '.????' FROM END - e.g. '.US', '.COM', '.INFO'
    } else if (url.match(new RegExp(/\.[a-z]{2,4}$/i))) {
      url = url.replace(new RegExp(/\.[a-z]{2,4}$/i), "");
    }

    // CHECK TO SEE IF THERE IS A DOT '.' LEFT IN THE STRING
    var subDomain = (url.match(new RegExp(/\./g))) ? true : false;

    return (subDomain);
  }
  flipper(){
    document.getElementsByClassName('proto-totimelinecard')[0].classList.add('proto-flipped');
    this.setState({ready:true})
  }
  renderColSeven() {
    if (this.state.fetchingData){
      return(<div>Loading</div>)
    } else {
      let data = this.state.dataJSON,
          topDate = data.data.events[0].single_event.timestamp_date,
          bottomDate = data.data.events[data.data.events.length - 1].single_event.timestamp_date,
          topLabel = dateformat(new Date(topDate), "mmm yyyy"),
          bottomLabel = dateformat(new Date(bottomDate), "mmm yyyy"),
          percent = 100*(this.state.curr / data.data.events.length)+"%",
          genreColor = this.state.optionalConfigJSON.house_colour,
          genreFontColor = this.state.optionalConfigJSON.font_colour;
        if(!this.state.dataJSON.mandatory_config.interactive){
          genreColor = "rgba(51, 51, 51, 0.75)",
          genreFontColor = "#fff";
        }
        if(this.state.dataJSON.mandatory_config.sponsored){
          genreColor = this.state.optionalConfigJSON.reverse_house_colour;
          genreFontColor = this.state.optionalConfigJSON.reverse_font_colour;
        }
        let fav = this.state.dataJSON.mandatory_config.faviconurl,
            str = this.state.dataJSON.mandatory_config.url,
            arr = str && str.split("/"),
            name = undefined,
            dom = arr && arr[2];
        if (this.matchDomain(this.state.domain, str)) {
          fav = undefined;
        }
        let series = window.vertical_name || this.state.dataJSON.mandatory_config.series,
        genre = this.state.dataJSON.mandatory_config.genre,
        padding = "1px 1px 1px 5px";
        if (!genre && series) {
          padding = "2.5px 5px";
        }
        if (!series && !genre) {
          padding = '0px';
        }
        if (genre && !series) {
          padding = "1px";
        }
        return(
          <div className="proto-totimelinecard proto-parent-card-desktop">
            <div className="proto-first-view proto-view">
              <div className="proto-col-3 proto-view-in-desktop">
                <div className="proto-card-tags">
                  {fav ?
                  <div className="proto-publisher-icon" style={{backgroundColor:this.state.dataJSON.mandatory_config.iconbgcolor || 'white'}}>
                    <img className="proto-favicon" src = {fav}/>
                  </div> : null}
                  <div className="proto-series-name" style={{ padding: padding }}>{series}{genre ? <div className="proto-genre" style={{backgroundColor: genreColor, color: genreFontColor, marginLeft: series?'3px' :'0px' }}>
                    {genre } </div> : null}
                    </div>
                      <div className="proto-sub-genre-dark" style={{fontStyle:this.state.dataJSON.mandatory_config.sponsored? 'italic': 'normal', textDecoration:this.state.dataJSON.mandatory_config.sponsored? 'underline' : 'none'}}>
                        {this.state.dataJSON.mandatory_config.sponsored ?'Sponsored': this.state.dataJSON.mandatory_config.subgenre}
                      </div>
                </div>
                <div className="proto-cover-content">
                  <div className="proto-title">{data.mandatory_config.timeline_title}</div>
                  <div className="proto-description">{data.mandatory_config.timeline_description}</div>
                  <div onClick={()=>{this.flipper()}} className="proto-call-to-action-button">{this.state.languageTexts.button_text}</div>
                </div>
              </div>
              <div className="proto-col-4">
                <div className="proto-cover-image">
                  <img className="proto-image" src={data.mandatory_config.timeline_image}/>
                </div>
              </div>
            </div>
            <div className="proto-second-view proto-view">
              <div className="proto-col-3 proto-view-in-desktop">
                <div className="proto-tag-area"></div>
                <div className="proto-cover-content">
                  <div className="proto-title">{data.mandatory_config.timeline_title}</div>
                  <div className="proto-description">{data.mandatory_config.timeline_description}</div>
                </div>
              </div>
              <div className="proto-col-4" onScroll={()=>this.handleScroll()}>
                <div className="proto-progress-line" id="proto_progress_desktop">
                  <div className="proto-progress-start-lable">{topLabel}</div>
                  <div className="proto-progress-container">
                    <div className="proto-progress-after" style={{height: percent}}></div>
                    <div className="proto-progress"></div>
                  </div>
                  <div className="proto-progress-end-lable">{bottomLabel}</div>
                </div>
                <div className="proto-main-content">
                  <div className="proto-timeline-card">
                    {
                      data.data.events.map((d,i)=>{
                        let date = dateformat(new Date(d.single_event.timestamp_date), "mmm dd, yyyy")
                        return(
                          <div key={i} className="proto-single-event">
                            <div className="proto-timeline-time">{date}</div>
                            <div className="proto-quiz-answer">
                              {d.single_event.header}
                            </div>
                            {d.single_event.photo && <div className="proto-quiz-answer-image">
                              <img src={d.single_event.photo} className="proto-image" />
                            </div>}
                            <p>
                              {d.single_event.message}
                            </p>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  renderColFour() {
    if (this.state.fetchingData){
      return(<div>Loading</div>)
    } else {
      let data = this.state.dataJSON,
          topDate = data.data.events[0].single_event.timestamp_date,
          bottomDate = data.data.events[data.data.events.length - 1].single_event.timestamp_date,
          topLabel = dateformat(new Date(topDate), "mmm yyyy"),
          bottomLabel = dateformat(new Date(bottomDate), "mmm yyyy"),
          percent = 100*(this.state.curr / data.data.events.length)+"%",
          genreColor = this.state.optionalConfigJSON.house_colour,
          genreFontColor = this.state.optionalConfigJSON.font_colour;
        if(!this.state.dataJSON.mandatory_config.interactive){
          genreColor = "rgba(51, 51, 51, 0.75)",
          genreFontColor = "#fff";
        }
        if(this.state.dataJSON.mandatory_config.sponsored){
          genreColor = this.state.optionalConfigJSON.reverse_house_colour;
          genreFontColor = this.state.optionalConfigJSON.reverse_font_colour;
        }
        let fav = this.state.dataJSON.mandatory_config.faviconurl,
            str = this.state.dataJSON.mandatory_config.url,
            arr = str && str.split("/"),
            name = undefined,
            dom = arr && arr[2];
        if (this.matchDomain(this.state.domain, str)) {
          fav = undefined;
        }
        let series = window.vertical_name || this.state.dataJSON.mandatory_config.series,
        genre = this.state.dataJSON.mandatory_config.genre,
        padding = "1px 1px 1px 5px";
        if (!genre && series) {
          padding = "2.5px 5px";
        }
        if (!series && !genre) {
          padding = '0px';
        }
        if (genre && !series) {
          padding = "1px";
        }
        return(
          <div className="proto-totimelinecard proto-parent-card-mobile">
            <div className="proto-first-view proto-view">
              <div className="proto-col-4">
                <div className="proto-cover-image">
                  <img style={{height:"100%", width:"100%"}} src={data.mandatory_config.timeline_image}/>
                  <div className="proto-card-tags proto-card-tags-mobile">
                    {fav ?
                    <div className="proto-publisher-icon" style={{backgroundColor:this.state.dataJSON.mandatory_config.iconbgcolor || 'white'}}>
                      <img className="proto-favicon" src = {fav}/>
                    </div> : null}
                    <div className="proto-series-name" style={{ padding: padding }}>{series}{genre ? <div className="proto-genre" style={{backgroundColor: genreColor, color: genreFontColor, marginLeft: series?'3px' :'0px' }}>
                      {genre } </div> : null}
                      </div>
                      <div className="proto-sub-genre-light" style={{fontStyle:this.state.dataJSON.mandatory_config.sponsored? 'italic': 'normal', textDecoration:this.state.dataJSON.mandatory_config.sponsored? 'underline' : 'none'}}>
                          {this.state.dataJSON.mandatory_config.sponsored ?'Sponsored': this.state.dataJSON.mandatory_config.subgenre}
                      </div>
                  </div>
                  <div className="proto-black-overlay">
                    <div className="proto-cover-content">
                      <div className="proto-title proto-font-white">{data.mandatory_config.timeline_title}</div>
                      <div className="proto-description proto-font-white">{data.mandatory_config.timeline_description}</div>
                      <div onClick={()=>{this.flipper()}} className="proto-call-to-action-button">Let's time travel</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="proto-second-view proto-view">
              <div className="proto-col-4" onScroll={()=>this.handleScroll()}>
                <div className="proto-progress-line" id="proto_progress_mobile">
                  <div className="proto-progress-start-lable">{topLabel}</div>
                  <div className="proto-progress-container">
                    <div className="proto-progress-after" style={{height: percent}}></div>
                    <div className="proto-progress"></div>
                  </div>
                  <div className="proto-progress-end-lable">{bottomLabel}</div>
                </div>
                <div className="proto-main-content">
                  <div className="proto-timeline-card">
                    {
                      data.data.events.map((d,i)=>{
                        let date = dateformat(new Date(d.single_event.timestamp_date), "mmm dd, yyyy")
                        return(
                          <div key={i} className="proto-single-event">
                            <div className="proto-timeline-time">{date}</div>
                            <div className="proto-quiz-answer">
                              {d.single_event.header}
                            </div>
                            {d.single_event.photo && <div className="proto-quiz-answer-image">
                              <img src={d.single_event.photo} className="proto-image" />
                            </div>}
                            <p>
                              {d.single_event.message}
                            </p>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }


  render() {
    switch(this.props.mode) {
      case 'col7' :
        return this.renderColSeven();
        break;
      case 'col4' :
        return this.renderColFour();
        break;
    }
  }
}
