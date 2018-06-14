1. 容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）
2. 容器属性：
 
```
// 属性决定主轴的方向（即项目的排列方向）
   flex-direction:row | row-reverse | column | column-reverse; 
// 当轴线排不下，换行方式flex-wrap:nowrap | wrap | wrap-reverse;  
// flex-direction属性和flex-wrap属性的简写形式
    flex-flow: <flex-direction> || <flex-wrap>;  
// 项目在主轴上的对齐方式
    justify-content: flex-start（左对齐）| flex-end（右对齐） | center（居中） | space-between（两端对齐，项目之间的间隔都相等） | space-around（每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍）;
// 定义项目在交叉轴上如何对齐
    align-items: flex-start | flex-end | center | baseline（项目的第一行文字的基线对齐） | stretch（如果项目未设置高度或设为auto，将占满整个容器的高度）;  
//  定义了多根轴线的对齐方式。若只有一行不起作用
    align-content: flex-start | flex-end | center | space-between | space-around | stretch;
// todo: 待理清align-items和align-content的区别
```

3. 项目属性：

```
// 定义项目的排列顺序。数值越小，排列越靠前，默认为0
order: <integer>;
// 定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小
flex-basis: <length> | auto; /* default auto */ 
// 定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
flex-grow: <number>; /* default 0 */
// 定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。如果所有项目的flex-shrink属性都为1，当空间不足时，都将等比例缩小。如果一个项目的flex-shrink属性为0，其他项目都为1，则空间不足时，前者不缩小。负值对该属性无效。
flex-shrink: <number>; /* default 1 */
// 是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto)。
flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]  
// 允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。
align-self: align-self: auto | flex-start | flex-end | center | baseline | stretch;  
```



