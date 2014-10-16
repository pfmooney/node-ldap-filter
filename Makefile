

NPM = npm

JS_FILES	:= $(shell find lib -name '*.js')

JSL_CONF	 = tools/jsl.node.conf
JSSTYLE_FLAGS	 = -f tools/jsstyle.conf

JSL_EXEC	?= deps/javascriptlint/build/install/jsl
JSSTYLE_EXEC	?= deps/jsstyle/jsstyle
JSL		?= $(JSL_EXEC)
JSSTYLE		?= $(JSSTYLE_EXEC)

.PHONY: install
install:
	$(NPM) install

.PHONY: clean
clean:
	rm -rf node_modules coverage

.PHONY: test
test: install
	$(NPM) test

.PHONY: check
check:
	$(JSL) --conf $(JSL_CONF) $(JS_FILES)
	$(JSSTYLE) $(JSSTYLE_FLAGS) $(JS_FILES)

.PHONY: prepush
prepush: check test


$(JSL_EXEC): | deps/javascriptlint/.git
	cd deps/javascriptlint && make install

$(JSSTYLE_EXEC): | deps/jsstyle/.git

.SECONDARY: $($(wildcard deps/*):%=%/.git)

deps/%/.git:
	git submodule update --init deps/$*
