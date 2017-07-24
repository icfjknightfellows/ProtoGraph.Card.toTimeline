import React from 'react';
import ReactDOM from 'react-dom';
import ShareCard from './src/js/share_card.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};

ProtoGraph.Card.toTimeline = function () {
  this.cardType = 'ShareCard';
}

ProtoGraph.Card.toTimeline.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.toTimeline.prototype.renderFacebookCard = function (data) {
  this.mode = 'fb_image';
  generateShareCard.call(this, data);
}

ProtoGraph.Card.toTimeline.prototype.renderInstagramCard = function (data) {
  this.mode = 'instagram_image';
  generateShareCard.call(this, data);
}

ProtoGraph.Card.toTimeline.prototype.renderScreenshot = function (data) {
  this.mode = 'instagram_image';
  generateShareCard.call(this, data);
}

ProtoGraph.Card.toTimeline.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

function generateShareCard(data) {
  ReactDOM.render(
    <ShareCard
      dataURL={this.options.data_url}
      schemaURL={this.options.schema_url}
      optionalConfigURL={this.options.configuration_url}
      optionalConfigSchemaURL={this.options.configuration_schema_url}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}
