function a(){
    ddl=document.getElementById("data_y")
    var selectedValue = ddl.options[ddl.selectedIndex].value;
      if(selectedValue==="Seller"){
        document.getElementById("a").classList.remove("dat");
        document.getElementById("b").classList.add("dat");
      }
      else if(selectedValue==="Investor"){
      document.getElementById("b").classList.remove("dat");
      document.getElementById("a").classList.add("dat");
    }
    else{
      document.getElementById("b").classList.add("dat");
      document.getElementById("a").classList.add("dat");
    }
  }