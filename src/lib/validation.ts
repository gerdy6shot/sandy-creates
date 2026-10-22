export const categories=['General','Product or order support','Culinary or platter request','Event collaboration','Wholesale or retail partnership','Media or business opportunity'] as const;
export type InquiryInput={name:string;email:string;phone:string;category:string;message:string;orderReference:string;eventDate:string;guests:string;marketing:boolean;website:string};
export const emptyInquiry:InquiryInput={name:'',email:'',phone:'',category:'General',message:'',orderReference:'',eventDate:'',guests:'',marketing:false,website:''};
export function validateInquiry(v:InquiryInput):Record<string,string>{
 const e:Record<string,string>={};
 if(!v.name.trim()||v.name.length>120)e.name='Enter your name (up to 120 characters).';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)||v.email.length>254)e.email='Enter a valid email address.';
 if(v.phone.length>40)e.phone='Use 40 characters or fewer.';
 if(!categories.includes(v.category as typeof categories[number]))e.category='Choose a category from the list.';
 if(v.message.trim().length<10||v.message.length>4000)e.message='Write between 10 and 4,000 characters.';
 if(v.orderReference.length>80)e.orderReference='Use 80 characters or fewer.';
 if(v.eventDate&&!/^\d{4}-\d{2}-\d{2}$/.test(v.eventDate))e.eventDate='Enter a valid date.';
 if(v.guests&&(!/^\d+$/.test(v.guests)||Number(v.guests)<1||Number(v.guests)>10000))e.guests='Enter a guest count between 1 and 10,000.';
 return e;
}
