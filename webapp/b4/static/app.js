showView = function (selected) {
  window.location.hash = '#' + selected;
  $('.view').hide().filter('#'+selected+'-view').show();
};

$(window).on('hasChange', function (event) {
  var view = (window.location.hash || '').replace(/^#/, '');
  if ($('#' + view + '-view').length) {
    showView(view);
  }
});

$.ajax({
  url : '/api/user',
  accepts : 'application/json'
})
.then(function(data, status, xhr) {
  getBundles();
}, function (xhr, status, err) {
  showView('welcome');
})
;
