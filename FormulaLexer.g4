lexer grammar FormulaLexer;

channels {
	ERROR
}

OpenParen: '(';
CloseParen: ')';
OpenBrace: '{';
CloseBrace: '}';
Comma: ',';
Plus: '+';
Minus: '-';
Multiply: '*';
Divide: '/';
EQ: '=';
NE: '<>';
GT: '>';
GTE: '>=';
LT: '<';
LTE: '<=';
// Connect: '_';

/// Boolean Literals
BooleanLiteral: 'true' | 'false';

/// Field Literals
FieldLiteral: Field;

/// Function Literals
FunctionLiteral:
	'DATE'
	| 'DATEVALUE'
	| 'DAY'
	| 'DAYS'
	| 'DAYS360'
	| 'EDATE'
	| 'EOMONTH'
	| 'HOUR'
	| 'MINUTE'
	| 'ISOWEEKNUM'
	| 'MONTH'
	| 'NOW'
	| 'SECOND'
	| 'TIME'
	| 'TIMEVALUE'
	| 'TODAY'
	| 'WEEKDAY'
	| 'YEAR'
	| 'WEEKNUM'
	| 'AND'
	| 'IF'
	| 'NOT'
	| 'OR'
	| 'SWITCH'
  | 'ABS'
	| 'CEILING'
	| 'CEILINGMATH'
	| 'EXP'
	| 'FLOOR'
	| 'FLOORMATH'
	| 'LN'
	| 'LOG'
	| 'LOG10'
	| 'MAX'
	| 'MIN'
	| 'MOD'
	| 'ROUND'
	| 'ROUNDDOWN'
	| 'ROUNDUP'
	| 'SQRT'
	| 'AVERAGE'
	| 'SUM'
	| 'COUNT'
	| 'COUNTA'
	| 'POWER'
	| 'CONCATENATE'
	| 'EXACT'
	| 'FIND'
	| 'LEFT'
	| 'LEN'
	| 'LOWER'
	| 'MID'
	| 'NUMBERVALUE'
	| 'PROPER'
	| 'REPT'
	| 'RIGHT'
	| 'SEARCH'
	| 'SPLIT'
	| 'SUBSTITUTE'
	| 'TRIM'
	| 'UPPER'
	| 'ISBLANK'
	| 'INCLUDES';

/// Numeric Literals
DecimalLiteral:
  DecimalIntegerLiteral '.' [0-9]*
  | '.' [0-9]+
  | DecimalIntegerLiteral;

/// String Literals
StringLiteral:
  '"' DoubleStringCharacter* '"'
	| '\'' SingleStringCharacter* '\'';


WhiteSpaces: [\t\r\n\u000B\u000C\u0020\u00A0]+ -> channel(HIDDEN);

/// UnexpectedCharacter: . -> channel(ERROR);

/// Fragment rules

fragment DoubleStringCharacter:
  ~["\\\r\n]
  | '\\' EscapeSequence
  | LineContinuation;

fragment SingleStringCharacter:
  ~['\\\r\n]
  | '\\' EscapeSequence
  | LineContinuation;

fragment EscapeSequence:
	CharacterEscapeSequence
	| '0' // no digit ahead! TODO
	| HexEscapeSequence
	| UnicodeEscapeSequence
	| ExtendedUnicodeEscapeSequence;

fragment CharacterEscapeSequence:
	SingleEscapeCharacter
	| NonEscapeCharacter;

fragment HexEscapeSequence: 'x' HexDigit HexDigit;

fragment UnicodeEscapeSequence:
	'u' HexDigit HexDigit HexDigit HexDigit;

fragment ExtendedUnicodeEscapeSequence: 'u' '{' HexDigit+ '}';

fragment SingleEscapeCharacter: ['"\\bfnrtv];

fragment NonEscapeCharacter: ~['"\\bfnrtv0-9xu\r\n];

fragment EscapeCharacter: SingleEscapeCharacter | [0-9] | [xu];

fragment LineContinuation: '\\' [\r\n\u2028\u2029];

fragment HexDigit: [0-9a-fA-F];

fragment DecimalIntegerLiteral: '0' | '-'? [0-9] [0-9]*;

fragment Field:
	'{!' FieldPathSegment FieldPathSubSegment* '}'
	| '{!' FieldPathSegment '[' DecimalIntegerLiteral ']' FieldPathSubSegment* '}'
	| '{!$' FieldPathSegment FieldPathSubSegment* '}'
	| '{!$' FieldPathSegment '[' DecimalIntegerLiteral ']' FieldPathSubSegment* '}';

fragment FieldPath: FieldPathSegment FieldPathSubSegment*;

fragment FieldPathSegment: [a-zA-Z] [a-zA-Z0-9_]*;

fragment FieldPathSubSegment:
	'.' FieldPathSegment
	| '.' FieldPathSegment '[' DecimalIntegerLiteral ']';
