
const express =require('express')
const app=express()
const port=3000

const t=()=>{
let t=new Date()
return t.getHours()+':'+t.getMinutes()+':'+t.getSeconds()+':'+t.getMilliseconds()
}

app.get('*',(req, res)=>{
res.send('\nRequest made at : '+t())
console.log('Response made at: '+t())
})

app.listen(port,()=>{
console.log('Listening on '+port)
})

