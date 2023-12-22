
 const p = new Promise((resolve, reject) => {
     reject(42)
 })

 function notAsync () {
     p.then(n => console.log(n))
         .catch(e => console.log(e))
 }

 async function isAsync() {
     try {
         const n = await p
         console.log(n)
     } catch (e) {
         console.log(e)
     }
 }



