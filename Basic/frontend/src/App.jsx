import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {

  const [data , setData] = useState([])

  useEffect(() => {
    axios.get(`/api/data`)
    .then((res) => {
      setData(res.data)
    })
    .catch((error) => {
      console.log(error);
    })
  } , [])

  return (
    <>
      <div>
        <h1>hello , Backend</h1>
        <h2>data : {data.length}</h2>

        {
          data.map((data , index) => (
            <div key={data.id}>
              <h3>{data.Name}</h3>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default App
