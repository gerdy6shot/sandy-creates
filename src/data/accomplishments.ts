export type Accomplishment = {
 id:string;eyebrow:string;title:string;recognition:string;description:string;story:string;
 portrait:{src:string;alt:string};gallery:{src:string;alt:string;caption:string}[];
 source:{kind:'supplied-social-post';account:string;files:string[];date:string|null;contestName:string|null;pieName:string|null};
};
export const pieAccomplishment:Accomplishment = {
 id:'pie-ribbon',eyebrow:'A MOMENT WORTH SHARING',title:'A first entry.\nA second-place ribbon.',recognition:'Second place · first Blue Ribbon Contest',
 description:'Sandy earned second place in her first Blue Ribbon Contest with her own take on a traditional British pie.',
 story:'In the post she shared, Sandy describes putting her own touches on a classic recipe—and the surprise and gratitude of bringing home a ribbon. A personal kitchen favorite became a moment to celebrate.',
 portrait:{src:'/images/accomplishments/sandy-pie-ribbon.jpg',alt:'Sandy smiling and holding a red second-place pie ribbon.'},
 gallery:[{src:'/images/accomplishments/pie-slice.jpg',alt:'A slice of Sandy’s pie showing its layered filling, cream topping and chocolate shavings.',caption:'A closer look at the pie Sandy shared.'},{src:'/images/accomplishments/whole-pie.jpg',alt:'Sandy’s whole pie topped with cream, chocolate shavings and wafer rolls.',caption:'The finished pie, as shared in Sandy’s post.'}],
 source:{kind:'supplied-social-post',account:'@spicegurlofficial',files:['IMG_6730.jpg','IMG_6731.jpg','IMG_6732.jpg'],date:null,contestName:null,pieName:null}
};
