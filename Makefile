NPM = npm

.PHONY: install
install:
	$(NPM) install

.PHONY: clean
clean:
	rm -rf node_modules coverage

.PHONY: test
test: install
	$(NPM) test
