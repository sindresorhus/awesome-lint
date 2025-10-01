import remarkLint from 'remark-lint';
import remarkGfm from 'remark-gfm';
import blockquoteIndentation from 'remark-lint-blockquote-indentation';
import checkboxCharacterStyle from 'remark-lint-checkbox-character-style';
import checkboxContentIndent from 'remark-lint-checkbox-content-indent';
import codeBlockStyle from 'remark-lint-code-block-style';
import definitionCase from 'remark-lint-definition-case';
import definitionSpacing from 'remark-lint-definition-spacing';
import emphasisMarker from 'remark-lint-emphasis-marker';
import fencedCodeMarker from 'remark-lint-fenced-code-marker';
import fileExtension from 'remark-lint-file-extension';
import finalNewline from 'remark-lint-final-newline';
import hardBreakSpaces from 'remark-lint-hard-break-spaces';
import headingStyle from 'remark-lint-heading-style';
import linkTitleStyle from 'remark-lint-link-title-style';
import listItemBulletIndent from 'remark-lint-list-item-bullet-indent';
import listItemIndent from 'remark-lint-list-item-indent';
import noBlockquoteWithoutMarker from 'remark-lint-no-blockquote-without-marker';
import noEmphasisAsHeading from 'remark-lint-no-emphasis-as-heading';
import noFileNameArticles from 'remark-lint-no-file-name-articles';
import noFileNameConsecutiveDashes from 'remark-lint-no-file-name-consecutive-dashes';
import noFileNameIrregularCharacters from 'remark-lint-no-file-name-irregular-characters';
import noFileNameMixedCase from 'remark-lint-no-file-name-mixed-case';
import noFileNameOuterDashes from 'remark-lint-no-file-name-outer-dashes';
import noHeadingContentIndent from 'remark-lint-no-heading-content-indent';
import noHeadingIndent from 'remark-lint-no-heading-indent';
import noHeadingPunctuation from 'remark-lint-no-heading-punctuation';
import noMultipleToplevelHeadings from 'remark-lint-no-multiple-toplevel-headings';
import noShellDollars from 'remark-lint-no-shell-dollars';
import noTableIndentation from 'remark-lint-no-table-indentation';
import noUndefinedReferences from 'remark-lint-no-undefined-references';
import noUnneededFullReferenceImage from 'remark-lint-no-unneeded-full-reference-image';
import noUnneededFullReferenceLink from 'remark-lint-no-unneeded-full-reference-link';
import noUnusedDefinitions from 'remark-lint-no-unused-definitions';
import orderedListMarkerStyle from 'remark-lint-ordered-list-marker-style';
import orderedListMarkerValue from 'remark-lint-ordered-list-marker-value';
import ruleStyle from 'remark-lint-rule-style';
import strongMarker from 'remark-lint-strong-marker';
import tableCellPadding from 'remark-lint-table-cell-padding';
import tablePipeAlignment from 'remark-lint-table-pipe-alignment';
import tablePipes from 'remark-lint-table-pipes';
import unorderedListMarkerStyle from 'remark-lint-unordered-list-marker-style';
import noRepeatPunctuation from 'remark-lint-no-repeat-punctuation';
import customRules from './rules/index.js';

const plugins = [
	remarkLint,
	remarkGfm, // Enable GitHub Flavored Markdown (including footnotes)

	// Official plugins
	[blockquoteIndentation, 2],
	[checkboxCharacterStyle, 'consistent'],
	checkboxContentIndent,
	[codeBlockStyle, 'fenced'],
	definitionCase,
	definitionSpacing,
	[emphasisMarker, 'consistent'],
	[fencedCodeMarker, '`'],
	fileExtension,
	finalNewline,
	hardBreakSpaces,
	[headingStyle, 'atx'],
	[linkTitleStyle, '\''],
	// TODO: this rule doesn't properly handle tab indents
	// require('remark-lint-list-item-content-indent'),
	listItemBulletIndent,
	[listItemIndent, 'one'],
	noBlockquoteWithoutMarker,
	noEmphasisAsHeading,
	noFileNameArticles,
	noFileNameConsecutiveDashes,
	noFileNameIrregularCharacters,
	noFileNameMixedCase,
	noFileNameOuterDashes,
	noHeadingContentIndent,
	noHeadingIndent,
	noHeadingPunctuation,
	[noMultipleToplevelHeadings, 1],
	noShellDollars,
	noTableIndentation,
	[noUndefinedReferences, {
		allow: [
			/^!(?:note|tip|important|warning|caution)$/i, // Allow GitHub alerts
			/^\^.+$/, // Allow footnotes
		],
	}],
	noUnneededFullReferenceImage,
	noUnneededFullReferenceLink,
	noUnusedDefinitions,
	[orderedListMarkerStyle, 'consistent'],
	[orderedListMarkerValue, 'ordered'],
	[ruleStyle, '---'],
	[strongMarker, 'consistent'],
	[tableCellPadding, 'consistent'],
	tablePipeAlignment,
	tablePipes,
	[unorderedListMarkerStyle, 'consistent'],

	// Third-party plugins
	// Disabled as it throws `file.warn is not a function`
	// require('remark-lint-no-empty-sections'),

	[noRepeatPunctuation, '！!~～,，·?？'], // Exclude dots to allow ellipsis (...)

	// Custom plugins
	...customRules,
];

export default plugins;

