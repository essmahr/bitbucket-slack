TESTS = test/*.js test/**/*.js test/**/**/*.js !test/testUtils.js

test:
	@NODE_ENV=test ./node_modules/.bin/ava $(TESTS)

.PHONY: test
