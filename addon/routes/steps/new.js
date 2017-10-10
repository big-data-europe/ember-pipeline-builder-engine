import Ember from 'ember';

const PipelinesStepsNewRoute = Ember.Route.extend({
  store: Ember.inject.service('store'),
  model() {
    const pipeline = this.modelFor('steps');
    return this.get('store').createRecord('step', {
        order: pipeline.get('steps.length'),
        pipeline
    });
  },
  actions: {
    save() {
      return this.modelFor('steps.new').save().then(step => {
        return this.transitionTo('steps', step.get('pipeline'));
      });
    },
    cancel() {
      this.modelFor('steps.new').rollbackAttributes();
      return this.transitionTo('steps', this.modelFor('steps'));
    }
  }
});

export default PipelinesStepsNewRoute;
