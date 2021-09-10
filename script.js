

let openBtn=document.querySelector("#open");
let addBtn=document.querySelector("#add");
let input=document.querySelector("input");
let db;

addBtn.addEventListener("click",function(){
    if(!db){
        alert("Database has not been opened yet.");
        // console.log(5);
        return;
    }
    // console.log(4);
    let value=input.value;
    input.value="";
    let tx=db.transaction("csNotes", "readwrite");
    let csNotesObjectStore=tx.objectStore("csNotes");
    let data={
        note: value,
        cId:Date.now(),
    };
    // console.log(6);
    csNotesObjectStore.add(data);

})


openBtn.addEventListener("click",function(){
    let res=indexedDB.open("notes",1);
    res.addEventListener("success",function(){
        db=res.result;
        // console.log(1);
        // console.log(db);
        alert("Successfully Opened the Database");
    })
    res.addEventListener("upgradeneeded",function(){
        db=res.result;
        db.createObjectStore("csNotes", { keyPath:"cId" });
        console.log(2);/
        // console.log(db);
    
    })
    res.addEventListener("error",function(){
        // console.log(3);
        alert("Error occurred while opening the Database");
    })
})


