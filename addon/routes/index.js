import Ember from 'ember';

const PipelinesIndexRoute = Ember.Route.extend({
  store: Ember.inject.service('store'),
  model() {
    return this.get('store').query('pipeline', {
      page: {
        size: 10000
      },
      sort: 'title'
    });
  },
  actions: {
    delete(pipeline) {
      return pipeline.get('steps').then(steps => {
        steps.canonicalState.setEach('pipeline', null);
        return steps.save().then(steps => {
          const destroyAll = Ember.RSVP.all(steps.map(x => x.destroyRecord()));
          return destroyAll.then(pipeline.destroyRecord());
        });
      });
    },
    export(pipeline) {
      return Ember.$.ajax({
        url: "/export/pipelines",
        type: "GET",
        headers: {
          Accept: "text/turtle"
        },
        data: {
          uuid: pipeline.get('id')
        },
        success: (response, status, xhr) => {
          // See https://stackoverflow.com/questions/16086162/handle-file-download-from-ajax-post
          const filename = `pipeline-${pipeline.get('id')}.ttl`;
          const type = xhr.getResponseHeader('Content-Type');
          const blob = new Blob([response], { type });

          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob
            // for which they were created. These URLs will no longer resolve as the data backing
            // the URL has been freed."
            return window.navigator.msSaveBlob(blob, filename);
          }
          else {
            const URL = window.URL || window.webkitURL;
            const downloadUrl = URL.createObjectURL(blob);

            // use HTML5 a[download] attribute to specify filename
            const a = document.createElement("a");
            // Safari doesn't support the download attribute yet
            if (typeof a.download === 'undefined') {
              window.location = downloadUrl;
            } else {
              a.href = downloadUrl;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
            }

            return setTimeout( (() => URL.revokeObjectURL(downloadUrl)), 100);
          }
        }
      });
    }, // cleanup
    newPipeline() {
      return this.transitionTo('new');
    }
  }
});

export default PipelinesIndexRoute;
