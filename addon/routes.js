import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
  this.route('index');
  this.route('new');
  this.route('steps', { path: ':pipeline_id' }, function() {
    this.route('index');
    this.route('new');
  });
});
