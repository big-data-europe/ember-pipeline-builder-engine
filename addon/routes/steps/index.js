import Ember from 'ember';

const PipelinesStepsIndexRoute = Ember.Route.extend({
  store: Ember.inject.service('store'),
  model() {
    let pipeline = this.modelFor('steps');
    return Ember.RSVP.hash({
      steps: pipeline.get('steps'),
      dockerFile: pipeline.get('dockerFile'),
      dockerServices: pipeline.get('dockerFile').then(dockerFile => {
        if(dockerFile) {
          return dockerFile.get('dockerServices');
        }
      })
    }).then(hash => {
      return {
        pipeline,
        steps: hash.steps,
        dockerFile: hash.dockerFile,
        dockerServices: hash.dockerServices
      }
    });
  },
  changedCode(step, value) {
    step.get('service').then(service => {
      if (service) {
        service.setEnvironmentVariable("INIT_DAEMON_STEP", value);
      }
    })
  },
  actions: {
    cancel(step) {
      step.set('editing', false);
      step.rollbackAttributes();
    },
    save(step) {
      step.set('editing', false);
      step.save();
      this.changedCode(step, step.get('code'));
    },
    edit(step) {
      step.set('editing', true);
    },
    delete(step) {
      const steps = this.modelFor('steps.index')['steps'].sortBy('order');
      step.destroyRecord().then(result => {
        steps.removeObject(step);
      });
    },
    newStep() {
      return this.transitionTo('steps.new');
    },
    back() {
      return this.transitionTo('index');
    }
  }
});

export default PipelinesStepsIndexRoute;
