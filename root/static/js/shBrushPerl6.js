/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 *
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		// Contributed by David Simmons-Duffin and Marty Kube

		var funcs =
			'ACCEPTS HOW REJECTS VAR WHAT WHENCE ' +
			'WHERE WHICH WHO abs acos ' +
			'acosec acosech acosh acotan acotanh ' +
			'all any approx arity asec ' +
			'asech asin asinh assuming atan ' +
			'atan2 atanh attr bless body ' +
			'by bytes caller callsame callwith ' +
			'can capitalize cat ceiling chars ' +
			'chmod chomp chop chr chroot ' +
			'circumfix cis classify clone close ' +
			'cmp_ok codes comb connect contains ' +
			'context cos cosec cosech cosh ' +
			'cotan cotanh count defined delete ' +
			'diag dies_ok does e each ' +
			'eager elems end eof eval ' +
			'eval_dies_ok eval_elsewhere eval_lives_ok evalfile exists ' +
			'exp first flip floor flunk ' +
			'flush fmt force_todo fork from ' +
			'getc gethost getlogin getpeername getpw ' +
			'gmtime graphs grep hints hyper ' +
			'im index infix invert is_approx ' +
			'is_deeply isa isa_ok isnt iterator ' +
			'join key keys kill kv ' +
			'lastcall lazy lc lcfirst like ' +
			'lines link lives_ok localtime log ' +
			'log10 map max min minmax ' +
			'name new nextsame nextwith nfc ' +
			'nfd nfkc nfkd nok_error nonce ' +
			'none normalize not nothing ok ' +
			'once one open opendir operator ' +
			'ord p5chomp p5chop pack pair ' +
			'pairs pass perl pi pick ' +
			'plan plan_ok polar pop pos ' +
			'postcircumfix postfix pred prefix print ' +
			'printf push quasi quotemeta rand ' +
			're read readdir readline reduce ' +
			'reverse rewind rewinddir rindex roots ' +
			'round roundrobin run runinstead sameaccent ' +
			'samecase say sec sech sech ' +
			'seek shape shift sign signature ' +
			'sin sinh skip skip_rest sleep ' +
			'slurp sort splice split sprintf ' +
			'sqrt srand strand subst substr ' +
			'succ sum symlink tan tanh ' +
			'throws_ok time times to todo ' +
			'trim trim_end trim_start true truncate ' +
			'uc ucfirst undef undefine uniq ' +
			'unlike unlink unpack unpolar unshift ' +
			'unwrap use_ok value values vec ' +
			'version_lt void wait want wrap ' +
			'write zip';

		var keywords = 
			'BEGIN CATCH CHECK CONTROL END ENTER ' +
			'FIRST INIT KEEP LAST LEAVE ' +
			'NEXT POST PRE START TEMP ' +
			'UNDO as assoc async augment ' +
			'binary break but cached category ' +
			'class constant contend continue copy ' +
			'deep default defequiv defer die ' +
			'do else elsif enum equiv ' +
			'exit export fail fatal for ' +
			'gather given goto grammar handles ' +
			'has if inline irs is ' +
			'last leave let lift loop ' +
			'looser macro make maybe method ' +
			'module multi my next of ' +
			'ofs only oo ors our ' +
			'package parsed prec proto readonly ' +
			'redo ref regex reparsed repeat ' +
			'require required return returns role ' +
			'rule rw self slang state ' +
			'sub submethod subset supersede take ' +
			'temp tighter token trusts try ' +
			'unary unless until use warn ' +
			'when where while will';

		this.regexList = [
			{ regex: /(<<|&lt;&lt;)((\w+)|(['"])(.+?)\4)[\s\S]+?\n\3\5\n/g, css: 'string' }, // here doc (maybe html encoded)
			{ regex: /#.*$/gm, css: 'comments' },
			{ regex: /^#!.*\n/g, css: 'preprocessor' }, // shebang
			{ regex: /-?\w+(?=\s*=(>|&gt;))/g,      css: 'string' }, // fat comma

			// is this too much?
			{ regex: /\bq[qwxr]?\([\s\S]*?\)/g,     css: 'string' }, // quote-like operators ()
			{ regex: /\bq[qwxr]?\{[\s\S]*?\}/g,     css: 'string' }, // quote-like operators {}
			{ regex: /\bq[qwxr]?\[[\s\S]*?\]/g,     css: 'string' }, // quote-like operators []
			{ regex: /\bq[qwxr]?(<|&lt;)[\s\S]*?(>|&gt;)/g, css: 'string' }, // quote-like operators <>
			{ regex: /\bq[qwxr]?([^\w({<[])[\s\S]*?\1/g,    css: 'string' }, // quote-like operators non-paired

			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString, css: 'string' },
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString, css: 'string' },
      // currently ignoring single quote package separator and utf8 names
			{ regex: /(?:&amp;|[$@%*]|\$#)\$?[a-zA-Z_](\w+|::)*/g, css: 'variable' },
			{ regex: /(^|\n)\s*__(?:END|DATA)__\b[\s\S]*$/g, css: 'comments' },

			// don't capture the newline after =cut so that =cut\n\n=head1 will start a new pod section
			{ regex: /(^|\n)=\w[\s\S]*?(\n=end\s+\S+\s*(?=\n)*|$)/g, css: 'comments' }, // pod

			{ regex: new RegExp(this.getKeywords(funcs), 'gm'), css: 'functions' },
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'), css: 'keyword' }
		    ];

		this.forHtmlScript(SyntaxHighlighter.regexLib.phpScriptTags);
	}

	Brush.prototype = new SyntaxHighlighter.Highlighter();
	Brush.aliases = ['perl6', 'Perl6', 'pl6'];

	SyntaxHighlighter.brushes.Perl6 = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
