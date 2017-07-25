import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class ShareCard extends React.Component {
  constructor(props) {
    super(props)

    let stateVar = {
      fetchingData: true,
      dataJSON: {
        card_data: {},
        mandatory_config: {}
      },
      schemaJSON: undefined,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }

    if (this.props.schemaJSON) {
      stateVar.schemaJSON = this.props.schemaJSON;
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    if (this.props.optionalConfigSchemaJSON) {
      stateVar.optionalConfigSchemaJSON = this.props.optionalConfigSchemaJSON;
    }

    this.state = stateVar;
  }

  exportData() {
    return document.getElementById('protograph-div').getBoundingClientRect();
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    if (this.state.fetchingData){
      axios.all([axios.get(this.props.dataURL), axios.get(this.props.schemaURL), axios.get(this.props.optionalConfigURL), axios.get(this.props.optionalConfigSchemaURL)])
        .then(axios.spread((card, schema, opt_config, opt_config_schema) => {
          this.setState({
            fetchingData: false,
            dataJSON: {
              card_data: card.data.data,
              mandatory_config: card.data.mandatory_config
            },
            schemaJSON: schema.data,
            optionalConfigJSON: opt_config.data,
            optionalConfigSchemaJSON: opt_config_schema.data
          });
        }));
    }
  }

  getMonth(num) {
    switch(num) {
      case '01':
      return 'Jan';
      break;
      case '02':
      return 'Feb';
      break;
      case '03':
      return 'Mar';
      break;
      case '04':
      return 'Apr';
      break;
      case '05':
      return 'May';
      break;
      case '06':
      return 'Jun';
      break;
      case '07':
      return 'Jul';
      break;
      case '08':
      return 'Aug';
      break;
      case '09':
      return 'Sep';
      break;
      case '10':
      return 'Oct';
      break;
      case '11':
      return 'Nov';
      break;
      case '12':
      return 'Dec';
      break;
    }
  }

  injectImage(photoExists) {
    if (photoExists) {
      return <img className="event_photo" src={photoExists} />;
    }
    else {
      return null;
    }
  }

  injectYoutubeEmbed(urlExists) {
    var regex = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/;
    if(urlExists) {
      if(regex.test(urlExists)){
        let embedUrl = "https://www.youtube.com/embed/" + urlExists.split('=')[1];
        return <iframe className="youtube_embed" src={embedUrl} frameBorder="0" allowFullScreen></iframe>
      }
      else {
        return null;
      }
    }
    else {
      return null;
    }
  }

  handleScroll(e) {
    // e.preventDefault();
    document.getElementById('scroll_down_arrow').style.height = 0;
    document.getElementById('scroll_down_text').style.height = 0;
    document.getElementById('scroll_down_text').innerHTML = "";
    let events = Array.from(document.getElementsByClassName('event_message_div'));
    let visibleEvents = [];
    let circlePlots = document.getElementsByClassName('circle-plot');
    let container = document.getElementById('content_div');
    for(let event of events) {
      let offset = event.getBoundingClientRect().top - container.getBoundingClientRect().top + (event.getBoundingClientRect().height/2);
      if(offset > 0 && offset <= container.clientHeight) {
          visibleEvents.push(event);
      }
    }
    container.style.paddingBottom = `${container.getBoundingClientRect().height/2 - events[events.length-1].getBoundingClientRect().height/2}px`;
    let centralEvent;
    for(let visibleEvent of visibleEvents) {
      let offsetTop = visibleEvent.getBoundingClientRect().top - container.getBoundingClientRect().top;
      let offsetBottom = visibleEvent.getBoundingClientRect().top - container.getBoundingClientRect().top + visibleEvent.getBoundingClientRect().height;
      if(offsetTop < container.getBoundingClientRect().height/2 && offsetBottom > container.getBoundingClientRect().height/2) {
        centralEvent = visibleEvent;
      }
    }
    // var that = this;
    // if(this.state.debounce === true) {
    //   document.getElementById('content_div').scrollTop = centralEvent.offsetTop;
    //   console.log("fired");
    //   this.setState({debounce: false});
    // }
    // setTimeout(function(){ that.setState({debounce: true}); }, 3000);
    for(let plot of circlePlots) {
      if(plot.id === centralEvent.id) {
        plot.style.fill = "red";
        if(centralEvent === document.getElementsByClassName('first-event')[0]) {
          document.getElementById('date_div').style.marginTop = "20px";
        }
        else {
          document.getElementById('date_div').style.marginTop = `${plot.getBoundingClientRect().top - container.getBoundingClientRect().top - 35}px`;
        }
      }
      else {
        plot.style.fill = "#C0C0C0";
      }
    }
    let timestamp = centralEvent.id.split('-');
    document.getElementById('month-div').innerHTML = this.getMonth(timestamp[1]);
    document.getElementById('day-div').innerHTML = timestamp[2];
    document.getElementById('year-div').innerHTML = timestamp[0];
    for(event of events) {
      if(event === centralEvent) {
        if(centralEvent === document.getElementsByClassName('first-event')[0]) {
          document.getElementById('scroll_down_arrow').style.height = "25px";
          document.getElementById('scroll_down_text').style.height = "20px";
          document.getElementById('scroll_down_text').innerHTML = "Scroll";
        }
        event.getElementsByClassName('message-timestamp')[0].style.color = "black";
        // event.getElementsByClassName('content-card')[0].style.boxShadow = "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)";
        // event.getElementsByClassName('content-card')[0].style.transition = "all 5s cubic-bezier(.25,.8,.25,1)";
        event.getElementsByClassName('content-card')[0].parentElement.style.opacity = "1";
      }
      else {
        event.getElementsByClassName('message-timestamp')[0].style.color = "#808080";
        // event.getElementsByClassName('content-card')[0].style.boxShadow = "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)";
        event.getElementsByClassName('content-card')[0].parentElement.style.opacity = "0.10";
      }
    }
  }

  moveEventToTop(e) {
    let element;
    if(e.target.classList.contains('event_message_div')) {
      element = e.target;
    }
    else if(e.target.parentElement.classList.contains('event_message_div')) {
      element = e.target.parentElement;
    }
    else {
      element = e.target.parentElement.parentElement;
    }
    document.getElementById('content_div').scrollTop = element.offsetTop;
    console.log(document.getElementById('content_div').scrollTop);
  }

  getEventYCoord(eventTimestamp, eventPoints) {
    for(let point of eventPoints) {
      if(point.timestamp === eventTimestamp) {
        return point.yCoord;
      }
    }
  }

  showMainCard(e) {
    let line_height = 500;
    document.getElementById('card_title_div').style.opacity = '0';
    setTimeout(function(){
      document.getElementById('card_title_div').style.display = 'none';
      document.getElementById('card_main_div').style.display = 'block';
    }, 500);
    setTimeout(function(){
      document.getElementById('card_main_div').style.opacity = '1';
    }, 515);
  }

  renderLaptop() {
    if (this.state.schemaJSON === undefined ){
      return(<div>Loading</div>)
    } else {
      console.log(this.state.dataJSON);
      // let styles = this.state.dataJSON.configs ? {backgroundColor: this.state.dataJSON.configs.background_color} : {undefined}
      let events = this.state.dataJSON.card_data.events;
      const line_height = 500;
      const extraLineSpace = 30;
      const svgWidth = 50;
      const msDay = 60*60*24*1000;
      let firstEventTimeComponents = events[0].single_event.timestamp_date.split('-');
      let lastEventTimeComponents = events[events.length-1].single_event.timestamp_date.split('-');
      let firstEventTimestamp = new Date(firstEventTimeComponents[0], firstEventTimeComponents[1], firstEventTimeComponents[2]);
      let lastEventTimeStamp = new Date(lastEventTimeComponents[0], lastEventTimeComponents[1], lastEventTimeComponents[2]);
      let maxTimeDifferenceInDays = Math.floor((lastEventTimeStamp - firstEventTimestamp)/msDay);
      let eventTimestamps = events.map(element => element.single_event.timestamp_date.split('-'));
      let eventPoints = [];
      for(var i = 0; i < eventTimestamps.length; i++) {
        let eventTimestamp = new Date(eventTimestamps[i][0], eventTimestamps[i][1], eventTimestamps[i][2])
        let timeDifference = Math.floor((eventTimestamp - firstEventTimestamp)/msDay);
        let newYCoord = 10;
        if(maxTimeDifferenceInDays != 0){
          newYCoord = ((timeDifference/maxTimeDifferenceInDays) * (line_height-2*extraLineSpace)) + extraLineSpace;
        }
        eventPoints.push({timestamp: eventTimestamps[i].join('-'), yCoord: newYCoord});
      }
      var that = this;
      let plotCircles = eventPoints.map((element, pos) => {
        if(pos == 0) {
          return <circle id={element.timestamp} className="circle-plot" cx={svgWidth/2} cy={element.yCoord} r="5" fill="red"/>;
        }
        else {
          return <circle id={element.timestamp} className="circle-plot" cx={svgWidth/2} cy={element.yCoord} r="5" fill="#C0C0C0" />
        }
      });
      let assetIcons = events.map((element, pos) => {
        if(element.single_event.youtube_url){
          return (
            <svg id={element.timestamp} className="asset-svg" dangerouslySetInnerHTML={{__html: "<image" + " x=" + (svgWidth/2 - 25) + " y=" + (that.getEventYCoord(element.single_event.timestamp_date, eventPoints) - 7) + " width=15" + " height=15" + " xlink:href='/src/images/play.svg' />"}}/>

          );
        }
        if(element.single_event.photo){
          return (
            <svg id={element.timestamp} className="asset-svg" dangerouslySetInnerHTML={{__html: "<image" + " x=" + (svgWidth/2 - 25) + " y=" + (that.getEventYCoord(element.single_event.timestamp_date, eventPoints) - 7) + " width=15" + " height=15" + " xlink:href='/src/images/image.svg' />"}}/>
          );
        }
      });
      let onStartStyle = {opacity: "0.10"};
      let eventDetails = events.map((element, pos) => {
        let timestampComponents = element.single_event.timestamp_date.split('-');
        let timestamp = `${that.getMonth(timestampComponents[1])} ${timestampComponents[2]}, ${timestampComponents[0]}`;
        if(pos == 0) {
            return (
              <div id={element.single_event.timestamp_date} className="event_message_div first-event" onClick={(e) => that.moveEventToTop(e)} style={{marginTop: line_height/2 - 51}} >
                <div id="scroll_down_indicator">
                  <p id="scroll_down_text" style={{marginBottom: "2px", height: "20px"}}>Scroll</p>
                  <svg id="scroll_down_arrow" height="25px" width="25px" viewBox="0 0 100 100">
                    <line x1="10" y1="10" x2="50" y2="50" style={{stroke:"black", strokeWidth:5}} />
                    <line x1="50" y1="50" x2="90" y2="10" style={{stroke:"black", strokeWidth:5}} />
                    <line x1="10" y1="30" x2="50" y2="70" style={{stroke:"black", strokeWidth:5}} />
                    <line x1="50" y1="70" x2="90" y2="30" style={{stroke:"black", strokeWidth:5}} />
                  </svg>
                </div>
                <p className="message-timestamp" style={{color: "black"}}>{timestamp}</p>
                <div className="content-card">
                  <p>{element.single_event.message}</p>
                  {that.injectImage(element.single_event.photo)}
                  {that.injectYoutubeEmbed(element.single_event.youtube_url)}
                </div>
              </div>
            );
        }
        else {
          return (
            <div id={element.single_event.timestamp_date} className="event_message_div" onClick={(e) => that.moveEventToTop(e)} style={onStartStyle}>
              <p className="message-timestamp">{timestamp}</p>
              <div className="content-card">
                <p>{element.single_event.message}</p>
                {that.injectImage(element.single_event.photo)}
                {that.injectYoutubeEmbed(element.single_event.youtube_url)}
              </div>
            </div>
          );
        }
      });
      let yearCountText = [];
      for(let i = 0; i < events.length - 1; i++) {
        let currentEventComponents = events[i].single_event.timestamp_date.split('-');
        let nextEventComponents = events[i+1].single_event.timestamp_date.split('-');
        let currentEvent = new Date(currentEventComponents[0], currentEventComponents[1], currentEventComponents[2]);
        let nextEvent = new Date(nextEventComponents[0], nextEventComponents[1], nextEventComponents[2]);
        let ranges = [];
        if(Math.round((nextEvent - currentEvent)/(msDay*365)) >= 5) {
          let j;
          for(j = 0; j < eventPoints.length; j++) {
            if(eventPoints[j].timestamp === events[i].single_event.timestamp_date) {
              ranges.push({start: eventPoints[j].yCoord, end: eventPoints[j+1].yCoord, years: Math.round((nextEvent - currentEvent)/(msDay*365))})
            }
          }
          for(j = 0; j < ranges.length; j++) {
            let textPosition = ranges[j].start + (ranges[j].end - ranges[j].start)/2;
            let rotateBy = `rotate(180 ${svgWidth/2},${textPosition})`;
            yearCountText.push(<text fontSize="12" writingMode="tb-rl" textAnchor="middle" x={svgWidth/2 + 10} y={textPosition} fill="#C0C0C0" transform={rotateBy}>{ranges[j].years} years</text>);
          }
        }
      }
      return (
        <div id="protograph_div" className = "protograph-card-div">
          <div id="card_title_div">
            <div id="timeline_details_div">
              <h1>{this.state.dataJSON.mandatory_config.timeline_title}</h1>
              <p>{this.state.dataJSON.mandatory_config.timeline_description}</p>
            </div>
            <div id="timeline_image_div">
              <img className="timeline_image" src={this.state.dataJSON.mandatory_config.timeline_image}/>
            </div>
            <button id="show_main_card_button" onClick={(e) => that.showMainCard(e)}>Lets time travel</button>
          </div>
          <div id="card_main_div">
            <div id="date_div">
              <div id="month-div">{this.getMonth(firstEventTimeComponents[1])}</div>
              <div id="day-div">{firstEventTimeComponents[2]}</div>
              <div id="year-div">{firstEventTimeComponents[0]}</div>
            </div>
            <div id="timeline_svg_div">
              <p id="initial_timestamp">{firstEventTimeComponents[0]}</p>
              <svg id="timeline_svg" height={line_height} width={svgWidth}>
                <line x1={svgWidth/2} y1="0" x2={svgWidth/2} y2={line_height} style={{stroke: "#dcdcdc", strokeWidth: "1"}} />
                <g>
                  {plotCircles}
                  {assetIcons}
                  {yearCountText}
                </g>
              </svg>
              <p id="final_timestamp">{lastEventTimeComponents[0]}</p>
            </div>
            <div id="content_div" onScroll={(e) => that.handleScroll(e)}>
              {eventDetails}
            </div>
          </div>
      </div>
      )
    }
  }

  renderMobile() {
    if (this.state.schemaJSON === undefined ){
      return(<div>Loading</div>)
    } else {
    }
  }

  renderScreenshot() {}

  render() {
    switch(this.props.mode) {
      case 'laptop' :
        return this.renderLaptop();
        break;
      case 'mobile' :
        return this.renderMobile();
        break;
      case 'screenshot' :
        return this.renderScreenshot();
        break;
    }
  }
}
