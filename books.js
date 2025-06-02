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
    const protocol = document.location.protocol;
    return (protocol == 'http:') || (protocol == 'https:');
  };

  /**
   * @param {Object} params
   * @return {string} the constructed URL params, to be appended to the base URL.
   */
  function combineUrlParamsNonEmpty(params) {
    const urlParams = [];
    Object.keys(params).forEach(function(key) {
      // Skip empty values.
      if (params[key]) {
        urlParams.push(key + '=' + encodeURIComponent(params[key]));
      }
    });
    return urlParams.join('&');
  }

  const JS_TYPE_STRING = 'string';
  const JS_TYPE_UNDEFINED = 'undefined';

  const BOOK_TITLE_MAX_LENGTH = 60;
  const AUTHORS_MAX_LENGTH = 60;

  /**
   * @param {string} input
   * @param {number} maxLength
   * @return {string} the input string, truncated to max specified length.
   */
  function truncateString(input, maxLength) {
    if (typeof input != JS_TYPE_STRING ||
        input.length <= maxLength) {
      return input;
    }
    return input.substr(0, maxLength) + '...';
  }

  $scope.truncateTitle = function(title) {
    return truncateString(title, BOOK_TITLE_MAX_LENGTH);
  };

  $scope.truncateAuthors = function(authors) {
    if (typeof authors === JS_TYPE_UNDEFINED) {
      return undefined;
    }
    return truncateString(authors.join(', '), AUTHORS_MAX_LENGTH);
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
    const urlBase = 'https://www.googleapis.com/books/v1/volumes?';
    const urlParamsRaw = {
      callback: 'JSON_CALLBACK',
      download: $scope.download,
      filter: $scope.filter,
      langRestrict: $scope.lang,
      maxResults: 25,
      prettyPrint: false,
      printType: 'books',
      q: $scope.query,
    };
    const urlFull = urlBase + combineUrlParamsNonEmpty(urlParamsRaw);
    $http({
      method: 'JSONP',
      url: urlFull,
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
