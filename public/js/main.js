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
  $('#results-loader').addClass('hidden');
  $('#results, #filter').removeClass('hidden');
}

function renderResults() {
  var data = {
    word: Data.word,
    homophones: Data.results
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

function extractProperty(list, property) {
  var prop_values = $.map(list, function(v, i) {
    return v[property];
  });
  return prop_values.sort().unique();
}

$(function() {
  loadTemplates();
  loadResults(Data.word);
});
