import React, { useEffect, useState } from 'react'
import './Homepage.css'
const Homepage = () => {
    const [datas,setdatas] = useState([]);
    const [detail,setdetail] = useState([]);
    const [popup,setpopup] = useState(false);
    useEffect(()=>{
          fetch("https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json&page=2")
          .then((res)=>res.json())
          .then((output)=>{
            setdatas(output.Results);
          })
          .catch((e)=>console.log(e))
    },[])
    function searchhandler(value){
            let newdata = datas.filter((data)=>{
                if(data.Mfr_CommonName!==null){
                    value = value.toLowerCase();
                   return data.Mfr_CommonName.toLowerCase().includes(value)
                }
        })
        setdatas(newdata);
        if(value===""){
          fetch("https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json&page=2")
          .then((res)=>res.json())
          .then((output)=>{
            setdatas(output.Results);
          })
          .catch((e)=>console.log(e))
        }
    }
    function clickhandler(id){
      fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmanufacturerdetails/${id}?format=json`)
      .then((res)=>res.json())
      .then((output)=>{
       setdetail(output.Results)
       setpopup(true);
      })
      .catch((e)=>console.log(e))
    }
  return (
    <>
    {popup?<div id='popup-container'>
        <h1>{detail[0].Mfr_Name}</h1>
         <h3>{detail[0].PrincipalFirstName}(CEO)</h3>
         <h3>{detail[0].Address}</h3>
         { <h3>{detail[0].City}</h3>}
         <button onClick={(e)=>{e.preventDefault();
        setpopup(false)}}>Cancel</button>
    </div>:
    <div id='main-container'>
        <h1>Vehicle Manufacturer</h1>
        <div id='filter'>
        <div id='searchbar'>
        <span>Search:</span><input onChange={(e)=>{searchhandler(e.target.value)}} />
        </div>
        <div><h4>Filter by vehicle type : All</h4>
        </div>
        </div>
        <table>
            <thead>
            <tr>
                    <th>Name</th>
                    <th>Country</th>
                    <th>Type</th>
                    </tr>
            </thead>
                    <tbody>
                        {
                           datas.map((data,index)=>{
                            if(data.VehicleTypes.length>0&&data.Mfr_CommonName!==null){
                                return(
                                    <tr key={index} onClick={()=>{clickhandler(data.Mfr_ID)}}> 
                                        <td>{data.Mfr_CommonName}</td>
                                        <td>{data.Country}</td>
                                        <td>{data.VehicleTypes[0].Name}</td>
                                    </tr>
                                   )
                            }
                           })
                        }
                    </tbody>
        </table>
    </div>
}
    </>
  )
}

export default Homepage;
