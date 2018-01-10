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
      let _this = this;
      let step = this.modelFor('steps.new');
      return this.get('store').query('step', {filter:{":exact:code": step.get('code')}, include: 'pipeline'}).then(steps => {
        if(steps.get('length') > 0) {
          // At least one step code with that name, ask confirmation from user
          let names = [];
          steps.forEach(item => {
            if(!names.includes(item.get('pipeline.title'))) {
              names.push(item.get('pipeline.title'));
            }
          });
          let pipelines = names.join(', ');
          let confirmed = confirm("The step code you provided appears to be used in the following workflows: ["+pipelines+"].\n\nThis might confuse your workflow manager, proceed with caution.");
          if(confirmed) {
            return step.save().then(step => {
              return _this.transitionTo('steps', step.get('pipeline'));
            });
          }
          return false;
        }
        else {
          // No step code with that name, go on ahead
          return step.save().then(step => {
            return this.transitionTo('steps', step.get('pipeline'));
          });
        }
      });
    },
    cancel() {
      this.modelFor('steps.new').rollbackAttributes();
      return this.transitionTo('steps', this.modelFor('steps'));
    }
  }
});

export default PipelinesStepsNewRoute;
