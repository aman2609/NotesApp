alert("Open the Database!!")

let view=document.querySelector("#view");
let openBtn=document.querySelector("#open");
let addBtn=document.querySelector("#add");
let input=document.querySelector("input");
let body=document.querySelector("body");
let table=document.querySelector("table");
let db;

// let tempData = [
//     { cId: 2423534534, note: "this is note 1" },
//     { cId: 2426634534, note: "this is note2" },
//     { cId: 2113534534, note: "this is note 3" },
//   ];

view.addEventListener("click",function(){

    let isOpen=view.getAttribute("data-open");
    if(isOpen=="true"){
        table.innerHTML="";
        view.setAttribute("data-open","false");
        
        return;
    }
    view.setAttribute("data-open","true");
    table.innerHTML=`<table>
    <thead>
        <th>Sr No.</th>
        <th>Note</th>
        <th>Delete</th>
    </thead>
    <tbody>
    </tbody>`;

    let tx=db.transaction("csNotes", "readonly");

    let csNotesObjectStore=tx.objectStore("csNotes");

    let tbody=table.querySelector("tbody");

    let serialNumber=1;

    let req=csNotesObjectStore.openCursor();
    req.addEventListener("success",function(){
        let cursor=req.result;

        if(cursor){
            let currObj=cursor.value;
            // console.log(currObj);
            let tr=document.createElement("tr");
            tr.innerHTML=`<td>${serialNumber}</td>
            <td>${currObj.note}</td>
            <td><button data-id=${currObj.cId}>Delete</button></td>`;
            let deleteBtn=tr.querySelector("button");
            deleteBtn.addEventListener("click",function(){
                deleteBtn.parentElement.parentElement.remove();
                deleteNote(Number(deleteBtn.getAttribute("data-id")));
            })
            
            tbody.append(tr);

            serialNumber++;

            

            cursor.continue();
            
        }

    })



    
    // let tbody=document.querySelector("tbody");
    // for(let i=0;i<tempData.length;i++){
    //     let tr=document.createElement("tr");
    //     tr.innerHTML=`<td>${i+1}</td>
    //     <td>${tempData[i].note}</td>
    //     <td><button>Delete</button></td>`;
    //     tbody.append(tr);
    // }
})

  

// view.addEventListener("click",function(){
//     for(let i=0;i<tempData.length;i++){
//         let cuurentData=tempData[i];
//         let div=document.createElement('div');
//         div.classList.add("note");
//         div.innerHTML=`<div class="id-div"></div>
//         <div class="note-div"></div>`

//         let idDiv=div.querySelector(".id-div");
//         let noteDiv=div.querySelector(".note-div");
//         idDiv.innerText=cuurentData.cId;
//         noteDiv.innerText=cuurentData.note;
//         div.append(idDiv);
//         div.append(noteDiv);
//         body.append(div);
//     }
// })

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
    let isOpen=view.getAttribute("data-open");
    if(isOpen=="true"){
        view.click();
        view.click();
    }

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
        console.log(2);
        // console.log(db);
    
    })
    res.addEventListener("error",function(){
        // console.log(3);
        alert("Error occurred while opening the Database");
    })
})


function deleteNote(cId){
    let tx=db.transaction("csNotes","readwrite");
    let csNotesObjectStore=tx.objectStore("csNotes");
    csNotesObjectStore.delete(cId);
    let isOpen=view.getAttribute("data-open");
    if(isOpen=="true"){
        view.click();
        view.click();
    }
}


