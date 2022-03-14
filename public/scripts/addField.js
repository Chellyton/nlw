//Procurar o botao
document.querySelector("#add-time").addEventListener("click",cloneField)
//Quando clicar no botao

//Executar uma acao
 function cloneField(){
    //Duplicar os campos   
    const newFieldContainer = document.querySelector(".schedule-item").cloneNode(true)

    //Pegar os campos
    const fields = newFieldContainer.querySelectorAll('input')
    

    //Limpar os campos
    for(i in fields){
        console.log(newFieldContainer)
        fields[i].value=""
    }

    //Colonar na página
    document.querySelector("#schedule-items").appendChild(newFieldContainer)
}

    