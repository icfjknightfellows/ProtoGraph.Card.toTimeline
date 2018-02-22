import React from 'react';
import ReactDOM from 'react-dom';
import EditTimelineCard from './src/js/edit_timeline_card.jsx';

ProtoGraph.Card.toTimeline.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toTimeline.prototype.renderSEO = function (data) {
  this.renderMode = 'SEO';
  return this.containerInstance.renderSEO();
}

ProtoGraph.Card.toTimeline.prototype.renderEdit = function (onPublishCallback) {
  this.mode = 'edit';
  this.onPublishCallback = onPublishCallback;
  ReactDOM.unmountComponentAtNode(this.options.selector);
  ReactDOM.render(
    <EditTimelineCard
      dataURL={this.options.data_url}
      schemaURL={this.options.schema_url}
      uiSchemaURL={this.options.ui_schema_url}
      optionalConfigURL={this.options.configuration_url}
      optionalConfigSchemaURL={this.options.configuration_schema_url}
      siteConfigURL={this.options.site_config_url}
      onPublishCallback={this.onPublishCallback}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}
