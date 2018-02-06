import React from 'react';
import ReactDOM from 'react-dom';
import TimelineCard from './src/js/Container.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};

ProtoGraph.Card.toTimeline = function () {
  this.cardType = 'TimelineCard';
}

ProtoGraph.Card.toTimeline.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.toTimeline.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toTimeline.prototype.renderLaptop = function (data) {
  this.mode = 'laptop';
  ReactDOM.unmountComponentAtNode(this.options.selector);
  this.render();
}

ProtoGraph.Card.toTimeline.prototype.renderMobile = function (data) {
  this.mode = 'mobile';
  ReactDOM.unmountComponentAtNode(this.options.selector);
  this.render();
}

ProtoGraph.Card.toTimeline.prototype.renderScreenshot = function (data) {
  this.mode = 'screenshot';
  this.render();
}

ProtoGraph.Card.toTimeline.prototype.render = function () {
  ReactDOM.render(
    <TimelineCard
      dataURL={this.options.data_url}
      schemaURL={this.options.schema_url}
      optionalConfigURL={this.options.configuration_url}
      optionalConfigSchemaURL={this.options.configuration_schema_url}
      siteConfigURL={this.options.site_config_url}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }} />,
    this.options.selector);
}
