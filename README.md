# Librarian

Easily find free, fully-readable and/or downloadable books via Google Books API.
Upon finding a book, you can view it online using the Google Books HTML reader,
or download it for your ebook reader.

See the [live demo](https://mbrukman.github.io/librarian/), or clone this
repository and then open `index.html` in your browser to try it out.

## Google Books API key

The unauthenticated Google Books API has strict quota limits which are
frequently exhausted because the whole world shares the same limited quota.

If you keep seeing errors that the API quota is exhausted, you can bring your
own Google Books API key (which is free):

1. Open your Google Cloud Platform project in the [Google Cloud
	 Console](https://console.cloud.google.com) or create a new one
2. Open the [Google Books API in the API
	 Marketplace](https://console.cloud.google.com/marketplace/product/google/books.googleapis.com)
3. Enable the Google Books API in your project
3. Open the [Google Books API credentials page](https://console.cloud.google.com/apis/api/books.googleapis.com/credentials)
4. Create a new API key, limited to Google Books API. You can limit it to "Web
	 sites" since that's where we are using it.
5. Paste that API key into the form by expanding the "API key" option. The API
	 key is only sent to Google Books servers, and is not stored or recorded
	 anywhere else; this is a purely client-side web app with no server component.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for more details.

## Alternatives

You can also use [Google Books: Advanced
Search](https://books.google.com/advanced_book_search) which provides even more
parameters to searching books, and includes magazines and newspapers.

That said, working on this project let me use Google Books API and create a
custom result visualization with additional links for reading content that I
could customize, and it defaults to fully-accessible books (public domain / out
of copyright), which is what I wanted to see. Plus, it was fun to build!

## License

Apache 2.0; see [`LICENSE`](LICENSE) for more details.

## Disclaimer

This is not an official Google project. It is not supported by Google and Google
specifically disclaims all warranties as to its quality, merchantability, or
fitness for a particular purpose.
