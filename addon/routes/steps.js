import Ember from 'ember';
const PipelinesStepsRoute = Ember.Route.extend({
  queryParams: {
    relatedWorkflow: {
      refreshModel: true
    }
  },
  store: Ember.inject.service('store'),
  model(params) {
    return this.get('store').findRecord('pipeline', params.pipeline_id);
  }
});
export default PipelinesStepsRoute;
