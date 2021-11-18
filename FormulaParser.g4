parser grammar FormulaParser;

options {
	tokenVocab = FormulaLexer;
}

stat: singleExpression;

arguments: '(' (argumentList ','?)? ')';

argumentList: argument (',' argument)*;

argument: // ECMAScript 6: Spread Operator
	singleExpression;

variable: FieldLiteral; //名称需排除函数
decimalLiteral: DecimalLiteral;
stringLiteral: StringLiteral;
booleanLiteral: BooleanLiteral;
function: FunctionLiteral arguments;

singleExpression:
	decimalLiteral																# DecimalLiteralExpression
	| stringLiteral																# StringLiteralExpression
	| booleanLiteral															# BooleanLiteralExpression
	| function																	# FunctionExpression
	| variable																	# VariableExpression
	| '(' singleExpression ')' 									# ParenthesizedExpression
	| singleExpression op = (Multiply | Divide) singleExpression				# MultiplicativeExpression
	| singleExpression op = (Plus | Minus) singleExpression						# AdditiveExpression
	| singleExpression cmp = (GT | GTE | LT | LTE | EQ | NE) singleExpression	# CompareExpression;