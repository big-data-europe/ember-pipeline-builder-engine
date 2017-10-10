import Ember from 'ember';

const PipelinesNewRoute = Ember.Route.extend({
  store: Ember.inject.service('store'),
  model() {
    return this.get('store').createRecord('pipeline', { dockerFile: null});
  },
  actions: {
    save() {
      return this.modelFor('pipelines.new').save().then(pipeline => {
        return this.transitionTo('pipelines.steps', pipeline);
      });
    },
    cancel() {
      this.modelFor('pipelines.new').rollbackAttributes();
      return this.transitionTo('pipelines');
    }
  }
});

export default PipelinesNewRoute;
