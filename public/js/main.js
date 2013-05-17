function loadTemplates() {
  Templates = {};
  $('script[type="text/jade-template"]').each(function(i) {
    template = $(this);
    Templates[template.attr('id')] = jade.compile(template.html());
  });
}

function loadResults(word) {
  $.getJSON('/results.json', {word: Data.word}, resultsLoaded);
}

function resultsLoaded(data) {
  Data.results = data;
  var renderedResults = renderResults();
  $('#results').html(renderedResults);
  $('#results-loader').addClass('hidden');
  $('#results').removeClass('hidden');
}

function renderResults(word) {
  var data = {
    word: Data.word,
    homophones: Data.results
  };
  return Templates['results-template'](data);
}

$(function() {
  loadTemplates();
  loadResults(Data.word);
});
