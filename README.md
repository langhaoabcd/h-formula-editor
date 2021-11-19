# Create a custom web editor using Typescript, React, ANTLR and Monaco-Editor
## TodoLangEditor
This is a web editor for a custom language.

Check out my articles:  
  
[Part 1: Build a web editor with syntax colorization](https://medium.com/better-programming/create-a-custom-web-editor-using-typescript-react-antlr-and-monaco-editor-part-1-2f710c69c18c)  
[Part 2: Implement language services, auto-completion, syntax and semantic validation and auto-formatting](https://medium.com/better-programming/create-a-custom-web-editor-using-typescript-react-antlr-and-monaco-editor-bcfc7554e446)  


# 特殊函数
IF 和 SWITCH 返回类型UNKNOW  
TODAY 和 NOW 没有入参  

# Formula
## 1.BaseMath
1
"aa"
current.id
1 + 2 * 3 / 2
(1 * 2) + $current.id

## 2.Function
COUNT(1,2)
COUNT(1,2,current.id)
COUNT(1,2,1+2)
COUNT(1,2,SUM(1,2))

## 3.Compare
1. (1+20) +179 > 199
2. 199 < 229
3. 179 = $current.id
4. 179 <> 199
5. (1+20) +179 >= 199
6. 179 <= current.id

+ '> < >= <=' 仅支持两个数字之间的比较
+ '= <>' 支持两个数字、boolean、引用类型之间的比较