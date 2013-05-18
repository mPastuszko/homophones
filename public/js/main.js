Array.prototype.unique = function() {
    var o = {}, i, l = this.length, r = [];
    for(i=0; i<l;i+=1) o[this[i]] = this[i];
    for(i in o) r.push(o[i]);
    return r;
};

function loadTemplates() {
  Templates = {};
  $('script[type="text/jade-template"]').each(function(i) {
    template = $(this);
    Templates[template.attr('id')] = jade.compile(template.html());
  });
}

function loadResults(word) {
  $.getJSON('/results.json', {word: Data.word}, resultsLoaded);
  // resultsLoaded([]);
}

function resultsLoaded(data) {
  Data.results = data;
  var renderedResults = renderResults();
  var renderedFilter = renderFilter();
  $('#results').html(renderedResults);
  $('#filter').html(renderedFilter);
  setupFilterHandlers();
  $.bootstrapSortable();

  $('#results-loader').addClass('hidden');
  $('#results, #filter').removeClass('hidden');
}

function updateResults() {
  var filterSettings = collectFilterSettings();
  var results = filterResults(Data.results, filterSettings);
  var renderedResults = renderResults(results);
  $('#results').html(renderedResults);
  $.bootstrapSortable();
}

function filterResults(results, filterSettings) {
  return $.grep(results, function(e, i) {
    return filterSettings['style'][e['style']] &&
           filterSettings['syllables'][e['syllables']] &&
           (e['frequency'] || !filterSettings['frequency']['on']);
  });
}

function renderResults(results) {
  var data = {
    word: Data.word,
    homophones: results || Data.results
  };
  return Templates['results-template'](data);
}

function renderFilter() {
  var data = {
    styles: extractProperty(Data.results, 'style'),
    syllables: extractProperty(Data.results, 'syllables')
  };
  return Templates['filter-template'](data);
}

function setupFilterHandlers() {
  $('#filter input').change(updateResults);
}

function extractProperty(list, property) {
  var prop_values = $.map(list, function(v, i) {
    return v[property];
  });
  return prop_values.sort().unique();
}

function collectFilterSettings() {
  var filter_form_arr = $('#filter-form').serializeArray();
  var settings = {
    syllables: {},
    style: {},
    frequency: {}
  };
  $.each(filter_form_arr, function(i, e) {
    var property = e['name'];
    var value = e['value'];
    settings[property][value] = true;
  });
  return settings;
}

$(function() {
  loadTemplates();
  loadResults(Data.word);
});
