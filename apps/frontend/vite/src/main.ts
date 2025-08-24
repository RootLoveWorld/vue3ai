 import {sum} from './sum.ts'
type User = {
    name:string,
    age:number
}

const user:User = {
    name:'Miracle',
    age:18
}

console.log(user);

console.log(sum(1,2));
const sayHello = ()=>{
    console.log(user.name + " say hello")
}

function setStyle(){
    document.title = "Vite First";

    document.body.style.backgroundColor = '#c590c5';
}

setStyle();