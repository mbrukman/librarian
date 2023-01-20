// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

angular.module('Librarian', ['ui.bootstrap']);

function SearchCtrl($scope, $http, $templateCache, $timeout) {
  $scope.query = '';
  $scope.data = {items: []};
  $scope.status = null;

  $scope.filter = 'full';
  $scope.download = '';
  $scope.lang = 'en';

  /**
   * @return {boolean}
   */
  $scope.proxyCompatible = function() {
    var protocol = document.location.protocol;
    return (protocol == 'http:') || (protocol == 'https:');
  };

  /**
   * @param {Object} params
   * @return {string} the constructed URL params, to be appended to the base URL.
   */
  function combineUrlParamsNonEmpty(params) {
    var urlParams = [];
    Object.keys(params).forEach(function(key) {
      // Skip empty values.
      if (params[key]) {
        urlParams.push(key + '=' + encodeURIComponent(params[key]));
      }
    });
    return urlParams.join('&');
  }

  var JS_TYPE_OBJECT = 'object';
  var JS_TYPE_STRING = 'string';
  var JS_TYPE_UNDEFINED = 'undefined';

  var BOOK_TITLE_MAX_LENGTH = 40;

  function truncateString(input, maxLength) {
    if (typeof input != JS_TYPE_STRING ||
        input.length <= maxLength) {
      return input;
    }
    return input.substr(0, maxLength - 1) +
      // If the truncated string does not end with a space, add one before the
      // elipsis for readability.
      (input[maxLength] == ' ' ? '' : ' ') +
      '...';
  }

  $scope.truncateTitle = function(input) {
    return truncateString(input, BOOK_TITLE_MAX_LENGTH);
  };

  $scope.secureUrl = function(url) {
    // Google Books API returns HTTP URLs for book cover images, even though it
    // should be using HTTPS URLs only; this generates a warning in the console.
    if (url.startsWith('http://books.google.com/')) {
      return url.replace(/^http:/, 'https:');
    }
    return url;
  }

  /**
   * Documentation:
   * https://developers.google.com/books/docs/v1/using
   */
  $scope.search = function() {
    var urlBase = 'https://www.googleapis.com/books/v1/volumes?';
    var urlParamsRaw = {
      callback: 'JSON_CALLBACK',
      download: $scope.download,
      filter: $scope.filter,
      langRestrict: $scope.lang,
      maxResults: 25,
      prettyPrint: false,
      printType: 'books',
      q: $scope.query,
    };
    var urlFull = urlBase + combineUrlParamsNonEmpty(urlParamsRaw);
    $http({
      method: 'JSONP',
      url: urlFull,
      // We may want to switch to proxy-based fetch here, but the above
      // approach lets us search for podcasts in the browser without even
      // running the proxy.
      //
      // url: '/?q=' + encodeURIComponent(urlFull),
      cache: $templateCache,
    })
      .success(function(data, status) {
        $scope.data = data;
        $scope.status = status;
        console.log(data);
      })
      .error(function(data, status) {
        $scope.data = data || "Request failed";
        $scope.status = status;
      });
  };
}
