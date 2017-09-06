import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
  this.route('pipelines', function() {
    this.route('index');
    this.route('new');
    this.route('steps', { path: '/:pipeline_id/steps' }, function() {
      this.route('index');
      this.route('new');
    });
  });
});