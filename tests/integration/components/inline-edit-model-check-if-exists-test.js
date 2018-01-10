import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('inline-edit-model-check-if-exists', 'Integration | Component | inline edit model check if exists', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{inline-edit-model-check-if-exists}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#inline-edit-model-check-if-exists}}
      template block text
    {{/inline-edit-model-check-if-exists}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
