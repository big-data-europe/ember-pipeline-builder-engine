import Ember from 'ember';

const PipelinesNewRoute = Ember.Route.extend({
  store: Ember.inject.service('store'),
  notify: Ember.inject.service('notify'),
  model() {
    return this.get('store').createRecord('pipeline', {
      dockerFile: null
    });
  },
  actions: {
    save() {
      const title = this.modelFor('new').get('title');

      if ((title === null) || (title === undefined) || (title.length < 1)) {
        this.modelFor('new').get('dockerFile').then((item) => {
          if ((item === null) || (item === undefined)) {
            this.get("notify").error("missing title and docker compose file");
          } else {
            this.get("notify").error("missing title");
          }
        });
      } else {
        this.modelFor('new').get('dockerFile').then((item) => {
          if ((item === null) || (item === undefined)) {
            this.get("notify").error("missing docker compose file");
          } else {
            return this.modelFor('new').save().then(pipeline => {
              return this.transitionTo('steps', pipeline);
            });
          }
        });
      }
    },
    cancel() {
      this.modelFor('new').rollbackAttributes();
      return this.transitionTo('index');
    }
  }
});

export default PipelinesNewRoute;
