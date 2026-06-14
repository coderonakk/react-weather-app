import { useEffect, useState } from "react"

const App = () => {

  const [city, setcity] = useState('')
  const [location, setlocation] = useState('')
  const [temp, settemp] = useState('')
  const [icon, seticon] = useState('')
  const [weather, setweather] = useState('')
  const [loading, setloading] = useState(false)
  const [error, seterror] = useState('')
  const [arr, setarr] = useState([])

  let hello = JSON.parse(localStorage.getItem('arr'))

  const getdata = async (e) => {

    e.preventDefault()

    setloading(true)

    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=45367e0542964ad1a57114255261206&q=${city}&aqi=no`)

    const data = await response.json()

    if (data.error) {
      seterror(data.error.message)
      setloading(false)

      settemp('')
      setlocation('')
      setweather('')
      return
    }


    seterror('');

    settemp(data.current.temp_c);
    setweather(data.current.condition.text);
    seticon(data.current.condition.icon);
    setlocation(data.location.name);



    let copyarr = [...arr, data.location.name]



    copyarr = arr.filter(item => item !== data.location.name)
    copyarr.push(data.location.name)

    if (copyarr.length > 5) {
      copyarr.shift()
    }

    setarr(copyarr)

    setcity('')

    setloading(false)

    localStorage.setItem('arr', JSON.stringify(copyarr))

  }

  useEffect(function () {
    if (hello) {
      setarr(hello)
    }
  }, [])

  let textstate


  if (loading) {
    textstate = <h1 className="mt-20 text-2xl font-bold text-cyan-400 text-center">Loading...</h1>
  }

  else if (error) {
    textstate = <h1 className="mt-20 text-xl font-bold text-red-400 text-center">City not found</h1>
  }

  else if (temp) {
    textstate = (
      <div className="mt-12 w-full max-w-3xl bg-slate-800 rounded-3xl px-15 py-5 flex flex-col md:flex-row items-center justify-between gap-15">
        <h1 className="text-xl font-bold text-white underline">{location}</h1>
        <h2 className="text-lg font-medium text-white">
          Around {temp} Degrees</h2>
        <img className="h-10 w-10" src={icon} alt="" />
        <h1 className="text-lg text-slate-300">
          {weather}</h1>
      </div>
    )
  }


  else {
    textstate = <h1 className="mt-20 text-xl text-slate-400 font-medium text-center">No Data Available</h1>
  }


  return (
    <div className='h-screen bg-[url("https://images.unsplash.com/photo-1516572704891-60b47497c7b5?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")] bg-cover bg-center w-full text-white flex flex-col items-center px-4 py-8'>

      <form className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-10" action="" onSubmit={(e) => {
        getdata(e)
      }}>
        <input
          autoFocus
          className="w-full bg-slate-800/80 border border-slate-700 text-white font-medium px-5 py-3 rounded-2xl "
          onChange={(e) => {
            setcity(e.target.value)
          }}
          value={city}
          type="text"
        />

        <button className="bg-white text-black font-bold px-6 py-3 rounded-2xl active:scale-95 shrink-0">
          Get weather
        </button>
      </form>

      <div className="mt-4">
        <button
          className="bg-red-500 text-white font-semibold rounded-xl px-4 py-2 active:scale-95"
          onClick={() => {
            setarr([])
            localStorage.setItem('arr', JSON.stringify([]))
          }}
        >
          Clear Recents
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-3xl">
        {arr.map(function (elem, idx) {
          return (
            <div key={idx} className="bg-slate-800 border border-slate-700 text-white rounded-full px-3 py-1 text-sm shadow-md">
              <button
                onClick={() => {
                  setcity(elem)
                }}
                className="cursor-pointer hover:text-white-400 transition-colors active:scale-95"
              >
                {elem}
              </button>
            </div>
          )
        })}
      </div>

      <div>{textstate}</div>

    </div >
  )

}

export default App

