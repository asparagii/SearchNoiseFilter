FILES=128.png \
	  all-page-run.js \
	  background.js \
	  common.js \
	  manifest.json \
	  options.html \
	  options.js \
	  run.js \
	  search-noise-filter.css

package: $(FILES)
	zip SearchNoiseFilter.zip $(FILES)
