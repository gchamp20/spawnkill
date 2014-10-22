PHP_CS_FIXER = vendor/bin/php-cs-fixer
PAGER = less -R

fix:
	$(PHP_CS_FIXER) fix . || true

fix-diff:
	$(PHP_CS_FIXER) fix --dry-run --verbose --diff . | $(PAGER) || true
