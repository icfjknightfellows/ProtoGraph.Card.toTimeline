import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

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
      siteConfigs: this.props.siteConfigs
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

  // componentDidUpdate() {
  //   if (this.props.mode === 'mobile') {
  //     let elems = Array.from(document.querySelectorAll('.protograph-event-message-div'));
  //     elems.forEach((elem) => {
  //       this.multiLineTruncate(elem.querySelector('.protograph-content-card').querySelector('.protograph-content-card-text'), elem);
  //     });
  //   }
  // }

  // multiLineTruncate(el, parent) {
  //   let data = this.state.dataJSON.data.events.find(element => {
  //     return element.single_event.timestamp_date === parent.id;
  //   }),
  //     wordArray = data.single_event.message.split(' '),
  //     props = this.props,
  //     // height = this.props.mode === 'laptop' ?  document.getElementById('protograph_card_title_div').clientHeight : (document.getElementById('protograph_div').clientHeight);
  //     height = 420;
  //   while(parent.getBoundingClientRect().height > height) {
  //     wordArray.pop();
  //     el.innerHTML = wordArray.join(' ') + '...' + '<br><button id="protograph_read_more_button" class="protograph-read-more-button">View more</button>' ;
  //     if(wordArray.length <= 0) {
  //       break;
  //     }
  //   }
  //   if(el.querySelector('.protograph-read-more-button') !== null){
  //     el.querySelector('.protograph-read-more-button').addEventListener('click', function() {
  //       el.querySelector('.protograph-read-more-button').style.display = 'none'
  //       el.style.height = 'auto';
  //       el.innerHTML = data.single_event.message;
  //       if(typeof props.clickCallback === 'function') {
  //         props.clickCallback();
  //       }
  //     });
  //   }
  // }

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

  injectImage(photoExists, captionExists) {
    if (photoExists) {
      if(this.props.mode === 'laptop') {
        return (
          <div style={{marginBottom: 10}}>
          <img className="protograph-event-photo" src={photoExists} /> {
            captionExists &&
              <h6 className='ui header'>{captionExists}</h6>
          }
          </div>
        )
      }
      else {
        return (
          <div style={{marginBottom: 10}}>
          <img className="protograph-event-photo" src={photoExists} /> {
            captionExists &&
              <h6 className='ui header'>{captionExists}</h6>
          }
          </div>
        )
      }
    }
    else {
      return null;
    }
  }

  injectYoutubeEmbed(urlExists, captionExists) {
    var regex = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/;
    if(urlExists) {
      if(regex.test(urlExists)){
        let embedUrl = "https://www.youtube.com/embed/" + urlExists.split('=')[1];
        if(this.props.mode === 'laptop') {
          return (
            <div style={{marginBottom: 10}}>
              <iframe className="protograph-youtube-embed" src={embedUrl} frameBorder="0" allowFullScreen></iframe> {
                captionExists &&
                  <h6 className='ui header'>{captionExists}</h6>
              }
            </div>
          )
        }
        else {
          return (
            <div style={{marginBottom: 10}}>
              <iframe className="protograph-youtube-embed" src={embedUrl} frameBorder="0" allowFullScreen></iframe> {
                captionExists &&
                  <h6 className='ui header'>{captionExists}</h6>
              }
            </div>
          )
        }
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
    document.getElementById('protograph_scroll_down_arrow').style.height = 0;
    document.getElementById('protograph_scroll_down_text').style.height = 0;
    document.getElementById('protograph_scroll_down_text').innerHTML = "";
    let events = Array.from(document.getElementsByClassName('protograph-event-message-div'));
    let visibleEvents = [];
    let circlePlots = Array.from(document.getElementsByClassName('protograph-circle-plot'));
    let layoverPlots = Array.from(document.getElementsByClassName('protograph-layover-plot'));
    let container = document.getElementById('protograph_content_div');
    let containerTop = container.getBoundingClientRect().top;
    let containerBottom = container.getBoundingClientRect().bottom;
    let visibilityFrameSize = 200;
    events.forEach((event) => {
      let offset = event.getBoundingClientRect().top - container.getBoundingClientRect().top + (event.getBoundingClientRect().height/2);
      let eventTop = event.getBoundingClientRect().top;
      let eventBottom = event.getBoundingClientRect().bottom;
      if(eventTop < containerBottom && eventBottom > containerTop) {
        visibleEvents.push(event);
      }
    });
    container.style.paddingBottom = `${container.getBoundingClientRect().height/2 - events[events.length-1].getBoundingClientRect().height/2}px`;
    let centralEvents = [];
    visibleEvents.forEach((visibleEvent) => {
      let scanLine = (container.getBoundingClientRect().bottom + container.getBoundingClientRect().top)/2;
      let eventTop = visibleEvent.getBoundingClientRect().top;
      let eventBottom = visibleEvent.getBoundingClientRect().bottom;
      if((eventTop < (scanLine + visibilityFrameSize/2) && eventBottom > (scanLine + visibilityFrameSize/2)) || (eventTop < (scanLine - visibilityFrameSize/2) && eventBottom > (scanLine - visibilityFrameSize/2)) || (eventTop > (scanLine - visibilityFrameSize/2) && eventBottom < (scanLine + visibilityFrameSize/2))) {
        centralEvents.push(visibleEvent);
      }
    });
    circlePlots.forEach((plot) => {
      if(centralEvents[0] && (plot.id === centralEvents[0].id)) {
        if(!document.getElementById(`${plot.cx.animVal.value}_${plot.cy.animVal.value}`)) {
          let svg = document.getElementById('protograph_svg_group');
          let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute('cx',plot.cx.animVal.value);
          circle.setAttribute('cy',plot.cy.animVal.value);
          circle.setAttribute('r',plot.r.animVal.value);
          circle.setAttribute('fill','red');
          circle.setAttribute('class','protograph-layover-plot');
          circle.setAttribute('id', `${plot.cx.animVal.value}_${plot.cy.animVal.value}`);
          circle.setAttribute('data-timestamp', `${centralEvents[0].id}`)
          svg.appendChild(circle);
        }
        plot.style.fill = "red";
        if(centralEvents[0] === document.getElementsByClassName('protograph-first-event')[0] && this.props.mode === 'laptop') {
          document.getElementById('protograph_date_div').style.marginTop = "20px";
        }
        else if (this.props.mode === 'laptop') {
          document.getElementById('protograph_date_div').style.marginTop = `${plot.getBoundingClientRect().top - container.getBoundingClientRect().top - 35}px`;
        }
      }
      else {
        plot.style.fill = "#C0C0C0";
      }
    });
    layoverPlots.forEach((plot) => {
      if(plot.dataset.timestamp !== centralEvents[0].id) {
        plot.parentElement.removeChild(plot);
      }
    });
    if(centralEvents[0]) {
      let timestamp = centralEvents[0].id.split('-');
      if(this.props.mode === 'laptop') {
        document.getElementById('protograph_month_div').innerHTML = this.getMonth(timestamp[1]);
        document.getElementById('protograph_day_div').innerHTML = timestamp[2];
        document.getElementById('protograph_year_div').innerHTML = timestamp[0];
      }
    }
    events.forEach((event) => {
      if(centralEvents.includes(event)) {
        event.getElementsByClassName('protograph-message-timestamp')[0].style.color = "black";
        if(event === centralEvents[0]) {
          // event.getElementsByClassName('protograph-message-timestamp')[0].style.fontWeight = "bold";
        }
        else {
          event.getElementsByClassName('protograph-message-timestamp')[0].style.fontWeight = "normal";
        }
        event.getElementsByClassName('protograph-content-card')[0].parentElement.style.opacity = "1";
      }
      else {
        event.getElementsByClassName('protograph-message-timestamp')[0].style.color = "#808080";
        event.getElementsByClassName('protograph-content-card')[0].parentElement.style.opacity = "0.10";
      }
    });
  }

  getEventYCoord(eventTimestamp, eventPoints) {
    for(let i = 0; i < eventPoints.length; i++) {
      if(eventPoints[i].timestamp === eventTimestamp) {
        return eventPoints[i].yCoord;
      }
    }
  }

  showMainCard(e) {
    let line_height = 390,
    // let line_height = 340,
      hideTitlePage = this.props.mode === 'laptop' ? document.getElementById('protograph_card_title_div') : document.getElementById('protograph_card_title_div_mobile');
    hideTitlePage.style.opacity = '0';
    let that = this;
    setTimeout(function(){
      hideTitlePage.style.display = 'none';
      that.props.mode === 'laptop' ? document.getElementById('protograph_card_main_div').style.display = 'flex' : document.getElementById('protograph_card_main_div').style.display = 'block';
      if(that.props.mode === 'mobile') {
        document.getElementById('protograph_card_title_div_gradient').style.display = 'none';
      }
    }, 500);
    setTimeout(function(){
      document.getElementById('protograph_div').style.background = '#f5f5f5';
      that.props.mode === 'laptop' ? document.getElementById('protograph_card_main_div').style.display = 'flex' : document.getElementById('protograph_card_main_div').style.display = 'block';
      if(that.props.mode === 'mobile') {
        document.querySelector('.protograph-card-div.protograph-mobile-mode').style.padding = '0 10px';
      }
    }, 515);
  }

  smoothScrollTo(element, to, duration) {
    if (duration <= 0) return;
    let difference = to - element.scrollTop;
    let perTick = difference / duration * 10;
    let that = this;
    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        that.smoothScrollTo(element, to, duration - 10);
    }, 10);
}

  handleEventCircleClick(e) {
    let events = Array.from(document.getElementsByClassName('protograph-event-message-div'));
    let circlePlots = Array.from(document.getElementsByClassName('protograph-circle-plot'));
    let selectedEvent = events.find((event) => {
      if(event.id === e.target.id) {
        return event;
      }
    });
    let currentPlot = circlePlots.find((plot) => {
      if(plot.style.fill === 'red') {
        return plot;
      }
    });
    let maxDifference = Math.abs(circlePlots.indexOf(circlePlots[circlePlots.length - 1]) - circlePlots.indexOf(circlePlots[0]));
    let difference = Math.abs(circlePlots.indexOf(e.target) - circlePlots.indexOf(currentPlot));
    let scrollDuration = (difference*1000)/maxDifference;
    this.smoothScrollTo(document.getElementById('protograph_content_div'), selectedEvent.offsetTop - 60, scrollDuration);
  }

  moveEventToTop(e) {
    let element;
    if(e.target.classList.contains('protograph-event-message-div')) {
      element = e.target;
    }
    else if(e.target.parentElement.classList.contains('protograph-event-message-div')) {
      element = e.target.parentElement;
    }
    else {
      element = e.target.parentElement.parentElement;
    }
    this.smoothScrollTo(document.getElementById('protograph_content_div'), element.offsetTop - 60, 250);
  }

  handleEventCircleEnter(e) {
    e.target.style.r = '7';
  }

  handleEventCircleLeave(e, prevFill) {
    e.target.style.r = '5';
  }

  renderLaptop() {
    if (this.state.fetchingData){
      return(<div>Loading</div>)
    } else {
      // let styles = this.state.dataJSON.configs ? {backgroundColor: this.state.dataJSON.configs.background_color} : {undefined}
      console.log(this.state.dataJSON);
      let events = this.state.dataJSON.data.events;
      const line_height = 390;
      // const line_height = 340;
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
          return <circle id={element.timestamp} key={element.timestamp} className="protograph-circle-plot" cx={svgWidth/2} cy={element.yCoord} r="5" style={{fill: "red"}} onClick={(e) => that.handleEventCircleClick(e)} onMouseEnter={(e) => that.handleEventCircleEnter(e)} onMouseLeave={(e) => that.handleEventCircleLeave(e)} />;
        }
        else {
          return <circle id={element.timestamp} key={element.timestamp} className="protograph-circle-plot" cx={svgWidth/2} cy={element.yCoord} r="5" style={{fill: "#C0C0C0"}} onClick={(e) => {that.handleEventCircleClick(e)}} onMouseEnter={(e) => that.handleEventCircleEnter(e)} onMouseLeave={(e) => that.handleEventCircleLeave(e)} />
        }
      });
      let assetIcons = events.map((element, pos) => {
        if(element.single_event.youtube_url){
          return (
            <svg id={element.timestamp} key={element.timestamp} className="protograph-asset-svg" dangerouslySetInnerHTML={{__html: "<image" + " x=" + (svgWidth/2 - 20) + " y=" + (that.getEventYCoord(element.single_event.timestamp_date, eventPoints) - 7) + " width=15" + " height=15" + " xlink:href='src/images/play.svg' />"}}/>

          );
        }
        if(element.single_event.photo){
          return (
            <svg id={element.timestamp} key={element.timestamp} className="protograph-asset-svg" dangerouslySetInnerHTML={{__html: "<image" + " x=" + (svgWidth/2 - 20) + " y=" + (that.getEventYCoord(element.single_event.timestamp_date, eventPoints) - 7) + " width=15" + " height=15" + " xlink:href='src/images/image.svg' />"}}/>
          );
        }
      });
      let onStartStyle = {opacity: "0.10"};
      let eventDetails = events.map((element, pos) => {
        let timestampComponents = element.single_event.timestamp_date.split('-');
        let timestamp = `${that.getMonth(timestampComponents[1])} ${timestampComponents[2]}, ${timestampComponents[0]}`;
        let asset = that.injectYoutubeEmbed(element.single_event.youtube_url, element.single_event.media_caption) ?  that.injectYoutubeEmbed(element.single_event.youtube_url, element.single_event.media_caption) : that.injectImage(element.single_event.photo, element.single_event.media_caption);
        // let textStyle = (asset != null) ? {display: "inline-block", width: "48%", marginRight: "4%"} : {undefined};
        let textStyle = (asset != null) ? {marginRight: "4%"} : {undefined};
        if(pos == 0) {
            return (
              <div id={element.single_event.timestamp_date} key={element.single_event.timestamp_date} className="protograph-event-message-div protograph-first-event" style={{marginTop: line_height/2 - 51}} onClick={(e) => that.moveEventToTop(e)} >
                <p className="protograph-message-timestamp" style={{color: "black"}}>{timestamp}</p>
                <div className="protograph-content-card protograph-laptop-mode">
                  <div className="protograph-content-card-details">
                    { typeof element.single_event.header !== "undefined" && element.single_event.header !== "" &&
                      <h3 className='ui header'>{element.single_event.header}</h3>
                    }
                    <p className="protograph-content-card-text">{element.single_event.message}</p>
                  </div>
                  {asset}
                </div>
                <div id="protograph_scroll_down_indicator">
                  <p id="protograph_scroll_down_text" style={{marginBottom: "2px", height: "20px"}}>Scroll</p>
                  <svg id="protograph_scroll_down_arrow" height="25px" width="25px" viewBox="0 0 100 100">
                    <line x1="10" y1="10" x2="50" y2="50" style={{stroke:"black", strokeWidth:5}} />
                    <line x1="50" y1="50" x2="90" y2="10" style={{stroke:"black", strokeWidth:5}} />
                    <line x1="10" y1="30" x2="50" y2="70" style={{stroke:"black", strokeWidth:5}} />
                    <line x1="50" y1="70" x2="90" y2="30" style={{stroke:"black", strokeWidth:5}} />
                  </svg>
                </div>
              </div>
            );
        }
        else {
          return (
            <div id={element.single_event.timestamp_date} key={element.single_event.timestamp_date} className="protograph-event-message-div" style={onStartStyle} onClick={(e) => that.moveEventToTop(e)} >
              <p className="protograph-message-timestamp">{timestamp}</p>
              <div className="protograph-content-card protograph-laptop-mode">
                <div className="protograph-content-card-details">
                  { typeof element.single_event.header !== "undefined" && element.single_event.header !== "" &&
                    <h3 className='ui header'>{element.single_event.header}</h3>
                  }
                  {asset}
                  <p className="protograph-content-card-text">{element.single_event.message}</p>
                </div>
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
        if(Math.round((nextEvent - currentEvent)/(msDay*365)) >= 20) {
          let j;
          for(j = 0; j < eventPoints.length; j++) {
            if(eventPoints[j].timestamp === events[i].single_event.timestamp_date) {
              ranges.push({start: eventPoints[j].yCoord, end: eventPoints[j+1].yCoord, years: Math.round((nextEvent - currentEvent)/(msDay*365))})
            }
          }
          for(j = 0; j < ranges.length; j++) {
            let textPosition = ranges[j].start + (ranges[j].end - ranges[j].start)/2;
            let rotateBy = `rotate(180 ${svgWidth/2},${textPosition})`;
            yearCountText.push(<text key={textPosition} fontSize="12" writingMode="tb-rl" textAnchor="middle" x={svgWidth/2 + 10} y={textPosition} fill="#C0C0C0" transform={rotateBy}>{ranges[j].years} years</text>);
          }
        }
      }
      return (
        <div id="protograph_div" className = "protograph-card-div protograph-laptop-mode">
          <div id="protograph_div_content_wrapper" className="protograph-laptop-mode">
            <div id="protograph_card_title_div">
              <div id="protograph_timeline_details_div">
                <h1>{this.state.dataJSON.mandatory_config.timeline_title}</h1>
                <p>{this.state.dataJSON.mandatory_config.timeline_description}</p>
                <button id="protograph_show_main_card_button" style={{backgroundColor: this.state.optionalConfigJSON.start_button_color, color: this.state.optionalConfigJSON.start_button_text_color}} onClick={(e) => that.showMainCard(e)}>{this.state.languageTexts.button_text}</button>
              </div>
              <div id="protograph_timeline_image_div" style={{background: `url(${this.state.dataJSON.mandatory_config.timeline_image})`}}></div>
            </div>
            <div id="protograph_card_main_div">
              <div>
                <div style={{width:180, opacity:0}}>
                  <h1>{this.state.dataJSON.mandatory_config.timeline_title}</h1>
                  <p>{this.state.dataJSON.mandatory_config.timeline_description}</p>
                </div>
              </div>
              <div id="protograph_gradient_div" className="protograph-top-gradient protograph-laptop-mode"></div>
              <div style={{marginLeft:-85}}>
                <div id="protograph_date_div">
                  <div id="protograph_month_div">{this.getMonth(firstEventTimeComponents[1])}</div>
                  <h1 id="protograph_day_div" className='ui header'>{firstEventTimeComponents[2]}</h1>
                  <div id="protograph_year_div">{firstEventTimeComponents[0]}</div>
                </div>
                <div id="protograph_timeline_svg_div" className="protograph-laptop-mode">
                  <p id="protograph_initial_timestamp">{firstEventTimeComponents[0]}</p>
                  <svg id="protograph_timeline_svg" height={line_height} width={svgWidth}>
                    <line x1={svgWidth/2} y1="0" x2={svgWidth/2} y2={line_height} style={{stroke: "#dcdcdc", strokeWidth: "1"}} />
                    <g id="protograph_svg_group">
                      {plotCircles}
                      {yearCountText}
                    </g>
                  </svg>
                  <p id="protograph_final_timestamp">{lastEventTimeComponents[0]}</p>
                </div>
                <div id="protograph_content_div" onScroll={(e) => that.handleScroll(e)}>
                  {eventDetails}
                </div>
                <div id="protograph_gradient_div" className="protograph-bottom-gradient protograph-laptop-mode"></div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  renderMobile() {
    if (this.state.fetchingData){
      return(<div>Loading</div>)
    } else {
      // let styles = this.state.dataJSON.configs ? {backgroundColor: this.state.dataJSON.configs.background_color} : {undefined}
      let events = this.state.dataJSON.data.events;
      const line_height = 380;
      const extraLineSpace = 30;
      const svgWidth = 10;
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
          return <circle id={element.timestamp} key={element.timestamp} className="protograph-circle-plot" cx={svgWidth/2} cy={element.yCoord} r="5" style={{fill: "red"}} onClick={(e) => {that.handleEventCircleClick(e)}} />;
        }
        else {
          return <circle id={element.timestamp} key={element.timestamp} className="protograph-circle-plot" cx={svgWidth/2} cy={element.yCoord} r="5" style={{fill: "#C0C0C0"}} onClick={(e) => {that.handleEventCircleClick(e)}} />
        }
      });
      let assetIcons = events.map((element, pos) => {
        if(element.single_event.youtube_url){
          return (
            <svg id={element.timestamp} key={element.timestamp} className="protograph-asset-svg" dangerouslySetInnerHTML={{__html: "<image" + " x=" + (svgWidth/2 - 20) + " y=" + (that.getEventYCoord(element.single_event.timestamp_date, eventPoints) - 7) + " width=15" + " height=15" + " xlink:href='src/images/play.svg' />"}}/>

          );
        }
        if(element.single_event.photo){
          return (
            <svg id={element.timestamp} key={element.timestamp} className="protograph-asset-svg" dangerouslySetInnerHTML={{__html: "<image" + " x=" + (svgWidth/2 - 20) + " y=" + (that.getEventYCoord(element.single_event.timestamp_date, eventPoints) - 7) + " width=15" + " height=15" + " xlink:href='src/images/image.svg' />"}}/>
          );
        }
      });
      let onStartStyle = {opacity: "0.10"};
      let eventDetails = events.map((element, pos) => {
        let timestampComponents = element.single_event.timestamp_date.split('-');
        let timestamp = `${that.getMonth(timestampComponents[1])} ${timestampComponents[2]}, ${timestampComponents[0]}`;
        let asset = that.injectYoutubeEmbed(element.single_event.youtube_url, element.single_event.media_caption) ?  that.injectYoutubeEmbed(element.single_event.youtube_url, element.single_event.media_caption) : that.injectImage(element.single_event.photo, element.single_event.media_caption);
        if(pos == 0) {
            return (
              <div id={element.single_event.timestamp_date} key={element.single_event.timestamp_date} className="protograph-event-message-div protograph-first-event" style={{marginTop: line_height/2 - 51}} onClick={(e) => that.moveEventToTop(e)} >
                <p className="protograph-message-timestamp" style={{color: "black"}}>{timestamp}</p>
                <div className="protograph-content-card protograph-mobile-mode">
                  { typeof element.single_event.header !== "undefined" && element.single_event.header !== "" &&
                    <h3 className='ui header'>{element.single_event.header}</h3>
                  }
                  <p className="protograph-content-card-text">{element.single_event.message}</p>
                  {asset}
                </div>
                <div id="protograph_scroll_down_indicator">
                  <p id="protograph_scroll_down_text" style={{marginBottom: "2px", height: "20px"}}>Scroll</p>
                  <svg id="protograph_scroll_down_arrow" height="25px" width="25px" viewBox="0 0 100 100">
                    <line x1="10" y1="10" x2="50" y2="50" style={{stroke:"black", strokeWidth:5}} />
                    <line x1="50" y1="50" x2="90" y2="10" style={{stroke:"black", strokeWidth:5}} />
                    <line x1="10" y1="30" x2="50" y2="70" style={{stroke:"black", strokeWidth:5}} />
                    <line x1="50" y1="70" x2="90" y2="30" style={{stroke:"black", strokeWidth:5}} />
                  </svg>
                </div>
              </div>
            );
        }
        else {
          return (
            <div id={element.single_event.timestamp_date} key={element.single_event.timestamp_date} className="protograph-event-message-div" style={onStartStyle} onClick={(e) => that.moveEventToTop(e)} >
              <p className="protograph-message-timestamp">{timestamp}</p>
              <div className="protograph-content-card protograph-mobile-mode">
                { typeof element.single_event.header !== "undefined" && element.single_event.header !== "" &&
                  <h3 className='ui header'>{element.single_event.header}</h3>
                }
                {asset}
                <p className="protograph-content-card-text">{element.single_event.message}</p>
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
        if(Math.round((nextEvent - currentEvent)/(msDay*365)) >= 20) {
          let j;
          for(j = 0; j < eventPoints.length; j++) {
            if(eventPoints[j].timestamp === events[i].single_event.timestamp_date) {
              ranges.push({start: eventPoints[j].yCoord, end: eventPoints[j+1].yCoord, years: Math.round((nextEvent - currentEvent)/(msDay*365))})
            }
          }
          for(j = 0; j < ranges.length; j++) {
            let textPosition = ranges[j].start + (ranges[j].end - ranges[j].start)/2;
            let rotateBy = `rotate(180 ${svgWidth/2},${textPosition})`;
            yearCountText.push(<text key={textPosition} fontSize="12" writingMode="tb-rl" textAnchor="middle" x={svgWidth/2 + 10} y={textPosition} fill="#C0C0C0" transform={rotateBy}>{ranges[j].years} years</text>);
          }
        }
      }
      return (
        <div id="protograph_div" className="protograph-card-div protograph-mobile-mode" style={{background: `url(${this.state.dataJSON.mandatory_config.timeline_image})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", padding: 0}}>
          <div id="protograph_card_title_div_gradient"></div>
          <div id="protograph_div_content_wrapper protograph-mobile-mode">
          <div id="protograph_card_title_div_mobile">
            <h1>{this.state.dataJSON.mandatory_config.timeline_title}</h1>
            <p>{this.state.dataJSON.mandatory_config.timeline_description}</p>
            <button id="protograph_show_main_card_button_mobile" style={{backgroundColor: this.state.optionalConfigJSON.start_button_color, color: this.state.optionalConfigJSON.start_button_text_color}} onClick={(e) => that.showMainCard(e)}>{this.state.languageTexts.button_text}</button>
          </div>
          <div id="protograph_card_main_div">
            <div id="protograph_gradient_div" className="protograph-top-gradient protograph-mobile-mode"></div>
            <div id="protograph_timeline_svg_div" className="protograph-mobile-mode">
              <svg id="protograph_timeline_svg" height={line_height} width={svgWidth}>
                <line x1={svgWidth/2} y1="0" x2={svgWidth/2} y2={line_height} style={{stroke: "#dcdcdc", strokeWidth: "1"}} />
                <g id="protograph_svg_group">
                  {plotCircles}
                </g>
              </svg>
            </div>
            <div id="protograph_content_div" onScroll={(e) => that.handleScroll(e)} style={{width: "90.75%"}}>
              {eventDetails}
            </div>
            <div id="protograph_gradient_div" className="protograph-bottom-gradient protograph-mobile-mode"></div>
          </div>
        </div>
      </div>
      )
    }
  }

  renderScreenshot() {
    if (this.state.fetchingData){
      return(<div>Loading</div>)
    } else {
      return (
        <div id="ProtoScreenshot">
          <div id="protograph_div" className = "protograph-card-div protograph-screenshot-mode">
              <div id="protograph_card_title_div">
                <div id="protograph_timeline_details_div" style={{width: '100%'}}>
                  <h1>{this.state.dataJSON.mandatory_config.timeline_title}</h1>
                  <p>{this.state.dataJSON.mandatory_config.timeline_description}</p>
                  <button id="protograph_show_main_card_button" style={{padding: '8px 10px', marginTop:0}} onClick={(e) => that.showMainCard(e)}>{this.state.languageTexts.button_text}</button>
                </div>
            </div>
          </div>
        </div>
      );
    }
  }

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
